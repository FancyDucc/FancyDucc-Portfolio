from js import document, window, console
from pyodide.ffi import create_proxy
import math, random, time
from collections import deque

canvas = document.getElementById("game")
ctx = canvas.getContext("2d")
score_el = document.getElementById("score")
lives_el = document.getElementById("lives")
level_el = document.getElementById("level")
toast_el = document.getElementById("toast")
reset_btn = document.getElementById("reset")

W, H = canvas.width, canvas.height
TILE = 24
MAZE = [
"XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
"X............XX............X",
"X.XXXX.XXXXX.XX.XXXXX.XXXX.X",
"XoXXXX.XXXXX.XX.XXXXX.XXXXoX",
"X.XXXX.XXXXX.XX.XXXXX.XXXX.X",
"X..........................X",
"X.XXXX.XX.XXXXXXXX.XX.XXXX.X",
"X.XXXX.XX.XXXXXXXX.XX.XXXX.X",
"X......XX....XX....XX......X",
"XXXXXX.XXXXX XX XXXXX.XXXXXX",
"     X.XXXXX XX XXXXX.X     ",
"     X.XX          XX.X     ",
"     X.XX XXXHHXXX XX.X     ",
"XXXXXX.XX X      X XX.XXXXXX",
"      .   X XXXX X   .      ",
"XXXXXX.XX X      X XX.XXXXXX",
"     X.XX XXXHHXXX XX.X     ",
"     X.XX          XX.X     ",
"     X.XXXXX XX XXXXX.X     ",
"XXXXXX.XXXXX XX XXXXX.XXXXXX",
"X............XX............X",
"X.XXXX.XXXXX.XX.XXXXX.XXXX.X",
"X.XXXX.XXXXX.XX.XXXXX.XXXX.X",
"Xo..XX................XX..oX",
"XXX.XX.XX.XXXXXXXX.XX.XX.XXX",
"X......XX....XX....XX......X",
"X.XXXXXXXXXX.XX.XXXXXXXXXX.X",
"X..........................X",
"XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
"XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
"XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
]

EMOJI_FONT = "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','Twemoji Mozilla','EmojiOne Color',system-ui,sans-serif"

EMOJI_DUCK = "🦆"
EMOJI_PELLET = "🔹"
EMOJI_POWER  = "🍉"

EMOJI_GHOST_BY_NAME = {
    "blinky": "🦅",
    "pinky":  "🦢",
    "inky":   "🐧",
    "clyde":  "🦉",
}

EMOJI_FRIGHT_1 = "🐥"
EMOJI_FRIGHT_2 = "🐣"

TILT_MAX = math.radians(10)

ROWS = len(MAZE)
COLS = len(MAZE[0])

NEI = [(-1,0),(1,0),(0,-1),(0,1)]
H_TILES = [(c,r) for r,row in enumerate(MAZE) for c,ch in enumerate(row) if ch == "H"]

def _is_path_only(c,r):
    return 0 <= c < COLS and 0 <= r < ROWS and MAZE[r][c] in (" ",".", "o")

PORTALS = []
for (c,r) in H_TILES:
    for dc,dr in NEI:
        nc,nr = c+dc, r+dr
        if _is_path_only(nc,nr):
            PORTALS.append((nc,nr))
PORTALS = sorted(set(PORTALS))

HOUSE_CENTER = (14,15)

POPS = []

AudioCtor = getattr(window, "AudioContext", None) or getattr(window, "webkitAudioContext", None)
_audio = AudioCtor.new()
_master = _audio.createGain()
_master.gain.value = 0.15
_master.connect(_audio.destination)

def in_bounds(c, r): return 0 <= c < COLS and 0 <= r < ROWS
def is_wall(c, r): return not in_bounds(c,r) or MAZE[r][c] == "X"
def is_door(c, r): return in_bounds(c,r) and MAZE[r][c] == "H"
def is_path(c, r): return in_bounds(c,r) and MAZE[r][c] in (" ", ".", "o", "H")
def add_popup(x,y,text): POPS.append({"x":x,"y":y,"text":text,"t":0.0,"life":0.8})

