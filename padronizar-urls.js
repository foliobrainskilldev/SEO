const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = new Set(['node_modules', '_site', '.git', 'admin', 'img']);
const TARGET_EXTS = new Set(['.html', '.njk']);

const FAVICON_BLOCK = `<link rel="icon" href="/favicon.ico?v=2" sizes="48x48">
  <link rel="icon" type="image/png" href="/favicon-32x32.png?v=2" sizes="32x32">
  <link rel="icon" type="image/png" href="/android-chrome-192x192.png?v=2" sizes="192x192">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" sizes="180x180">
  <link rel="manifest" href="/site.webmanifest">`;

const NEW_LOGO_HTML = `<a href="/" class="brand-logo" aria-label="MocaPlay - Página Inicial">
          <img src="/img/logo-mocaplay.png" alt="MocaPlay" class="brand-logo-full" width="180" height="44">
        </a>`;

function getFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (TARGET_EXTS.has(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getFiles('.');
let updatedCount = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  let content = original;

  // 1. Links internos de índices de pasta
  content = content.replace(/href="\/apostas-futebol\/index\.html"/g, 'href="/apostas-futebol/"');
  content = content.replace(/href="\/blog\/index\.html"/g, 'href="/blog/"');

  // 2. Todos os links internos href="/...html"
  content = content.replace(/href="(\/[^"#?]*?)\.html([#?][^"]*)?"/g, 'href="$1$2"');

  // 3. URLs absolutas do domínio
  content = content.replace(/(https:\/\/mocaplay\.site\/[^"#?\s<]*?)\.html/g, '$1');

  // 4. Templates Eleventy
  if (file.endsWith('layout.njk')) {
    content = content.replace(/\{\{\s*page\.url\s*\}\}/g, "{{ page.url | replace('.html', '') }}");
  }
  if (file.endsWith(path.join('blog', 'index.njk'))) {
    content = content.replace(/\{\{\s*post\.url\s*\}\}/g, "{{ post.url | replace('.html', '') }}");
  }
  if (file.endsWith('sitemap.njk')) {
    content = content.replace(/\{\{\s*pagina\.url\s*\}\}/g, "{{ pagina.url | replace('.html', '') }}");
  }

  // 5. Padronização global do Favicon
  content = content.replace(/<link rel="icon" href="\/favicon\.ico" sizes="any">/g, FAVICON_BLOCK);
  content = content.replace(
    /<link rel="icon" href="\/favicon\.ico" sizes="48x48">\s*<link rel="icon" type="image\/png" href="\/img\/favicon-192x192\.png" sizes="192x192">\s*<link rel="apple-touch-icon" href="\/img\/favicon-192x192\.png">/g,
    FAVICON_BLOCK
  );

  // 6. Substituição automática da letra "M" antiga pela Logo PNG em todas as páginas HTML fixas
  if (file.endsWith('.html')) {
    content = content.replace(
      /<a href="\/" class="brand-logo">[\s\S]*?<\/a>/,
      NEW_LOGO_HTML
    );
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
  }
}

console.log(`✅ Ficheiros atualizados: ${updatedCount}`);
