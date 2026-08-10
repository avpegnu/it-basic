/**
 * IT Basic — Pillar Enhancer
 * Universal script: được load bởi mỗi pillar's copy.js sau khi set
 * window.__PILLAR_INFO = { id, name, accent, chapters: [{num, title, file}] }
 *
 * Auto-inject:
 *   - "← IT Basic" home link trong header nav
 *   - Prev/Next chapter nav ở cuối chapter page
 *   - Progress checkbox "Đã học xong"
 *   - Progress bar + per-chapter badges trên pillar index page
 *   - Reset progress button
 *   - Quiz score saved vào localStorage
 *
 * Hỗ trợ 2 structure pillar:
 *   - Group A (DSA, OS, Networking): <header nav ul>, <main>, .card, .lesson-nav
 *   - Group B (Database, OOP, SystemDesign): .nav-links, .chapter-body, .chapter-card
 */
(function () {
  const info = window.__PILLAR_INFO;
  if (!info) { console.warn('Pillar info missing'); return; }

  const PROGRESS_KEY = 'itbasic_progress';
  const QUIZ_KEY = 'itbasic_quiz';
  const PILLAR = info.id;
  const ACCENT = info.accent || '#475569';
  const CHAPTERS = info.chapters; // [{num, title, file}, ...]

  // ===== localStorage API =====
  function loadStore(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
  }
  function saveStore(key, obj) {
    try { localStorage.setItem(key, JSON.stringify(obj)); } catch {}
  }
  function isChapterDone(file) {
    const s = loadStore(PROGRESS_KEY);
    return !!(s[PILLAR] && s[PILLAR][file]);
  }
  function setChapterDone(file, done) {
    const s = loadStore(PROGRESS_KEY);
    if (!s[PILLAR]) s[PILLAR] = {};
    if (done) s[PILLAR][file] = true;
    else delete s[PILLAR][file];
    saveStore(PROGRESS_KEY, s);
  }
  function getPillarProgress() {
    const s = loadStore(PROGRESS_KEY)[PILLAR] || {};
    const done = CHAPTERS.filter(c => s[c.file]).length;
    return { done, total: CHAPTERS.length, percent: Math.round(done / CHAPTERS.length * 100) };
  }
  function getQuizScore(file) {
    const s = loadStore(QUIZ_KEY);
    return (s[PILLAR] && s[PILLAR][file]) || null;
  }
  function setQuizScore(file, score, total) {
    const s = loadStore(QUIZ_KEY);
    if (!s[PILLAR]) s[PILLAR] = {};
    s[PILLAR][file] = { score, total, date: new Date().toISOString().slice(0, 10) };
    saveStore(QUIZ_KEY, s);
  }
  function resetPillarProgress() {
    if (!confirm(`Reset toàn bộ tiến độ ${info.name}?`)) return;
    const p = loadStore(PROGRESS_KEY); delete p[PILLAR]; saveStore(PROGRESS_KEY, p);
    const q = loadStore(QUIZ_KEY); delete q[PILLAR]; saveStore(QUIZ_KEY, q);
    location.reload();
  }

  // Expose globally for quiz.js
  window.ITBasicProgress = {
    pillar: PILLAR,
    isChapterDone, setChapterDone,
    getPillarProgress,
    getQuizScore, setQuizScore,
    resetPillarProgress,
  };

  // ===== Inject CSS =====
  function injectStyles() {
    const css = `
      .it-basic-home a {
        color: ${ACCENT} !important;
        font-weight: 500;
        opacity: 0.85;
      }
      .it-basic-home a:hover { opacity: 1; }

      .pb-breadcrumb {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        font-family: var(--font-mono, "JetBrains Mono", monospace);
        font-size: 0.78rem;
        letter-spacing: 0.02em;
        padding: 14px 0 4px;
        margin: 0;
      }
      .pb-breadcrumb a {
        color: ${ACCENT};
        text-decoration: none;
        border-bottom: none !important;
        font-weight: 500;
        transition: opacity 0.15s;
      }
      .pb-breadcrumb a:hover {
        opacity: 0.7;
        text-decoration: underline;
      }
      .pb-breadcrumb .pb-sep {
        opacity: 0.4;
        font-weight: 300;
      }
      .pb-breadcrumb .pb-current {
        opacity: 0.7;
      }
      @media (max-width: 600px) {
        .pb-breadcrumb { font-size: 0.72rem; }
      }

      .pb-nav {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        margin: 3rem 0 0;
        padding-top: 2rem;
        border-top: 1px solid currentColor;
        border-color: rgba(127,127,127,0.25);
      }
      .pb-nav a {
        display: block;
        padding: 14px 18px;
        border: 1px solid ${ACCENT}55;
        border-radius: 6px;
        text-decoration: none;
        color: inherit;
        background: ${ACCENT}0c;
        transition: background 0.15s, border-color 0.15s, transform 0.15s;
      }
      .pb-nav a:hover {
        background: ${ACCENT}1a;
        border-color: ${ACCENT};
        transform: translateY(-1px);
      }
      .pb-nav .label {
        display: block;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: ${ACCENT};
        margin-bottom: 4px;
        font-weight: 600;
      }
      .pb-nav .title {
        font-size: 0.95rem;
        line-height: 1.35;
      }
      .pb-nav .next { text-align: right; }
      .pb-nav .pb-empty { display: block; }

      .pb-progress-box {
        margin: 2.5rem 0 0;
        padding: 16px 20px;
        border: 1px solid ${ACCENT}55;
        border-radius: 6px;
        background: ${ACCENT}0c;
      }
      .pb-progress-box label {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        user-select: none;
        font-weight: 500;
      }
      .pb-progress-box input[type="checkbox"] {
        width: 22px;
        height: 22px;
        accent-color: ${ACCENT};
        cursor: pointer;
      }
      .pb-progress-box.done {
        background: ${ACCENT}25;
        border-color: ${ACCENT};
      }
      .pb-progress-box .pb-done-text {
        color: ${ACCENT};
        font-weight: 600;
      }

      .pb-pillar-progress {
        background: ${ACCENT}0c;
        border: 1px solid ${ACCENT}55;
        border-radius: 8px;
        padding: 18px 22px;
        margin: 0 0 28px;
      }
      .pb-pillar-progress-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        gap: 12px;
        flex-wrap: wrap;
      }
      .pb-pillar-progress-label {
        font-family: var(--font-mono, monospace);
        font-size: 0.78rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: ${ACCENT};
        font-weight: 600;
      }
      .pb-pillar-progress-numbers {
        font-weight: 600;
        font-size: 0.95rem;
      }
      .pb-pillar-progress-reset {
        background: transparent;
        border: 1px solid ${ACCENT}88;
        color: ${ACCENT};
        font-size: 0.78rem;
        padding: 4px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-family: inherit;
      }
      .pb-pillar-progress-reset:hover {
        background: ${ACCENT};
        color: white;
      }
      .pb-pillar-progress-bar {
        height: 8px;
        background: ${ACCENT}1a;
        border-radius: 4px;
        overflow: hidden;
      }
      .pb-pillar-progress-fill {
        height: 100%;
        background: ${ACCENT};
        transition: width 0.3s ease;
      }

      .pb-card-badge {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: ${ACCENT};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.85rem;
        font-weight: 700;
        z-index: 5;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      }
      .pb-card-quiz {
        font-family: var(--font-mono, monospace);
        font-size: 0.72rem;
        color: ${ACCENT};
        margin-top: 8px;
        opacity: 0.85;
      }

      @media (max-width: 600px) {
        .pb-nav { grid-template-columns: 1fr; }
        .pb-nav .next { text-align: left; }
      }

      /* Quiz controls */
      .pb-quiz-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 14px 0 18px;
        padding: 10px 14px;
        background: ${ACCENT}10;
        border: 1px solid ${ACCENT}44;
        border-radius: 6px;
        flex-wrap: wrap;
      }
      .pb-quiz-counter {
        font-family: var(--font-mono, "JetBrains Mono", monospace);
        font-size: 0.85rem;
        color: ${ACCENT};
        font-weight: 600;
        margin-right: auto;
      }
      .pb-quiz-controls button {
        padding: 5px 12px;
        font-family: inherit;
        font-size: 0.8rem;
        background: transparent;
        border: 1px solid ${ACCENT}66;
        color: ${ACCENT};
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.15s, color 0.15s, opacity 0.15s;
      }
      .pb-quiz-controls button:hover:not(:disabled) {
        background: ${ACCENT};
        color: #fff;
      }
      .pb-quiz-controls button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .pb-quiz-summary {
        margin-top: 24px;
        padding: 24px 28px;
        text-align: center;
        background: ${ACCENT}1a;
        border: 2px solid ${ACCENT};
        border-radius: 8px;
      }
      .pb-quiz-summary-emoji {
        font-size: 2.4rem;
        line-height: 1;
        margin-bottom: 10px;
      }
      .pb-quiz-summary-score {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 14px;
        margin-bottom: 10px;
      }
      .pb-quiz-score-num {
        font-family: var(--font-display, "Fraunces", serif);
        font-size: 2.2rem;
        font-weight: 700;
        color: ${ACCENT};
        line-height: 1;
      }
      .pb-quiz-score-pct {
        font-family: var(--font-mono, "JetBrains Mono", monospace);
        font-size: 1.1rem;
        color: ${ACCENT};
        font-weight: 600;
      }
      .pb-quiz-summary-msg {
        color: inherit;
        opacity: 0.9;
        font-size: 0.95rem;
        margin-bottom: 6px;
      }
      .pb-quiz-summary-saved {
        font-family: var(--font-mono, "JetBrains Mono", monospace);
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: ${ACCENT};
        opacity: 0.7;
        margin-top: 10px;
      }

      .quiz-explain.show {
        animation: pb-fade-in 0.3s ease;
      }
      @keyframes pb-fade-in {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* ===== Search button + modal ===== */
      .pb-search-btn-wrap { list-style: none; }
      .pb-search-btn {
        background: ${ACCENT}10;
        border: 1px solid ${ACCENT}55;
        color: ${ACCENT};
        font-family: var(--font-mono, monospace);
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 0.85rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: background 0.15s, color 0.15s;
      }
      .pb-search-btn:hover {
        background: ${ACCENT};
        color: #fff;
      }
      .pb-search-btn .pb-search-kbd {
        font-size: 0.72rem;
        background: ${ACCENT}22;
        border: 1px solid ${ACCENT}55;
        border-radius: 3px;
        padding: 0 5px;
        opacity: 0.85;
      }
      .pb-search-btn:hover .pb-search-kbd {
        background: rgba(255,255,255,0.18);
        border-color: rgba(255,255,255,0.4);
      }

      .pb-search-modal {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: none;
        align-items: flex-start;
        justify-content: center;
        padding-top: 80px;
      }
      .pb-search-modal.open { display: flex; }
      .pb-search-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(15,23,42,0.55);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }
      .pb-search-panel {
        position: relative;
        width: 90%;
        max-width: 720px;
        max-height: 78vh;
        background: #fff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        display: flex;
        flex-direction: column;
      }
      .pb-search-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        border-bottom: 1px solid #e5e7eb;
      }
      .pb-search-modal .pb-search-input {
        flex: 1;
        font-size: 1.05rem;
        padding: 6px 0;
        border: none;
        outline: none;
        background: transparent;
        color: #0f172a;
        font-family: inherit;
      }
      .pb-search-modal .pb-search-icon { font-size: 1.05rem; opacity: 0.6; }
      .pb-search-close {
        font-family: monospace;
        font-size: 0.72rem;
        color: #6b7280;
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        padding: 4px 9px;
        cursor: pointer;
      }
      .pb-search-close:hover { background: #e5e7eb; }
      .pb-search-results-modal {
        overflow-y: auto;
        flex: 1;
      }
      .pb-search-result {
        display: block;
        padding: 14px 20px;
        border-bottom: 1px solid #f3f4f6;
        text-decoration: none !important;
        color: #1f2937;
        border-left: 3px solid transparent;
        transition: background 0.12s, border-color 0.12s;
      }
      .pb-search-result:last-child { border-bottom: none; }
      .pb-search-result:hover, .pb-search-result.active {
        background: #f9fafb;
        border-left-color: var(--result-accent, ${ACCENT});
      }
      .pb-search-result-meta {
        font-family: var(--font-mono, monospace);
        font-size: 0.72rem;
        color: #6b7280;
        margin-bottom: 4px;
      }
      .pb-search-pillar {
        color: var(--result-accent, ${ACCENT});
        font-weight: 600;
      }
      .pb-search-result-title {
        font-weight: 600;
        margin-bottom: 4px;
        color: #0f172a;
        font-size: 0.98rem;
      }
      .pb-search-result-snippet {
        font-size: 0.85rem;
        color: #4b5563;
        line-height: 1.5;
      }
      .pb-search-result mark {
        background: rgba(176,136,56,0.25);
        color: inherit;
        padding: 1px 2px;
        border-radius: 2px;
      }
      .pb-search-empty, .pb-search-hint {
        padding: 28px 20px;
        text-align: center;
        color: #6b7280;
        font-style: italic;
        font-size: 0.92rem;
      }
      .pb-search-stats {
        padding: 8px 20px;
        background: #f9fafb;
        font-family: var(--font-mono, monospace);
        font-size: 0.72rem;
        color: #6b7280;
        border-bottom: 1px solid #f3f4f6;
      }
      @media (max-width: 600px) {
        .pb-search-modal { padding-top: 40px; }
        .pb-search-btn .pb-search-label { display: none; }
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ===== Detect DOM structure =====
  function detect() {
    const path = location.pathname;
    const isChapterPage = /\/chuong\//.test(path);
    const file = path.split('/').pop();
    const homePrefix = isChapterPage ? '../../' : '../';

    // Group B: .nav-links + .chapter-body
    // Group A: header nav ul + main
    const navUl = document.querySelector('.nav-links') || document.querySelector('header nav ul');
    // Group B uses .chapter-body; Group A uses <main> (sibling of .lesson-nav)
    const chapterBody = document.querySelector('.chapter-body') || document.querySelector('main');
    const lessonNav = document.querySelector('.lesson-nav');
    const roadmap = document.querySelector('.roadmap');

    return { isChapterPage, file, homePrefix, navUl, chapterBody, lessonNav, roadmap };
  }

  // ===== Inject "← IT Basic" home link =====
  function injectHomeLink(d) {
    if (!d.navUl) return;
    if (document.querySelector('.it-basic-home')) return;
    const li = document.createElement('li');
    li.className = 'it-basic-home';
    li.innerHTML = `<a href="${d.homePrefix}index.html">← IT Basic</a>`;
    d.navUl.insertBefore(li, d.navUl.firstChild);
  }

  // ===== Inject search button + modal =====
  function injectSearch(d) {
    if (!d.navUl) return;
    if (document.querySelector('.pb-search-btn-wrap')) return;

    // Button in nav
    const btnLi = document.createElement('li');
    btnLi.className = 'pb-search-btn-wrap';
    btnLi.innerHTML =
      `<button class="pb-search-btn" type="button" title="Tìm kiếm (phím /)">` +
        `🔍 <span class="pb-search-label">Tìm kiếm</span>` +
        `<span class="pb-search-kbd">/</span>` +
      `</button>`;
    d.navUl.appendChild(btnLi);

    // Modal
    const modal = document.createElement('div');
    modal.className = 'pb-search-modal';
    modal.innerHTML =
      `<div class="pb-search-backdrop"></div>` +
      `<div class="pb-search-panel">` +
        `<div class="pb-search-header">` +
          `<span class="pb-search-icon">🔍</span>` +
          `<input type="search" class="pb-search-input" placeholder="Tìm trong 70+ chương... (vd: MVCC, SOLID, JWT)" autocomplete="off" spellcheck="false" />` +
          `<button class="pb-search-close" type="button">Esc</button>` +
        `</div>` +
        `<div class="pb-search-results-modal"></div>` +
      `</div>`;
    document.body.appendChild(modal);

    const input = modal.querySelector('.pb-search-input');
    const resultsEl = modal.querySelector('.pb-search-results-modal');
    let activeIdx = -1;
    let lastMatches = [];
    let indexLoading = false;
    let indexLoaded = !!window.SEARCH_INDEX;

    function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
    }
    function highlight(text, q) {
      if (!q || !text) return escapeHtml(text || '');
      const safe = escapeHtml(text);
      return safe.replace(new RegExp(escapeRegex(q), 'gi'), m => `<mark>${m}</mark>`);
    }

    function loadIndex(cb) {
      if (indexLoaded) return cb();
      if (indexLoading) return;
      indexLoading = true;
      const s = document.createElement('script');
      s.src = d.homePrefix + 'shared/data/search-index.js';
      s.onload = () => { indexLoaded = true; indexLoading = false; cb(); };
      s.onerror = () => {
        resultsEl.innerHTML = '<div class="pb-search-empty">Không load được search index. Chạy lại <code>node tools/build-search-index.js</code>?</div>';
        indexLoading = false;
      };
      document.head.appendChild(s);
    }

    function doSearch() {
      const q = input.value.trim();
      activeIdx = -1;

      if (!q) {
        resultsEl.innerHTML = '<div class="pb-search-hint">Gõ từ khoá để tìm trong toàn bộ giáo trình</div>';
        return;
      }
      if (q.length < 2) {
        resultsEl.innerHTML = '<div class="pb-search-hint">Gõ thêm ít nhất 2 ký tự...</div>';
        return;
      }
      if (!window.SEARCH_INDEX) {
        resultsEl.innerHTML = '<div class="pb-search-hint">Đang load search index...</div>';
        return;
      }

      const ql = q.toLowerCase();
      const matches = [];
      for (const item of window.SEARCH_INDEX) {
        let score = 0;
        const title = (item.title || '').toLowerCase();
        const snippet = (item.snippet || '').toLowerCase();
        const headings = (item.headings || []).join(' ').toLowerCase();
        const pillarName = (item.pillarName || '').toLowerCase();
        if (title.includes(ql)) score += 10;
        if (title.startsWith(ql)) score += 5;
        if (headings.includes(ql)) score += 4;
        if (pillarName.includes(ql)) score += 3;
        if (snippet.includes(ql)) score += 1;
        if (score > 0) matches.push({ item, score });
      }
      matches.sort((a, b) => b.score - a.score);
      lastMatches = matches.slice(0, 20);

      if (lastMatches.length === 0) {
        resultsEl.innerHTML = '<div class="pb-search-empty">Không có kết quả cho "' + escapeHtml(q) + '"</div>';
        return;
      }

      resultsEl.innerHTML =
        '<div class="pb-search-stats">' + lastMatches.length + ' kết quả</div>' +
        lastMatches.map(({ item }, i) =>
          `<a class="pb-search-result${i === activeIdx ? ' active' : ''}" ` +
             `href="${d.homePrefix + item.url}" ` +
             `style="--result-accent: ${item.accent}">` +
            `<div class="pb-search-result-meta">` +
              `<span class="pb-search-pillar">${escapeHtml(item.pillarName)}</span>` +
              ` · ${escapeHtml(item.chapter)}` +
            `</div>` +
            `<div class="pb-search-result-title">${highlight(item.title, q)}</div>` +
            (item.snippet
              ? `<div class="pb-search-result-snippet">${highlight(item.snippet, q)}</div>`
              : '') +
          `</a>`
        ).join('');
    }

    function open() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => input.focus(), 50);
      loadIndex(doSearch);
    }
    function close() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    let dt;
    input.addEventListener('input', () => {
      clearTimeout(dt);
      dt = setTimeout(doSearch, 80);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIdx = Math.min(activeIdx + 1, lastMatches.length - 1);
        doSearch();
        const el = resultsEl.querySelector('.pb-search-result.active');
        if (el) el.scrollIntoView({ block: 'nearest' });
      }
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIdx = Math.max(activeIdx - 1, -1);
        doSearch();
      }
      else if (e.key === 'Enter') {
        if (activeIdx >= 0 && lastMatches[activeIdx]) {
          location.href = d.homePrefix + lastMatches[activeIdx].item.url;
        }
      }
    });

    modal.querySelector('.pb-search-backdrop').addEventListener('click', close);
    modal.querySelector('.pb-search-close').addEventListener('click', close);
    btnLi.querySelector('.pb-search-btn').addEventListener('click', open);

    document.addEventListener('keydown', (e) => {
      if (e.key === '/' &&
          document.activeElement.tagName !== 'INPUT' &&
          document.activeElement.tagName !== 'TEXTAREA' &&
          !modal.classList.contains('open')) {
        e.preventDefault();
        open();
      }
    });
  }

  // ===== Inject breadcrumb on chapter pages =====
  function injectBreadcrumb(d) {
    if (!d.isChapterPage) return;
    const idx = CHAPTERS.findIndex(c => c.file === d.file);
    if (idx < 0) return;
    const ch = CHAPTERS[idx];

    // Insertion point: Group B uses .chapter-hero .container; Group A uses <main>
    let target = document.querySelector('.chapter-hero .container');
    if (!target) target = document.querySelector('main');
    if (!target) return;

    const masterPath = d.homePrefix + 'index.html';     // ../../index.html
    const pillarPath = '../index.html';                  // /Pillar/index.html from chuong/

    const crumb = document.createElement('nav');
    crumb.className = 'pb-breadcrumb';
    crumb.setAttribute('aria-label', 'Breadcrumb');
    crumb.innerHTML =
      `<a href="${masterPath}">IT Basic</a>` +
      `<span class="pb-sep">›</span>` +
      `<a href="${pillarPath}">${info.name}</a>` +
      `<span class="pb-sep">›</span>` +
      `<span class="pb-current">Chương ${ch.num}</span>`;
    target.insertBefore(crumb, target.firstChild);
  }

  // ===== Inject Prev/Next nav + Progress checkbox on chapter page =====
  function injectChapterUI(d) {
    if (!d.isChapterPage) return;
    const idx = CHAPTERS.findIndex(c => c.file === d.file);
    if (idx < 0) return;

    const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
    const next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;

    // Determine container — Group B: .chapter-body, Group A: replace existing .lesson-nav
    let container = d.chapterBody;
    if (!container) return;

    // Remove existing trailing footer paragraph (Group B "Hoàn thành Chương... Tiếp theo")
    const trailingP = container.querySelectorAll('p');
    if (trailingP.length) {
      const lastP = trailingP[trailingP.length - 1];
      const style = lastP.getAttribute('style') || '';
      if (style.includes('border-top') && lastP.textContent.includes('Tiếp theo')) {
        lastP.remove();
      }
    }

    // Group A has existing .lesson-nav — remove and replace
    if (d.lessonNav) {
      d.lessonNav.remove();
    }

    // Build progress checkbox
    const isDone = isChapterDone(d.file);
    const progressBox = document.createElement('div');
    progressBox.className = 'pb-progress-box' + (isDone ? ' done' : '');
    progressBox.innerHTML = `
      <label>
        <input type="checkbox" id="pb-cb"${isDone ? ' checked' : ''}>
        <span class="pb-checkbox-text">${isDone ? 'Đã học xong chương này' : 'Đánh dấu đã học xong'}</span>
      </label>
    `;
    if (isDone) {
      progressBox.querySelector('.pb-checkbox-text').classList.add('pb-done-text');
    }

    // Build prev/next nav
    const nav = document.createElement('nav');
    nav.className = 'pb-nav';
    nav.innerHTML = `
      ${prev
        ? `<a href="${prev.file}" class="prev">
             <span class="label">← Chương ${prev.num}</span>
             <span class="title">${prev.title}</span>
           </a>`
        : `<span class="pb-empty"></span>`}
      ${next
        ? `<a href="${next.file}" class="next">
             <span class="label">Chương ${next.num} →</span>
             <span class="title">${next.title}</span>
           </a>`
        : `<a href="${d.homePrefix}${info.indexPath || 'index.html'}" class="next">
             <span class="label">Hoàn thành ✓</span>
             <span class="title">Về trang chủ ${info.name}</span>
           </a>`}
    `;

    // Group A: append to <main>; Group B: append to .chapter-body
    container.appendChild(progressBox);
    container.appendChild(nav);

    // Wire checkbox
    const cb = progressBox.querySelector('#pb-cb');
    cb.addEventListener('change', e => {
      setChapterDone(d.file, e.target.checked);
      progressBox.classList.toggle('done', e.target.checked);
      const text = progressBox.querySelector('.pb-checkbox-text');
      text.textContent = e.target.checked ? 'Đã học xong chương này' : 'Đánh dấu đã học xong';
      text.classList.toggle('pb-done-text', e.target.checked);
    });
  }

  // ===== Inject progress widget on pillar index =====
  function injectPillarProgress(d) {
    if (d.isChapterPage) return;
    if (!d.roadmap) return;

    // Add progress bar before roadmap
    const progress = getPillarProgress();
    const widget = document.createElement('div');
    widget.className = 'pb-pillar-progress';
    widget.innerHTML = `
      <div class="pb-pillar-progress-head">
        <span class="pb-pillar-progress-label">Tiến độ học</span>
        <span class="pb-pillar-progress-numbers">${progress.done}/${progress.total} chương · ${progress.percent}%</span>
        ${progress.done > 0 ? '<button class="pb-pillar-progress-reset">Reset</button>' : ''}
      </div>
      <div class="pb-pillar-progress-bar">
        <div class="pb-pillar-progress-fill" style="width: ${progress.percent}%"></div>
      </div>
    `;
    d.roadmap.parentElement.insertBefore(widget, d.roadmap);
    const resetBtn = widget.querySelector('.pb-pillar-progress-reset');
    if (resetBtn) resetBtn.addEventListener('click', resetPillarProgress);

    // Add badge + quiz score on each chapter card
    // Group B uses .chapter-card, Group A uses .card
    const cards = d.roadmap.querySelectorAll('.chapter-card, .card');
    cards.forEach(card => {
      const href = card.getAttribute('href') || '';
      const file = href.split('/').pop();
      if (!file) return;

      // Make card position relative for absolute badge
      const computed = getComputedStyle(card);
      if (computed.position === 'static') card.style.position = 'relative';

      if (isChapterDone(file)) {
        const badge = document.createElement('div');
        badge.className = 'pb-card-badge';
        badge.textContent = '✓';
        badge.title = 'Đã học xong';
        card.appendChild(badge);
      }
      const score = getQuizScore(file);
      if (score) {
        const sb = document.createElement('div');
        sb.className = 'pb-card-quiz';
        sb.textContent = `Quiz: ${score.score}/${score.total} · ${score.date}`;
        card.appendChild(sb);
      }
    });
  }

  // ===== Enhance quiz: controls (shuffle/reset), counter, summary, save score =====
  function enhanceQuiz() {
    setTimeout(() => {
      const quiz = document.querySelector('.quiz');
      if (!quiz) return;
      const questions = quiz.querySelectorAll('.quiz-question');
      if (!questions.length) return;

      const total = questions.length;
      const file = location.pathname.split('/').pop();

      // Inject controls bar after quiz heading
      const controls = document.createElement('div');
      controls.className = 'pb-quiz-controls';
      controls.innerHTML =
        `<span class="pb-quiz-counter">Đã trả lời <span class="pb-quiz-current">0</span>/${total}</span>` +
        `<button class="pb-quiz-shuffle" type="button" title="Trộn thứ tự câu hỏi">🔀 Trộn</button>` +
        `<button class="pb-quiz-reset" type="button" title="Làm lại quiz" disabled>↻ Làm lại</button>`;
      const heading = quiz.querySelector('h3');
      if (heading) heading.insertAdjacentElement('afterend', controls);
      else quiz.insertBefore(controls, quiz.firstChild);

      // Summary placeholder at bottom
      const summary = document.createElement('div');
      summary.className = 'pb-quiz-summary';
      summary.style.display = 'none';
      quiz.appendChild(summary);

      const counterEl = controls.querySelector('.pb-quiz-current');
      const resetBtn = controls.querySelector('.pb-quiz-reset');
      const shuffleBtn = controls.querySelector('.pb-quiz-shuffle');

      function update() {
        const answered = quiz.querySelectorAll('.quiz-question.answered').length;
        counterEl.textContent = answered;
        resetBtn.disabled = answered === 0;

        if (answered === total) {
          let correct = 0;
          questions.forEach(q => {
            // Câu trả lời sai có class .wrong; nếu không có → câu đó đúng
            if (!q.querySelector('.quiz-option.wrong')) correct++;
          });
          const pct = Math.round(correct / total * 100);

          let mood, msg;
          if (pct === 100)      { mood = '🎉'; msg = 'Hoàn hảo! Bạn nắm vững chương này.'; }
          else if (pct >= 80)   { mood = '👏'; msg = 'Rất tốt! Đọc lại các câu sai để chắc.'; }
          else if (pct >= 60)   { mood = '👍'; msg = 'Khá ổn — review lại điểm chưa nắm.'; }
          else                  { mood = '📚'; msg = 'Hãy đọc lại chương rồi làm lại quiz.'; }

          summary.innerHTML =
            `<div class="pb-quiz-summary-emoji">${mood}</div>` +
            `<div class="pb-quiz-summary-score">` +
              `<span class="pb-quiz-score-num">${correct}/${total}</span>` +
              `<span class="pb-quiz-score-pct">${pct}%</span>` +
            `</div>` +
            `<div class="pb-quiz-summary-msg">${msg}</div>` +
            `<div class="pb-quiz-summary-saved">Điểm đã lưu</div>`;
          summary.style.display = 'block';
          setQuizScore(file, correct, total);
          summary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          summary.style.display = 'none';
        }
      }

      // Watch each question for state change
      questions.forEach(q => {
        new MutationObserver(update).observe(q, { attributes: true, attributeFilter: ['class'] });
      });

      // Reset
      resetBtn.addEventListener('click', () => {
        quiz.querySelectorAll('.quiz-question').forEach(q => {
          q.classList.remove('answered');
          q.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('correct', 'wrong'));
          const ex = q.querySelector('.quiz-explain');
          if (ex) ex.classList.remove('show');
        });
        counterEl.textContent = '0';
        summary.style.display = 'none';
        resetBtn.disabled = true;
      });

      // Shuffle (Fisher-Yates)
      shuffleBtn.addEventListener('click', () => {
        // Reset state first
        resetBtn.click();
        const parent = questions[0].parentElement;
        const arr = Array.from(quiz.querySelectorAll('.quiz-question'));
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        arr.forEach(q => parent.appendChild(q));
      });

      // Initial state
      update();
    }, 150);
  }

  // ===== Run =====
  function init() {
    injectStyles();
    const d = detect();
    injectHomeLink(d);
    injectSearch(d);
    injectBreadcrumb(d);
    injectChapterUI(d);
    injectPillarProgress(d);
    enhanceQuiz();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