initial_pellets = {}
for r,row in enumerate(MAZE):
    for c,ch in enumerate(row):
        if ch == ".": initial_pellets[(c,r)] = "dot"
        elif ch == "o": initial_pellets[(c,r)] = "power"

def step_flip(ent, dt, desired_lr):
    if desired_lr != ent.face_lr and not getattr(ent, "flip_active", False):
        ent.flip_active = True
        ent.flip_anim = 0.0
        ent.flip_swapped = False
        ent.face_lr_target = desired_lr

    if getattr(ent, "flip_active", False):
        ent.flip_anim += dt / 0.14
        if not ent.flip_swapped and ent.flip_anim >= 0.5:
            ent.face_lr = ent.face_lr_target
            ent.flip_swapped = True
        if ent.flip_anim >= 1.0:
            ent.flip_active = False
            ent.flip_anim = 0.0

    t = ent.flip_anim if getattr(ent, "flip_active", False) else 0.0
    squash = abs(math.cos(math.pi * t))
    return squash

def draw_emoji(ch, x, y, size, rotate=0.0, alpha=1.0, flip_x=-1, squash=1.0):
    ctx.save()
    ctx.translate(x, y)

    if squash != 1.0:
        ctx.scale(max(0.0, squash), 1)

    if flip_x == 1:
        ctx.scale(-1, 1)

    if rotate:
        ctx.rotate(rotate)

    ctx.font = f"{int(size)}px {EMOJI_FONT}"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.globalAlpha = max(0.0, min(1.0, alpha))
    ctx.fillText(ch, 0, 1)
    ctx.restore()

def wrap_col(c):
    if c < 0: return COLS-1
    if c >= COLS: return 0
    return c

def dir_angle(d: str) -> float:
    return {"left": math.pi, "right": 0, "up": -math.pi/2, "down": math.pi/2}[d]

def lerp_angle(a, b, t):
    d = (b - a + math.pi) % (2*math.pi) - math.pi
    return a + d * t

DIRS = {
    "left": (-1, 0), "right": (1, 0), "up": (0, -1), "down": (0, 1)
}
OPPOSITE = {"left":"right","right":"left","up":"down","down":"up"}

def tile_center(x):
    return x * TILE + TILE/2

