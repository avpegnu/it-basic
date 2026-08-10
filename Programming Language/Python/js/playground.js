/**
 * Python playground inline — chạy Python qua Pyodide (WASM build of CPython).
 * Lazy-load Pyodide khi user click "Run" lần đầu. Cached cho các widget khác.
 *
 * Mỗi widget .py-playground có: textarea + button .run-btn + .output area.
 * Bắt stdout/stderr, hiển thị vào output.
 */
(function () {
  let pyodidePromise = null;

  function loadPyodide() {
    if (pyodidePromise) return pyodidePromise;

    pyodidePromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
      script.onload = async () => {
        try {
          // eslint-disable-next-line no-undef
          const pyodide = await loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
          });
          resolve(pyodide);
        } catch (e) {
          reject(e);
        }
      };
      script.onerror = () => reject(new Error('Failed to load Pyodide script'));
      document.head.appendChild(script);
    });

    return pyodidePromise;
  }

  async function runPlayground(playground) {
    const textarea = playground.querySelector('textarea');
    const output = playground.querySelector('.output');
    const code = textarea.value;

    output.classList.remove('error', 'empty');
    output.classList.add('loading');
    output.textContent = 'Đang tải Python runtime (lần đầu mất ~3-5 giây)...';

    try {
      const pyodide = await loadPyodide();
      output.classList.remove('loading');

      let captured = '';
      pyodide.setStdout({
        batched: (s) => { captured += s + '\n'; },
      });
      pyodide.setStderr({
        batched: (s) => { captured += s + '\n'; },
      });

      try {
        const result = await pyodide.runPythonAsync(code);
        if (captured) {
          output.textContent = captured.trimEnd();
        } else if (result !== undefined && result !== null) {
          output.textContent = String(result);
        } else {
          output.classList.add('empty');
          output.textContent = '(no output)';
        }
      } catch (e) {
        output.classList.add('error');
        output.textContent = e.message || String(e);
      }
    } catch (e) {
      output.classList.remove('loading');
      output.classList.add('error');
      output.textContent = 'Không tải được Pyodide. Kiểm tra kết nối mạng.';
    }
  }

  function init() {
    document.querySelectorAll('.py-playground').forEach((pg) => {
      const runBtn = pg.querySelector('.run-btn');
      if (runBtn) {
        runBtn.addEventListener('click', () => runPlayground(pg));
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
