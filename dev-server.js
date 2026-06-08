const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require("path");
const { URL } = require("url");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const robloxCache = new Map();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const getContentType = (filePath) => {
  return mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
};

const resolveFile = (pathname) => {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname.split("?")[0]);
  } catch {
    return null;
  }

  const cleanPath = decoded === "/" ? "/index.html" : decoded;
  const requested = path.normalize(path.join(root, `.${cleanPath}`));
  const relative = path.relative(root, requested);

  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;

  const candidates = [
    requested,
    `${requested}.html`,
    path.join(requested, "index.html"),
  ];

  return candidates.find((candidate) => {
    try {
      return fs.statSync(candidate).isFile();
    } catch {
      return false;
    }
  }) || null;
};

const send404 = (res) => {
  const fallback = [
    path.join(root, "404.html"),
    path.join(root, "other", "404.html"),
  ].find((candidate) => fs.existsSync(candidate));

  if (fallback) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    fs.createReadStream(fallback).pipe(res);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
};

const sendJson = (res, status, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
};

const readRemoteJson = (url) => new Promise((resolve, reject) => {
  const request = https.get(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "FancyDucc-Portfolio/1.0",
    },
  }, (response) => {
    let body = "";
    response.setEncoding("utf8");
    response.on("data", (chunk) => {
      body += chunk;
    });
    response.on("end", () => {
      if (response.statusCode < 200 || response.statusCode >= 300) {
        reject(new Error(`Roblox returned ${response.statusCode}`));
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });

  request.on("error", reject);
  request.setTimeout(10000, () => {
    request.destroy(new Error("Roblox request timed out"));
  });
});

const getRobloxVisits = async (placeId) => {
  const cached = robloxCache.get(placeId);
  if (cached && cached.expires > Date.now()) {
    return cached.payload;
  }

  const placeData = await readRemoteJson(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
  const universeId = placeData?.universeId;
  if (!Number.isFinite(universeId)) {
    throw new Error("Unable to resolve Roblox universe ID");
  }

  const gameData = await readRemoteJson(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
  const game = Array.isArray(gameData?.data) ? gameData.data[0] : null;
  if (!game || typeof game.visits !== "number") {
    throw new Error("Unable to resolve Roblox visits");
  }

  const payload = {
    placeId: Number(placeId),
    universeId,
    name: game.name,
    visits: game.visits,
  };
  robloxCache.set(placeId, {
    expires: Date.now() + 5 * 60 * 1000,
    payload,
  });
  return payload;
};

const handleApi = async (url, res) => {
  if (url.pathname !== "/api/roblox/game-visits") return false;

  const placeId = url.searchParams.get("placeId");
  if (!/^\d+$/.test(placeId || "")) {
    sendJson(res, 400, { error: "A numeric placeId is required." });
    return true;
  }

  try {
    sendJson(res, 200, await getRobloxVisits(placeId));
  } catch (error) {
    sendJson(res, 502, { error: error.message || "Unable to load Roblox visits." });
  }
  return true;
};

const sendFile = (req, res, filePath) => {
  const stat = fs.statSync(filePath);
  const contentType = getContentType(filePath);
  const range = req.headers.range;
  const baseHeaders = {
    "Accept-Ranges": "bytes",
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  };

  if (range) {
    const match = range.match(/^bytes=(\d*)-(\d*)$/);
    if (!match) {
      res.writeHead(416, {
        ...baseHeaders,
        "Content-Range": `bytes */${stat.size}`,
      });
      res.end();
      return;
    }

    let start;
    let end;

    if (!match[1] && match[2]) {
      const suffixLength = Number(match[2]);
      start = Math.max(stat.size - suffixLength, 0);
      end = stat.size - 1;
    } else {
      start = match[1] ? Number(match[1]) : 0;
      end = match[2] ? Number(match[2]) : stat.size - 1;
    }

    if (start >= stat.size || end >= stat.size || start > end) {
      res.writeHead(416, {
        ...baseHeaders,
        "Content-Range": `bytes */${stat.size}`,
      });
      res.end();
      return;
    }

    res.writeHead(206, {
      ...baseHeaders,
      "Content-Length": end - start + 1,
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    });

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    fs.createReadStream(filePath, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, {
    ...baseHeaders,
    "Content-Length": stat.size,
  });

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  fs.createReadStream(filePath).pipe(res);
};

const server = http.createServer(async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Allow": "GET, HEAD" });
    res.end();
    return;
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (await handleApi(url, res)) return;

    const filePath = resolveFile(url.pathname);

    if (!filePath) {
      send404(res);
      return;
    }

    sendFile(req, res, filePath);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
});

server.listen(port, () => {
  console.log(`FancyDucc portfolio preview running at http://localhost:${port}`);
});
