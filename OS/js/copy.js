/* ============================================================
   OS Mastery — common page utilities
   - Copy code blocks
   - Chapter jump menu (nhảy chương trên header)
   ============================================================ */

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

(function () {
  const CHAPTERS = [
    { num: 1,  title: 'OS là gì? Kernel & System Calls',  tag: 'Foundation' },
    { num: 2,  title: 'Process & PCB',                     tag: 'Process' },
    { num: 3,  title: 'Thread & Concurrency Models',       tag: 'Process' },
    { num: 4,  title: 'CPU Scheduling',                    tag: 'Process' },
    { num: 5,  title: 'Inter-Process Communication',       tag: 'IPC' },
    { num: 6,  title: 'Synchronization (Mutex, Semaphore)',tag: 'Concurrency' },
    { num: 7,  title: 'Deadlock',                          tag: 'Concurrency' },
    { num: 8,  title: 'Memory Management & Virtual Memory',tag: 'Memory' },
    { num: 9,  title: 'Paging & Page Replacement',         tag: 'Memory' },
    { num: 10, title: 'File System & I/O',                 tag: 'I/O' },
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
        <span class="ch-jump-title">Chọn chương · 10 bài</span>
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
  document.addEventListener('click', (e) => { if (!li.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

/* === 3. Pillar enhancement loader === */
(function () {
  window.__PILLAR_INFO = {
    id: 'OS',
    name: 'OS Mastery',
    accent: '#a05a2c',
    indexPath: 'index.html',
    chapters: [
      { num: '01', title: 'OS là gì? Kernel & System Calls',     file: 'chuong1.html' },
      { num: '02', title: 'Process & PCB',                        file: 'chuong2.html' },
      { num: '03', title: 'Thread & Concurrency Models',          file: 'chuong3.html' },
      { num: '04', title: 'CPU Scheduling',                       file: 'chuong4.html' },
      { num: '05', title: 'Inter-Process Communication',          file: 'chuong5.html' },
      { num: '06', title: 'Synchronization (Mutex, Semaphore)',   file: 'chuong6.html' },
      { num: '07', title: 'Deadlock',                             file: 'chuong7.html' },
      { num: '08', title: 'Memory Management & Virtual Memory',   file: 'chuong8.html' },
      { num: '09', title: 'Paging & Page Replacement',            file: 'chuong9.html' },
      { num: '10', title: 'File System & I/O',                    file: 'chuong10.html' },
    ],
  };
  const inChapter = /\/chuong\//.test(location.pathname);
  const prefix = inChapter ? '../../' : '../';
  const s = document.createElement('script');
  s.src = prefix + 'shared/js/pillar-enhance.js';
  document.head.appendChild(s);
})();
