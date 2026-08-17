/* ============================================================
   Pillar 10 — AI Engineering · Shared chapter JS

   1. Nút sao chép cho mọi khối code (cả khối tự bọc sẵn trong
      HTML lẫn khối <pre> trần)
   2. Anchor link tự sinh trên heading H2/H3
   3. TOC sidebar tự highlight mục đang xem
   4. Thanh tiến độ đọc ở đỉnh màn hình
   5. Cuộn mượt cho liên kết trong trang

   Không phụ thuộc thư viện ngoài. An toàn khi chạy nhiều lần.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. Nút sao chép ---------- */

  function attachCopyHandler(btn, pre) {
    if (btn.dataset.copyBound === '1') return;
    btn.dataset.copyBound = '1';
    btn.type = 'button';

    btn.addEventListener('click', async function () {
      var code = pre.querySelector('code');
      var text = code ? code.innerText : pre.innerText;
      var original = btn.textContent;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          // Dự phòng cho file:// và trình duyệt cũ — Clipboard API
          // chỉ hoạt động trong ngữ cảnh bảo mật (https / localhost)
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.top = '-1000px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        btn.textContent = '✓ Đã sao chép';
        btn.classList.add('copied');
      } catch (e) {
        btn.textContent = 'Không sao chép được';
      }

      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1600);
    });
  }

  function setupCopyButtons() {
    // (a) Khối đã bọc sẵn .code-wrap trong HTML — chỉ cần gắn sự kiện
    document.querySelectorAll('.code-wrap').forEach(function (wrap) {
      var pre = wrap.querySelector('pre');
      var btn = wrap.querySelector('.copy-btn');
      if (pre && btn) attachCopyHandler(btn, pre);
    });

    // (b) <pre> trần — tự bọc rồi gắn sự kiện
    document.querySelectorAll('pre').forEach(function (pre) {
      if (pre.closest('.code-wrap')) return;

      var wrap = document.createElement('div');
      wrap.className = 'code-wrap';

      var meta = document.createElement('div');
      meta.className = 'code-meta';

      var code = pre.querySelector('code');
      var lang =
        pre.dataset.lang ||
        (code && (code.className.match(/language-([\w+-]+)/) || [])[1]) ||
        'code';

      var label = document.createElement('span');
      label.textContent = lang;
      meta.appendChild(label);

      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Sao chép';
      meta.appendChild(btn);

      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(meta);
      wrap.appendChild(pre);

      attachCopyHandler(btn, pre);
    });
  }

  /* ---------- 2. Anchor trên heading ---------- */

  function setupAnchorLinks() {
    document.querySelectorAll('.prose h2[id], .prose h3[id]').forEach(function (h) {
      if (h.querySelector('.anchor')) return;
      var a = document.createElement('a');
      a.className = 'anchor';
      a.href = '#' + h.id;
      a.setAttribute('aria-label', 'Liên kết tới phần này');
      a.textContent = '§';
      h.insertBefore(a, h.firstChild);
    });
  }

  /* ---------- 3. Highlight TOC theo phần đang xem ---------- */

  function setupTocHighlight() {
    var links = document.querySelectorAll('.toc a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = new Map();
    links.forEach(function (a) {
      var id = decodeURIComponent(a.getAttribute('href').slice(1));
      var target = document.getElementById(id);
      if (target) map.set(target, a);
    });
    if (!map.size) return;

    var active = null;
    function setActive(link) {
      if (link === active) return;
      if (active) active.classList.remove('active');
      link.classList.add('active');
      active = link;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        var visible = entries
          .filter(function (e) { return e.isIntersecting; })
          .map(function (e) { return { el: e.target, top: e.boundingClientRect.top }; })
          .sort(function (a, b) { return a.top - b.top; });
        if (!visible.length) return;
        var link = map.get(visible[0].el);
        if (link) setActive(link);
      },
      { rootMargin: '-80px 0px -68% 0px', threshold: 0 }
    );

    map.forEach(function (_, heading) { observer.observe(heading); });
  }

  /* ---------- 4. Thanh tiến độ đọc ---------- */

  function setupProgressBar() {
    if (document.querySelector('.reading-progress')) return;

    var bar = document.createElement('div');
    bar.className = 'reading-progress';
    document.body.appendChild(bar);

    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ---------- 5. Cuộn mượt trong trang ---------- */

  function setupSmoothScroll() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (href === '#') return;

      var target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (history.pushState) history.pushState(null, '', href);
    });
  }

  /* ---------- Khởi động ---------- */

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
