/* ============================================================
   Programming Language pillar — Shared chapter JS
   - Copy-to-clipboard buttons trên code block
   - Anchor link tự sinh trên heading H2/H3
   - TOC sidebar highlight section đang xem (IntersectionObserver)
   - Progress bar tracking (đọc % chapter)
   ============================================================ */

(function () {
  'use strict';

  // ---- 1. Inject copy button into all <pre> blocks ----
  function setupCopyButtons() {
    const blocks = document.querySelectorAll('pre');
    blocks.forEach((pre) => {
      // Skip if already wrapped
      if (pre.parentElement.classList.contains('code-wrap')) return;

      const wrap = document.createElement('div');
      wrap.className = 'code-wrap';

      const meta = document.createElement('div');
      meta.className = 'code-meta';

      const lang = pre.dataset.lang || pre.querySelector('code')?.className.match(/language-([a-z]+)/)?.[1] || 'code';
      const label = document.createElement('span');
      label.textContent = lang;
      meta.appendChild(label);

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = 'Sao chép';
      btn.addEventListener('click', async () => {
        const text = pre.querySelector('code')?.innerText || pre.innerText;
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = '✓ Đã sao';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Sao chép';
            btn.classList.remove('copied');
          }, 1600);
        } catch (e) {
          btn.textContent = 'Lỗi';
        }
      });
      meta.appendChild(btn);

      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(meta);
      wrap.appendChild(pre);
    });
  }

  // ---- 2. Anchor links on H2/H3 within .prose ----
  function setupAnchorLinks() {
    const headings = document.querySelectorAll('.prose h2[id], .prose h3[id]');
    headings.forEach((h) => {
      // Skip if already has anchor
      if (h.querySelector('.anchor')) return;
      const link = document.createElement('a');
      link.className = 'anchor';
      link.href = '#' + h.id;
      link.setAttribute('aria-label', 'Liên kết đến phần này');
      link.textContent = '§';
      h.insertBefore(link, h.firstChild);
    });
  }

  // ---- 3. TOC sidebar highlight ----
  function setupTocHighlight() {
    const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
    if (!tocLinks.length) return;

    const headingMap = new Map();
    tocLinks.forEach((a) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) headingMap.set(target, a);
    });

    if (!headingMap.size) return;

    let lastActive = null;
    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer the entry with smallest top-positive Y
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({ target: e.target, top: e.boundingClientRect.top }))
          .sort((a, b) => a.top - b.top);
        if (!visible.length) return;
        const top = visible[0].target;
        const link = headingMap.get(top);
        if (!link || link === lastActive) return;
        if (lastActive) lastActive.classList.remove('active');
        link.classList.add('active');
        lastActive = link;
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    headingMap.forEach((_, heading) => observer.observe(heading));
  }

  // ---- 4. Reading progress bar at top of viewport ----
  function setupProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.style.cssText = `
      position: fixed; top: 0; left: 0; height: 3px;
      width: 0%; background: var(--accent);
      z-index: 100; transition: width 0.1s linear; pointer-events: none;
    `;
    document.body.appendChild(bar);

    const update = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ---- 5. Smooth scroll for in-page anchors ----
  function setupSmoothScroll() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', '#' + id);
    });
  }

  // ---- Init ----
  function init() {
    setupCopyButtons();
    setupAnchorLinks();
    setupTocHighlight();
    setupProgressBar();
    setupSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
