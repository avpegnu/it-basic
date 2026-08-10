/**
 * JS playground inline — chạy code JS trong sandbox iframe.
 * Mỗi widget .js-playground có 1 textarea + 1 button .run-btn + 1 .output area.
 * Bắt console.log/error/warn, hiển thị vào output.
 */
(function () {
  function runPlayground(playground) {
    const textarea = playground.querySelector('textarea');
    const output = playground.querySelector('.output');
    const code = textarea.value;

    output.classList.remove('error', 'empty');
    output.textContent = '';

    // Tạo iframe sandbox để cô lập exec
    const iframe = document.createElement('iframe');
    iframe.sandbox = 'allow-scripts';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const logs = [];
    const consoleProxy = {
      log: (...args) => logs.push(args.map(formatVal).join(' ')),
      info: (...args) => logs.push(args.map(formatVal).join(' ')),
      warn: (...args) => logs.push('⚠ ' + args.map(formatVal).join(' ')),
      error: (...args) => logs.push('✗ ' + args.map(formatVal).join(' ')),
      table: (data) => logs.push(formatVal(data)),
    };

    function formatVal(v) {
      if (typeof v === 'string') return v;
      if (typeof v === 'number' || typeof v === 'boolean') return String(v);
      if (v === null) return 'null';
      if (v === undefined) return 'undefined';
      if (typeof v === 'function') return v.toString().split('\n')[0] + '…';
      try { return JSON.stringify(v, null, 2); } catch { return String(v); }
    }

    try {
      // Eval in iframe global scope qua Function constructor
      const win = iframe.contentWindow;
      win.console = consoleProxy;
      const fn = new win.Function('console', code);
      const result = fn(consoleProxy);
      if (result !== undefined && logs.length === 0) {
        logs.push(formatVal(result));
      }
    } catch (e) {
      output.classList.add('error');
      logs.push('✗ ' + (e.message || String(e)));
    } finally {
      document.body.removeChild(iframe);
    }

    if (logs.length === 0) {
      output.classList.add('empty');
      output.textContent = '(no output)';
    } else {
      output.textContent = logs.join('\n');
    }
  }

  function init() {
    document.querySelectorAll('.js-playground').forEach((pg) => {
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
