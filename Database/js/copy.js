/* Copy code button + Chapter jump menu — Database pillar */

(function () {
  const CHAPTERS = [
    { num: '01', title: 'Database Fundamentals & Relational Model', file: 'chuong1.html' },
    { num: '02', title: 'SQL Cơ Bản — DDL/DML/DQL/DCL/TCL',          file: 'chuong2.html' },
    { num: '03', title: 'Advanced SQL — JOIN, Subquery, CTE, Window', file: 'chuong3.html' },
    { num: '04', title: 'Normalization & Schema Design',              file: 'chuong4.html' },
    { num: '05', title: 'Indexes — B-tree, Hash, GIN, Composite',     file: 'chuong5.html' },
    { num: '06', title: 'Transactions & ACID — Isolation Levels',     file: 'chuong6.html' },
    { num: '07', title: 'Concurrency Control — Locking, MVCC',        file: 'chuong7.html' },
    { num: '08', title: 'Query Optimization & Execution Plan',         file: 'chuong8.html' },
    { num: '09', title: 'NoSQL — KV, Document, Wide-column, Graph',   file: 'chuong9.html' },
    { num: '10', title: 'Replication & Sharding',                      file: 'chuong10.html' },
    { num: '11', title: 'Caching, Search, OLTP vs OLAP',               file: 'chuong11.html' },
    { num: '12', title: 'Backup, Recovery & Online Migrations',        file: 'chuong12.html' },
  ];

  /* ---------- Copy code blocks ---------- */
  function addCopyButtons() {
    document.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = 'COPY';
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code') || pre;
        const text = code.innerText;
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = '✓ COPIED';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'COPY';
            btn.classList.remove('copied');
          }, 1500);
        });
      });
      pre.appendChild(btn);
    });
  }

  /* ---------- Chapter jump menu ---------- */
  function injectChapterMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    if (document.querySelector('.chapter-jump')) return;

    const path = window.location.pathname;
    const currentFile = path.split('/').pop();

    const li = document.createElement('li');
    li.className = 'chapter-jump';

    const btn = document.createElement('button');
    btn.className = 'chapter-jump-btn';
    btn.type = 'button';
    btn.textContent = 'Mục lục';

    const menu = document.createElement('div');
    menu.className = 'chapter-jump-menu';

    // Determine link prefix based on whether we're at root or in chuong/
    const inChuong = path.includes('/chuong/');
    const prefix = inChuong ? '' : 'chuong/';

    CHAPTERS.forEach((ch) => {
      const a = document.createElement('a');
      a.href = prefix + ch.file;
      a.innerHTML = `<span class="ch-num">CH ${ch.num}</span><span>${ch.title}</span>`;
      if (currentFile === ch.file) a.classList.add('current');
      menu.appendChild(a);
    });

    li.appendChild(btn);
    li.appendChild(menu);
    navLinks.appendChild(li);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!li.contains(e.target)) menu.classList.remove('open');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') menu.classList.remove('open');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    addCopyButtons();
    injectChapterMenu();
  });

  /* Pillar enhancement loader */
  window.__PILLAR_INFO = {
    id: 'Database',
    name: 'Database Mastery',
    accent: '#0d6e6e',
    indexPath: 'index.html',
    chapters: CHAPTERS,
  };
  const inChapter = /\/chuong\//.test(location.pathname);
  const prefix = inChapter ? '../../' : '../';
  const s = document.createElement('script');
  s.src = prefix + 'shared/js/pillar-enhance.js';
  document.head.appendChild(s);
})();
