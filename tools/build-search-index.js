#!/usr/bin/env node
/**
 * IT Basic — Search Index Builder
 * Scan mọi chapter HTML + pillar index, extract title/h2/h3/snippet,
 * output: /shared/data/search-index.js (JS file để load qua <script>, tránh fetch() trên file://)
 *
 * Usage: node tools/build-search-index.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_FILE = path.join(ROOT, 'shared', 'data', 'search-index.js');

const PILLARS = [
  { id: 'CLI',          name: 'CLI / Terminal',   accent: '#4ade80' },
  { id: 'DSA',          name: 'DSA',              accent: '#67e8f9' },
  { id: 'OS',           name: 'OS',               accent: '#a05a2c' },
  { id: 'Networking',   name: 'Networking',       accent: '#6366f1' },
  { id: 'Database',     name: 'Database',         accent: '#0d6e6e' },
  { id: 'OOP',          name: 'OOP & Patterns',   accent: '#8b3a3a' },
  { id: 'SystemDesign', name: 'System Design',    accent: '#2c4a6b' },
  { id: 'DevOps',       name: 'DevOps',           accent: '#22d3ee' },
];

function decodeEntities(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function cleanText(html) {
  if (!html) return '';
  return decodeEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function extract(html) {
  // Strip script/style blocks
  html = html.replace(/<script[\s\S]*?<\/script>/g, '');
  html = html.replace(/<style[\s\S]*?<\/style>/g, '');

  // Title from <h1>
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = h1Match ? cleanText(h1Match[1]) : '';

  // Subtitle/lead from .subtitle or first <p>
  const subtitleMatch = html.match(/<p[^>]*class="[^"]*subtitle[^"]*"[^>]*>([\s\S]*?)<\/p>/i)
    || html.match(/<p[^>]*class="[^"]*lead[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  let snippet = subtitleMatch ? cleanText(subtitleMatch[1]) : '';
  if (!snippet) {
    const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    snippet = pMatch ? cleanText(pMatch[1]) : '';
  }
  snippet = snippet.substring(0, 220);

  // Headings (h2, h3)
  const headings = [];
  const headingRe = /<(h[23])[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = headingRe.exec(html)) !== null) {
    const text = cleanText(m[2]);
    if (text && text.length < 200) headings.push(text);
  }

  return { title, headings, snippet };
}

function buildIndex() {
  const items = [];

  for (const p of PILLARS) {
    // Pillar index
    const indexPath = path.join(ROOT, p.id, 'index.html');
    if (fs.existsSync(indexPath)) {
      const html = fs.readFileSync(indexPath, 'utf8');
      const data = extract(html);
      items.push({
        url: `${p.id}/index.html`,
        pillar: p.id,
        pillarName: p.name,
        accent: p.accent,
        chapter: 'Tổng quan',
        chapterNum: 0,
        title: data.title || p.name,
        headings: data.headings,
        snippet: data.snippet,
      });
    }

    // Pillar docs
    const docsPath = path.join(ROOT, p.id, 'docs.html');
    if (fs.existsSync(docsPath)) {
      const html = fs.readFileSync(docsPath, 'utf8');
      const data = extract(html);
      items.push({
        url: `${p.id}/docs.html`,
        pillar: p.id,
        pillarName: p.name,
        accent: p.accent,
        chapter: 'Giáo trình',
        chapterNum: 0,
        title: data.title || `${p.name} — Giáo trình`,
        headings: data.headings,
        snippet: data.snippet,
      });
    }

    // Chapters
    const chapterDir = path.join(ROOT, p.id, 'chuong');
    if (!fs.existsSync(chapterDir)) continue;

    const files = fs.readdirSync(chapterDir).filter(f => f.endsWith('.html'));
    files.sort((a, b) => {
      const na = parseInt(a.match(/(\d+)/)?.[1] || '0', 10);
      const nb = parseInt(b.match(/(\d+)/)?.[1] || '0', 10);
      return na - nb;
    });

    for (const file of files) {
      const html = fs.readFileSync(path.join(chapterDir, file), 'utf8');
      const data = extract(html);
      const numMatch = file.match(/chuong(\d+)/);
      const num = numMatch ? parseInt(numMatch[1], 10) : 0;

      items.push({
        url: `${p.id}/chuong/${file}`,
        pillar: p.id,
        pillarName: p.name,
        accent: p.accent,
        chapter: `Chương ${String(num).padStart(2, '0')}`,
        chapterNum: num,
        title: data.title,
        headings: data.headings,
        snippet: data.snippet,
      });
    }
  }

  return items;
}

const items = buildIndex();
fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });

const content =
  '/* IT Basic — Auto-generated search index. Do not edit manually. */\n' +
  '/* Generated: ' + new Date().toISOString() + ' */\n' +
  'window.SEARCH_INDEX = ' + JSON.stringify(items) + ';\n';

fs.writeFileSync(OUT_FILE, content);

// Stats
const totalHeadings = items.reduce((s, i) => s + i.headings.length, 0);
const sizeKb = (Buffer.byteLength(content) / 1024).toFixed(1);
console.log(`✓ Built search index:`);
console.log(`    ${items.length} documents (chapters + pillar pages)`);
console.log(`    ${totalHeadings} headings indexed`);
console.log(`    ${sizeKb} KB output`);
console.log(`    → ${path.relative(ROOT, OUT_FILE)}`);
