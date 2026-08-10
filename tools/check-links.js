#!/usr/bin/env node
/**
 * IT Basic — Link Checker
 * Scan mọi file .html trong project, parse href attribute,
 * verify mọi internal link resolve về file tồn tại.
 *
 * Usage:
 *   node tools/check-links.js [root]
 *   (default root = ../  tức /Users/vietanh142004/Developer/IT Basic/)
 *
 * Exit code: 0 nếu OK, 1 nếu có broken link.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const SKIP_DIRS = new Set(['node_modules', '.git', 'tools', '.sixth']);

const colors = {
  reset: '\x1b[0m',
  red:   '\x1b[31m',
  green: '\x1b[32m',
  yellow:'\x1b[33m',
  cyan:  '\x1b[36m',
  dim:   '\x1b[2m',
};

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && full.endsWith('.html')) files.push(full);
  }
  return files;
}

function extractHrefs(html) {
  const hrefs = [];
  const re = /href\s*=\s*"([^"]+)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) hrefs.push(m[1]);
  // Cũng check src= cho script/link/img
  const reSrc = /src\s*=\s*"([^"]+)"/gi;
  while ((m = reSrc.exec(html)) !== null) hrefs.push(m[1]);
  return hrefs;
}

function isInternal(href) {
  if (!href) return false;
  if (href.startsWith('#')) return false;          // anchor only
  if (href.startsWith('mailto:')) return false;
  if (href.startsWith('tel:')) return false;
  if (href.startsWith('javascript:')) return false;
  if (href.startsWith('data:')) return false;       // inline data URI
  if (/^https?:\/\//i.test(href)) return false;     // external URL
  if (href.startsWith('//')) return false;          // protocol-relative
  if (href.includes('${')) return false;            // template literal placeholder (inside JS)
  return true;
}

function resolveTarget(fromFile, href) {
  // Strip query string + anchor
  const cleanHref = href.split('#')[0].split('?')[0];
  if (!cleanHref) return null;   // pure anchor or query
  const fromDir = path.dirname(fromFile);
  return path.resolve(fromDir, cleanHref);
}

function main() {
  console.log(`${colors.cyan}🔍 Scanning HTML files in: ${ROOT}${colors.reset}\n`);

  const files = walk(ROOT);
  console.log(`${colors.dim}Found ${files.length} HTML files${colors.reset}\n`);

  const broken = [];
  let totalLinks = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const hrefs = extractHrefs(content);

    for (const href of hrefs) {
      if (!isInternal(href)) continue;
      totalLinks++;

      const target = resolveTarget(file, href);
      if (!target) continue;

      if (!fs.existsSync(target)) {
        broken.push({ file: path.relative(ROOT, file), href, target: path.relative(ROOT, target) });
      }
    }
  }

  if (broken.length === 0) {
    console.log(`${colors.green}✓ All ${totalLinks} internal links OK${colors.reset}`);
    process.exit(0);
  }

  console.log(`${colors.red}✗ ${broken.length} broken link(s) found:${colors.reset}\n`);
  for (const b of broken) {
    console.log(`${colors.yellow}  ${b.file}${colors.reset}`);
    console.log(`    href: ${colors.red}${b.href}${colors.reset}`);
    console.log(`    target missing: ${colors.dim}${b.target}${colors.reset}\n`);
  }
  process.exit(1);
}

main();
