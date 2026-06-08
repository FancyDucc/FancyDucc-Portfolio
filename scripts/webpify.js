const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const dirs = ['assets/img'];
const SKIP_NAMES = new Set(['DuccPFPSmall.png']);

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.isFile()) files.push(p);
  }
  return files;
}

const candidates = [];
for (const d of dirs) {
  walk(path.join(root, d)).forEach(f => {
    if (!/\.png$/i.test(f)) return;
    if (SKIP_NAMES.has(path.basename(f))) return;
    const stat = fs.statSync(f);
    if (stat.size < 80 * 1024) return;
    candidates.push({ path: f, size: stat.size });
  });
}

candidates.sort((a, b) => b.size - a.size);
console.log('Found', candidates.length, 'PNGs >= 80KB. Total bytes:', candidates.reduce((s, c) => s + c.size, 0));

(async () => {
  let totalOrig = 0, totalWebp = 0, converted = 0, skipped = 0, failed = 0;
  for (const c of candidates) {
    const out = c.path.replace(/\.png$/i, '.webp');
    if (fs.existsSync(out)) {
      const ws = fs.statSync(out).size;
      totalOrig += c.size; totalWebp += ws; skipped++;
      continue;
    }
    try {
      const img = sharp(c.path);
      const meta = await img.metadata();
      const maxW = 1920;
      const pipeline = (meta.width && meta.width > maxW)
        ? img.resize({ width: maxW, withoutEnlargement: true })
        : img;
      await pipeline.webp({ quality: 80, effort: 4 }).toFile(out);
      const ws = fs.statSync(out).size;
      totalOrig += c.size; totalWebp += ws; converted++;
      const pct = ((1 - ws / c.size) * 100).toFixed(0);
      console.log(`  ${path.relative(root, c.path)}  ${(c.size/1024).toFixed(0)}KB -> ${(ws/1024).toFixed(0)}KB (-${pct}%)`);
    } catch (err) {
      failed++;
      console.error('  FAILED:', c.path, err.message);
    }
  }
  console.log('\n=== SUMMARY ===');
  console.log('Converted:', converted, '| Already-existed:', skipped, '| Failed:', failed);
  console.log('Original total:', (totalOrig/1024/1024).toFixed(1), 'MB');
  console.log('WebP total   :', (totalWebp/1024/1024).toFixed(1), 'MB');
  if (totalOrig > 0) console.log('Reduction    :', ((1 - totalWebp / totalOrig) * 100).toFixed(1) + '%');
})();
