// Add a copy button to every <pre> code block on the page
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = 'copy';
      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code') || pre;
        // Strip prompt markers from copied text
        const text = Array.from(code.childNodes)
          .map((n) => {
            if (n.nodeType === Node.TEXT_NODE) return n.textContent;
            if (n.nodeType === Node.ELEMENT_NODE) {
              if (n.classList && (n.classList.contains('prompt') || n.classList.contains('output') || n.classList.contains('comment'))) {
                return n.classList.contains('prompt') ? '' : n.textContent;
              }
              return n.textContent;
            }
            return '';
          })
          .join('')
          .replace(/^\s*\$\s?/gm, '')
          .trim();
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = '✓ copied';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'copy';
            btn.classList.remove('copied');
          }, 1500);
        } catch (e) {
          btn.textContent = 'failed';
        }
      });
      pre.appendChild(btn);
    });
  });
})();