class Entity:
    def __init__(self, tc, tr, speed_tiles, color):
        self.x = tile_center(tc)
        self.y = tile_center(tr)
        self.dir = "left"
        self.next_dir = None
        self.speed = speed_tiles * TILE
        self.color = color

    def tile(self):
        return (int(self.x // TILE), int(self.y // TILE))

    def at_center_of_tile(self):
        cx = (self.x % TILE) - TILE/2
        cy = (self.y % TILE) - TILE/2
        return abs(cx) <= 1.8 and abs(cy) <= 1.8

    def can_move(self, d):
        dc, dr = DIRS[d]
        c, r = self.tile()
        nc, nr = c + dc, r + dr
        if nc < 0 or nc >= COLS:
            wc = wrap_col(nc)
            return is_path(wc, r)
        return is_path(nc, nr)

    def step(self, dt):
        c, r = self.tile()
        cx, cy = tile_center(c), tile_center(r)

        if self.at_center_of_tile() and self.next_dir and self.can_move(self.next_dir):
            self.dir = self.next_dir
            self.next_dir = None

        dx, dy = DIRS[self.dir]

        if not self.can_move(self.dir):
            if self.dir == "left":   self.x = max(self.x - self.speed*dt, cx)
            elif self.dir == "right": self.x = min(self.x + self.speed*dt, cx)
            elif self.dir == "up":    self.y = max(self.y - self.speed*dt, cy)
            else:                     self.y = min(self.y + self.speed*dt, cy)
        else:
            self.x += dx * self.speed * dt
            self.y += dy * self.speed * dt

        if self.x < 0: self.x = W - 1
        elif self.x >= W: self.x = 1

        snap_rate = 14.0
        if self.dir in ("left","right"):
            self.y += (cy - self.y) * min(1.0, dt * snap_rate)
        else:
            self.x += (cx - self.x) * min(1.0, dt * snap_rate)

class PacMan(Entity):
    def __init__(self, tc, tr):
        super().__init__(tc, tr, speed_tiles=6.0, color="#FFE400")
        self.mouth = 0.0
        self.mouth_dir = 1
        self.power_timer = 0.0
        self.score = 0
        self.lives = 3
        self.visual_angle = dir_angle("left")
        self.state = "alive"
        self.state_timer = 0.0
        self.spawn_anim = 0.0
        self.death_t = 0.0
        self.eat_chain = 0
        self.face_lr = -1
        self.visual_tilt = 0.0
        self.flip_active = False
        self.flip_anim = 0.0
        self.flip_swapped = False
        self.face_lr_target = -1
        self.flip_scale = 1.0

class Ghost(Entity):
    def __init__(self, tc, tr, color, name):
        super().__init__(tc, tr, speed_tiles=5.0, color=color)
        self.name = name
        self.mode = "normal"
        self.fright_timer = 0.0
        self.spawn = (tc, tr)
        self.eye_vx, self.eye_vy = 1.0, 0.0
        self.wave = 0.0
        self.face_lr = -1
        self.visual_tilt = 0.0
        self.flip_active = False
        self.flip_anim = 0.0
        self.flip_swapped = False
        self.face_lr_target = -1
        self.flip_scale = 1.0
        self.return_phase = None
        self.target_tile = None
        self.stun_timer = 0.0

class SoundEngine:
    def __init__(self, ctx, master):
        self.ctx = ctx
        self.master = master
        self._last_dot = 0.0
        self._dot_toggle = False

    def resume(self):
        if self.ctx.state == "suspended":
            self.ctx.resume()

    def _tone(self, freq=440, dur=0.08, type="square", vol=0.30, glide_to=None, at=None):
        t0 = at if at is not None else self.ctx.currentTime
        o = self.ctx.createOscillator()
        g = self.ctx.createGain()
        o.type = type
        o.frequency.setValueAtTime(freq, t0)
        if glide_to is not None:
            o.frequency.linearRampToValueAtTime(glide_to, t0 + dur)
        g.gain.setValueAtTime(0.0001, t0)
        g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01)
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
        o.connect(g); g.connect(self.master)
        o.start(t0); o.stop(t0 + dur + 0.02)

    def dot(self):
        now = self.ctx.currentTime
        if now - self._last_dot < 0.04:
            return
        self._last_dot = now
        self._dot_toggle = not self._dot_toggle
        f = 880 if self._dot_toggle else 980
        self._tone(f, 0.05, "square", vol=0.22)

    def power_start(self):
        self._tone(620, 0.22, "sawtooth", vol=0.18, glide_to=340)

    def ghost(self, chain=1):
        base = 400
        mult = [1, 1.25, 1.5, 2.0][min(max(chain,1)-1, 3)]
        self._tone(base*mult, 0.22, "square", vol=0.28, glide_to=base*mult*1.8)

    def death(self):
        t = self.ctx.currentTime
        self._tone(600, 0.25, "triangle", vol=0.26, glide_to=180, at=t)
        self._tone(520, 0.35, "triangle", vol=0.24, glide_to=120, at=t+0.12)

    def start(self):
        t = self.ctx.currentTime
        self._tone(660, 0.12, "square", vol=0.22, at=t)
        self._tone(880, 0.12, "square", vol=0.22, at=t+0.11)

    def level(self):
        t = self.ctx.currentTime
        self._tone(740, 0.15, "square", vol=0.22, at=t)
        self._tone(988, 0.15, "square", vol=0.22, at=t+0.12)

SND = SoundEngine(_audio, _master)

def find_spawn_far_from_ghosts(pellets, ghosts):
    dist_maps = []
    for g in ghosts:
        dist_maps.append(bfs_from(g.tile()))
    best = None
    best_score = -1
    for r in range(ROWS):
        for c in range(COLS):
            if not is_path(c,r): continue
            s = 0
            ok = True
            for dmap in dist_maps:
                d = dmap[r][c]
                if d is None: ok = False; break
                s += d
            if ok and s > best_score:
                best_score = s
                best = (c,r)
    return best if best else (13, 23)

def reset_round(level=1):
    state = {}
    state["level"] = level
    state["paused"] = False
    state["pellets"] = dict(initial_pellets)
    pac = PacMan(13, 23)
    ghosts = [
        Ghost(13, 14, "#FF4C4C", "blinky"),
        Ghost(14, 14, "#FFB8FF", "pinky"),
        Ghost(13, 15, "#00FFFF", "inky"),
        Ghost(14, 15, "#FFB852", "clyde"),
    ]
    ghosts[1].speed = 4.8*TILE
    ghosts[2].speed = 5.2*TILE
    ghosts[3].speed = 4.6*TILE
    state["pac"] = pac
    state["ghosts"] = ghosts
    state["power_length"] = max(6.0 - (level-1)*0.5, 3.5)
    return state

STATE = reset_round(level=1)

def on_keydown(e):
    SND.resume()
    k = (e.key or "").lower()
    p = STATE["pac"]
    if k in ("arrowleft","a"): p.next_dir = "left"; e.preventDefault()
    elif k in ("arrowright","d"): p.next_dir = "right"; e.preventDefault()
    elif k in ("arrowup","w"): p.next_dir = "up"; e.preventDefault()
    elif k in ("arrowdown","s"): p.next_dir = "down"; e.preventDefault()
    elif k == "r": hard_reset()
    elif k == "p": toggle_pause()

kd_proxy = create_proxy(on_keydown)
document.addEventListener("keydown", kd_proxy)

def on_click_reset(e): hard_reset()
reset_proxy = create_proxy(on_click_reset)
reset_btn.addEventListener("click", reset_proxy)

def toggle_pause():
    STATE["paused"] = not STATE["paused"]
    if STATE["paused"]:
        toast_el.innerText = "PAUSED"
        toast_el.classList.remove("hide")
    else:
        toast_el.classList.add("hide")
        toast_el.innerText = ""

def hard_reset():
    global STATE
    lv = STATE["level"]
    STATE = reset_round(level=lv)
    score_el.innerText = str(STATE["pac"].score)
    lives_el.innerText = str(STATE["pac"].lives)
    level_el.innerText = str(STATE["level"])
    toast("reset")
    SND.start()

def toast(msg, hold=1.2):
    if not msg:
        toast_el.classList.add("hide")
        toast_el.innerText = ""
        return
    toast_el.innerText = msg.upper()
    toast_el.classList.remove("hide")

    def hide(*_):
        toast_el.classList.add("hide")

    window.setTimeout(create_proxy(hide), int(hold * 1000))

def bfs_from(src):
    (sc, sr) = src
    dist = [[None for _ in range(COLS)] for __ in range(ROWS)]
    dq = deque()
    if not is_path(sc,sr): return dist
    dist[sr][sc] = 0; dq.append((sc,sr))
    while dq:
        c,r = dq.popleft()
        for d in ("left","right","up","down"):
            dc,dr = DIRS[d]
            nc,nr = c+dc, r+dr
            if nc < 0 or nc >= COLS:
                nc = wrap_col(nc)
            if in_bounds(nc,nr) and is_path(nc,nr) and dist[nr][nc] is None:
                dist[nr][nc] = dist[r][c] + 1
                dq.append((nc,nr))
    return dist

def next_step_towards(src, dst):
    if src == dst: return None
    dist = bfs_from(dst)
    c,r = src
    best_d, best_val = None, 1e9
    for d in ("left","right","up","down"):
        dc,dr = DIRS[d]
        nc,nr = c+dc, r+dr
        if nc < 0 or nc >= COLS: nc = wrap_col(nc)
        if in_bounds(nc,nr) and is_path(nc,nr):
            dv = dist[nr][nc]
            if dv is not None and dv < best_val:
                best_val, best_d = dv, d
    return best_d

def nearest_portal_from(src):
    dmap = bfs_from(src)
    best = None; bestd = 1e9
    for (pc,pr) in PORTALS:
        d = dmap[pr][pc]
        if d is not None and d < bestd:
            bestd, best = d, (pc,pr)
    return best

def has_line_of_sight(a, b):
    c1,r1 = a; c2,r2 = b
    if r1 == r2:
        step = 1 if c2 > c1 else -1
        for c in range(c1+step, c2, step):
            if is_wall(c, r1): return False
        return True
    if c1 == c2:
        step = 1 if r2 > r1 else -1
        for r in range(r1+step, r2, step):
            if is_wall(c1, r): return False
        return True
    return False

def eat_pellet_if_present():
    p = STATE["pac"]
    c,r = p.tile()
    if not p.at_center_of_tile(): return
    key = (c,r)
    kind = STATE["pellets"].get(key)
    if not kind: return
    del STATE["pellets"][key]
    if kind == "dot":
        p.score += 10
        SND.dot()
    else:
        p.score += 50
        p.power_timer = STATE["power_length"]
        SND.power_start()
        for g in STATE["ghosts"]:
            if g.mode != "eaten":
                g.mode = "frightened"
                g.fright_timer = p.power_timer
    score_el.innerText = str(p.score)

def check_win():
    if not STATE["pellets"]:
        lv = STATE["level"] + 1
        pscore = STATE["pac"].score
        lives = STATE["pac"].lives
        toast("level complete!", hold=1.5)
        SND.level()
        new = reset_round(level=lv)
        new["pac"].score = pscore
        new["pac"].lives = lives
        for g in new["ghosts"]:
            g.speed *= 1.06
        globals()["STATE"] = new
        level_el.innerText = str(lv)

def handle_collisions():
    p = STATE["pac"]
    for g in STATE["ghosts"]:
        if g.mode == "eaten": continue
        dx = (g.x - p.x); dy = (g.y - p.y)
        if (dx*dx + dy*dy) ** 0.5 <= 10:
            if p.power_timer > 0 and g.mode == "frightened":
                chain_vals = [200,400,800,1600]
                p.eat_chain = min(p.eat_chain + 1, 4)
                gain = chain_vals[p.eat_chain-1]
                p.score += gain; score_el.innerText = str(p.score)
                add_popup(g.x, g.y-6, str(gain))
                SND.ghost(p.eat_chain)

                g.mode = "eaten"
                g.stun_timer = 0.5
                g.return_speed = g.speed * 1.2
            else:
                p.lives -= 1; lives_el.innerText = str(p.lives)
                SND.death()
                p.power_timer = 0
                p.state = "hit"; p.state_timer = 0.5
                STATE["freeze_ghosts"] = True
                if p.lives <= 0:
                    toast("game over", hold=2.0)
                    hard_reset()
                else:
                    toast("ouch!", hold=0.8)
                    spawn = find_spawn_far_from_ghosts(STATE["pellets"], STATE["ghosts"])
                    p.x, p.y = tile_center(spawn[0]), tile_center(spawn[1])
                    p.dir = "left"; p.next_dir = "left"
                    p.power_timer = 0

def update_pac(dt):
    p = STATE["pac"]

    if STATE.get("ready_timer", 0) > 0 or p.state != "alive":
        if p.state == "hit":
            p.state_timer -= dt
            if p.state_timer <= 0:
                p.state = "dying"
                p.death_t = 0.0
                p.visual_angle = dir_angle("up")
        elif p.state == "dying":
            p.death_t = min(1.0, p.death_t + dt/0.9)
            if p.death_t >= 1.0:
                p.state = "spawning"
                STATE["ready_timer"] = 1.0
                spawn = find_spawn_far_from_ghosts(STATE["pellets"], STATE["ghosts"])
                p.x, p.y = tile_center(spawn[0]), tile_center(spawn[1])
                p.dir = "left"; p.next_dir = None
                p.mouth = 0.0; p.mouth_dir = 1
                p.spawn_anim = 0.0
        elif p.state == "spawning":
            p.spawn_anim = min(1.0, p.spawn_anim + dt/0.6)
            if STATE["ready_timer"] <= 0:
                p.state = "alive"
        return

    p.step(dt)

    p.mouth += 2.2 * dt * p.mouth_dir
    if p.mouth > 1.0: p.mouth = 1.0; p.mouth_dir = -1
    if p.mouth < 0.0: p.mouth = 0.0; p.mouth_dir = 1

    desired_lr = (1 if p.dir == "right" else -1) if p.dir in ("left","right") else p.face_lr
    p.flip_scale = step_flip(p, dt, desired_lr)

    if p.dir in ("up","down"):
        ud = +1 if p.dir == "up" else -1
        if p.face_lr == 1:
            ud = -ud
        tilt_target = ud * TILT_MAX
    else:
        tilt_target = 0.0

    p.visual_tilt += (tilt_target - p.visual_tilt) * min(1.0, dt*12)

    if p.power_timer > 0:
        p.power_timer -= dt
        if p.power_timer <= 0:
            p.power_timer = 0
            p.eat_chain = 0
            for g in STATE["ghosts"]:
                if g.mode == "frightened": g.mode = "normal"

    eat_pellet_if_present()

def random_move_dir(g):
    options = []
    for d in ("left","right","up","down"):
        if OPPOSITE.get(d) == g.dir: continue
        if g.can_move(d): options.append(d)
    if not options:
        if g.can_move(OPPOSITE.get(g.dir,"left")):
            return OPPOSITE[g.dir]
        return g.dir
    return random.choice(options)

def update_ghost(g, dt):
    p = STATE["pac"]

    if g.mode == "frightened":
        g.fright_timer -= dt
        if g.fright_timer <= 0:
            g.mode = "normal"

    if g.mode == "eaten":
        if getattr(g, "stun_timer", 0) > 0:
            g.stun_timer -= dt
        else:
            if not hasattr(g, "return_phase") or g.return_phase is None:
                g.return_phase = "to_portal"
                g.target_tile = nearest_portal_from(g.tile()) or (H_TILES[0] if H_TILES else (13,14))

            gt = g.tile()

            if g.return_phase == "to_portal":
                if gt == g.target_tile:
                    c,r = gt
                    door = None
                    for dc,dr in NEI:
                        nc,nr = c+dc, r+dr
                        if in_bounds(nc,nr) and MAZE[nr][nc] == "H":
                            door = (nc,nr); break
                    g.return_phase = "to_door"
                    g.target_tile = door or (H_TILES[0] if H_TILES else (13,14))
                else:
                    nd = next_step_towards(gt, g.target_tile)
                    if nd:
                        g.next_dir = nd
                        if not g.can_move(g.dir): g.dir = nd

            elif g.return_phase == "to_door":
                if gt == g.target_tile:
                    g.return_phase = "to_center"
                    g.target_tile = HOUSE_CENTER
                else:
                    nd = next_step_towards(gt, g.target_tile)
                    if nd:
                        g.next_dir = nd
                        if not g.can_move(g.dir): g.dir = nd

            elif g.return_phase == "to_center":
                if gt == g.target_tile:
                    g.mode = "normal"
                    g.return_phase = None
                    g.target_tile = None
                    g.stun_timer = 0.0
                    g.dir = random.choice(("left","right","up","down"))
                else:
                    nd = next_step_towards(gt, g.target_tile)
                    if nd:
                        g.next_dir = nd
                        if not g.can_move(g.dir): g.dir = nd

            orig = g.speed
            g.speed = getattr(g, "return_speed", orig)
            g.step(dt)
            g.speed = orig

        dx, dy = DIRS[g.dir]
        mag = (dx*dx + dy*dy) ** 0.5 or 1.0
        tx, ty = dx/mag, dy/mag
        g.eye_vx += (tx - g.eye_vx) * min(1.0, dt*10)
        g.eye_vy += (ty - g.eye_vy) * min(1.0, dt*10)
        g.wave += dt * 6.0
        return
    
    if g.at_center_of_tile():
        gt = g.tile()
        pt = p.tile()
        sees = has_line_of_sight(gt, pt)
        chosen = None

        if p.power_timer > 0 and g.mode == "frightened":
            if sees:
                dmap = bfs_from(pt)
                bestd, bestv = None, -1
                for d in ("left","right","up","down"):
                    if OPPOSITE.get(d) == g.dir: continue
                    dc,dr = DIRS[d]; nc,nr = gt[0]+dc, gt[1]+dr
                    if nc < 0 or nc >= COLS: nc = wrap_col(nc)
                    if in_bounds(nc,nr) and is_path(nc,nr):
                        val = dmap[nr][nc]
                        if val is not None and val > bestv:
                            bestv, bestd = val, d
                chosen = bestd if bestd else random_move_dir(g)
            else:
                chosen = random_move_dir(g)
        else:
            if sees:
                nd = next_step_towards(gt, pt)
                chosen = nd if nd else random_move_dir(g)
            else:
                chosen = random_move_dir(g)

        if chosen: g.next_dir = chosen

    desired_lr = (1 if g.dir == "right" else -1) if g.dir in ("left","right") else g.face_lr
    g.flip_scale = step_flip(g, dt, desired_lr)

    if g.dir in ("up","down"):
        ud = +1 if g.dir == "up" else -1
        if g.face_lr == 1:
            ud = -ud
        tilt_target = ud * TILT_MAX
    else:
        tilt_target = 0.0

    g.visual_tilt += (tilt_target - g.visual_tilt) * min(1.0, dt*12)

    dx, dy = DIRS[g.dir]
    mag = (dx*dx + dy*dy) ** 0.5 or 1.0
    tx, ty = dx/mag, dy/mag
    g.eye_vx += (tx - g.eye_vx) * min(1.0, dt*10)
    g.eye_vy += (ty - g.eye_vy) * min(1.0, dt*10)
    g.wave += dt * (10.0 if g.mode == "frightened" else 6.0)

    orig = g.speed
    g.speed = orig * (0.8 if g.mode == "frightened" else 1.0)
    g.step(dt)
    g.speed = orig

def update(dt):
    if STATE.get("ready_timer",0) > 0:
        STATE["ready_timer"] -= dt
        if STATE["ready_timer"] <= 0:
            STATE["freeze_ghosts"] = False

    if STATE["paused"]:
        return

    update_pac(dt)

    if not STATE.get("freeze_ghosts", False):
        for g in STATE["ghosts"]:
            update_ghost(g, dt)

    handle_collisions()
    update_popups(dt)
    check_win()

WALL = "#1a1a1a"
DOT = "#f2f2f2"
PWR = "#9b00e6"

def draw_maze():
    ctx.fillStyle = "#000"
    ctx.fillRect(0,0,W,H)
    ctx.fillStyle = WALL
    for r,row in enumerate(MAZE):
        for c,ch in enumerate(row):
            if ch == "X":
                ctx.fillRect(c*TILE, r*TILE, TILE, TILE)
    ctx.fillStyle = "#222"
    for r,row in enumerate(MAZE):
        for c,ch in enumerate(row):
            if ch == "H":
                ctx.fillRect(c*TILE+6, r*TILE+10, TILE-12, 4)
    for (c,r), kind in STATE["pellets"].items():
        cx = c*TILE + TILE/2
        cy = r*TILE + TILE/2
        if kind == "dot":
            draw_emoji(EMOJI_PELLET, cx, cy, size=16)
        else:
            draw_emoji(EMOJI_POWER,  cx, cy, size=20)

def draw_pac():
    p = STATE["pac"]
    ctx.save()

    alpha = 1.0
    scale = 1.0
    if p.state == "spawning":
        s = p.spawn_anim
        scale = 0.4 + 0.6*s
        alpha = s**1.25
    elif p.state == "dying":
        t = p.death_t
        scale = 1.0 - t
        alpha = 1.0 - t

    bob = math.sin(p.mouth*math.pi*2) * 1.2 if p.state == "alive" else 0.0
    size = 22 * scale

    ctx.globalAlpha = max(0.0, min(1.0, alpha))
    draw_emoji(EMOJI_DUCK, p.x, p.y + bob, size=size,
           rotate=p.visual_tilt, alpha=alpha, flip_x=p.face_lr, squash=p.flip_scale)

    ctx.restore()

def draw_ghost(g):
    x, y = g.x, g.y

    if g.mode == "eaten":
        for ox in (-5, 5):
            ctx.fillStyle = "#fff"
            ctx.beginPath(); ctx.arc(x+ox, y-2, 3.2, 0, 6.283, False); ctx.fill()
            dx, dy = DIRS[g.dir]
            mag = (dx*dx + dy*dy)**0.5 or 1.0
            px = x+ox + 2.2*(dx/mag)
            py = y-2  + 2.2*(dy/mag)
            ctx.fillStyle = "#191919"
            ctx.beginPath(); ctx.arc(px, py, 1.5, 0, 6.283, False); ctx.fill()
        return

    if g.mode == "frightened":
        emo = EMOJI_FRIGHT_1 if int(time.time()*8) % 2 == 0 else EMOJI_FRIGHT_2
    else:
        emo = EMOJI_GHOST_BY_NAME.get(g.name, "🦅")

    wobble = math.sin(g.wave*0.8) * 0.10
    size = 22 * (1.0 + wobble)

    draw_emoji(emo, x, y, size=size,
           rotate=g.visual_tilt, flip_x=g.face_lr, squash=g.flip_scale)

def update_popups(dt):
    for p in POPS:
        p["t"] += dt
    POPS[:] = [p for p in POPS if p["t"] <= p["life"]]

def draw_popups():
    ctx.save()
    ctx.font = "bold 14px system-ui"
    ctx.textAlign = "center"
    for p in POPS:
        a = max(0.0, 1.0 - p["t"]/p["life"])
        y = p["y"] - 22*p["t"]
        ctx.fillStyle = f"rgba(255,255,255,{a:.3f})"
        ctx.fillText(p["text"], p["x"], y)
    ctx.restore()

def render():
    draw_maze()
    draw_pac()
    for g in STATE["ghosts"]:
        draw_ghost(g)
    draw_popups()

STEP = 1/60
accum = 0.0
last_ts = None

def tick(ts):
    global last_ts, accum
    if last_ts is None:
        last_ts = ts
    dt = (ts - last_ts) / 1000.0
    last_ts = ts

    if dt > 0.25:
        dt = 0.0

    accum += dt
    while accum >= STEP:
        update(STEP)
        accum -= STEP

    render()
    window.requestAnimationFrame(raf_proxy)

raf_proxy = create_proxy(tick)
window.requestAnimationFrame(raf_proxy)

score_el.innerText = str(STATE["pac"].score)
lives_el.innerText = str(STATE["pac"].lives)
level_el.innerText = str(STATE["level"])
toast("ready!", hold=0.8)