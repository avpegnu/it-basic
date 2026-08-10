/* ============================================================
   Common page utilities for DSA Mastery
   - Copy-to-clipboard cho mọi <pre><code>
   - Chapter jump menu trên header (nhảy chương không cần next/prev)
   ============================================================ */

/* === 1. Copy buttons cho code blocks === */
(function () {
  document.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'copy';
    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      const text = code ? code.innerText : pre.innerText;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = '✓ copied';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'copy';
          btn.classList.remove('copied');
        }, 1500);
      } catch (e) {
        btn.textContent = 'fail';
      }
    });
    pre.appendChild(btn);
  });
})();

/* === 2. Chapter jump menu === */
(function () {
  const CHAPTERS = [
    { num: 1,  title: 'Big-O & Phân tích độ phức tạp', tag: 'Foundation' },
    { num: 2,  title: 'Array & String',                tag: 'Linear DS' },
    { num: 3,  title: 'Linked List',                   tag: 'Linear DS' },
    { num: 4,  title: 'Stack & Queue',                 tag: 'Linear DS' },
    { num: 5,  title: 'Hash Table',                    tag: 'Lookup DS' },
    { num: 6,  title: 'Recursion & Backtracking',      tag: 'Technique' },
    { num: 7,  title: 'Sorting Algorithms',            tag: 'Algorithm' },
    { num: 8,  title: 'Searching & Binary Search',     tag: 'Algorithm' },
    { num: 9,  title: 'Tree (Binary Tree, BST, Trie)', tag: 'Tree DS' },
    { num: 10, title: 'Heap & Priority Queue',         tag: 'Tree DS' },
    { num: 11, title: 'Graph (BFS, DFS, Dijkstra)',    tag: 'Graph DS' },
    { num: 12, title: 'Dynamic Programming',           tag: 'Technique' },
  ];

  const inChapter = /\/chuong\//.test(location.pathname);
  const prefix = inChapter ? '' : 'chuong/';
  const homePrefix = inChapter ? '../' : '';

  const m = location.pathname.match(/chuong(\d+)\.html/);
  const currentNum = m ? parseInt(m[1], 10) : null;

  const ul = document.querySelector('header nav ul');
  if (!ul) return;

  const li = document.createElement('li');
  li.className = 'ch-jump';
  li.innerHTML = `
    <button class="ch-jump-btn" type="button" aria-expanded="false">Mục lục ▾</button>
    <div class="ch-jump-menu" role="menu">
      <div class="ch-jump-header">
        <span class="ch-jump-title">Chọn chương · 12 bài</span>
        <a class="ch-jump-home" href="${homePrefix}index.html">Trang chủ</a>
      </div>
      ${CHAPTERS.map(c => `
        <a class="ch-jump-item${c.num === currentNum ? ' active' : ''}" href="${prefix}chuong${c.num}.html">
          <span class="ch-jump-num">CH.${String(c.num).padStart(2,'0')}</span>
          <span class="ch-jump-text">
            <span class="ch-jump-name">${c.title}</span>
            <span class="ch-jump-tag">${c.tag}</span>
          </span>
        </a>
      `).join('')}
    </div>
  `;

  ul.appendChild(li);

  const btn  = li.querySelector('.ch-jump-btn');
  const menu = li.querySelector('.ch-jump-menu');

  function open()  { menu.classList.add('open');    btn.setAttribute('aria-expanded', 'true');  }
  function close() { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.contains('open') ? close() : open();
  });

  document.addEventListener('click', (e) => {
    if (!li.contains(e.target)) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

/* === 3. Pillar enhancement loader (progress, prev/next, home link, quiz tracking) === */
(function () {
  window.__PILLAR_INFO = {
    id: 'DSA',
    name: 'DSA Mastery',
    accent: '#67e8f9',
    indexPath: 'index.html',
    chapters: [
      { num: '01', title: 'Big-O & Phân tích độ phức tạp', file: 'chuong1.html' },
      { num: '02', title: 'Array & String',                 file: 'chuong2.html' },
      { num: '03', title: 'Linked List',                    file: 'chuong3.html' },
      { num: '04', title: 'Stack & Queue',                  file: 'chuong4.html' },
      { num: '05', title: 'Hash Table',                     file: 'chuong5.html' },
      { num: '06', title: 'Recursion & Backtracking',       file: 'chuong6.html' },
      { num: '07', title: 'Sorting Algorithms',             file: 'chuong7.html' },
      { num: '08', title: 'Searching & Binary Search',      file: 'chuong8.html' },
      { num: '09', title: 'Tree (Binary Tree, BST, Trie)',  file: 'chuong9.html' },
      { num: '10', title: 'Heap & Priority Queue',          file: 'chuong10.html' },
      { num: '11', title: 'Graph (BFS, DFS, Dijkstra)',     file: 'chuong11.html' },
      { num: '12', title: 'Dynamic Programming',            file: 'chuong12.html' },
    ],
  };
  const inChapter = /\/chuong\//.test(location.pathname);
  const prefix = inChapter ? '../../' : '../';
  const s = document.createElement('script');
  s.src = prefix + 'shared/js/pillar-enhance.js';
  document.head.appendChild(s);
})();
