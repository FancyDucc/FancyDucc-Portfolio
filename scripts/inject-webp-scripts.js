const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = [
  'index.html',
  '404.html',
  'html-page-template.html',
  'about/testimonials.html',
  'about/why-hire-me.html',
  'games/literallypacman.html',
  'other/404.html',
  'other/desktop-only.html',
  'other/temporarynavigation.html',
  'portfolio/animation.html',
  'portfolio/building.html',
  'portfolio/modeling.html',
  'portfolio/scripting.html',
  'portfolio/vfx.html',
  'services/free-stuff.html',
  'services/games.html',
  'services/payments.html',
];

const SCRIPTS = '\n  <script src="/js/webp-manifest.js"></script>\n  <script src="/js/webp-swap.js"></script>';

let updated = 0;
for (const rel of files) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('webp-swap.js')) { console.log('SKIP:', rel); continue; }

  // Inject before </head>
  if (!s.includes('</head>')) { console.log('NO </head>:', rel); continue; }
  s = s.replace('</head>', SCRIPTS + '\n</head>');
  fs.writeFileSync(file, s);
  console.log('INJECTED:', rel);
  updated++;
}
console.log('Updated', updated, 'files');
