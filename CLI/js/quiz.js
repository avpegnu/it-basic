// Quiz engine — reads questions from a global window.QUIZ_DATA array and renders into .quiz container.
// Each question: { q: "...", options: ["a","b"], correct: 0, explain: "..." }
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.quiz');
    if (!container || !window.QUIZ_DATA) return;

    const data = window.QUIZ_DATA;
    let answered = 0;
    let correctCount = 0;

    const questionsWrap = document.createElement('div');
    questionsWrap.className = 'quiz-questions';

    data.forEach((item, qIdx) => {
      const qDiv = document.createElement('div');
      qDiv.className = 'quiz-question';

      const qText = document.createElement('div');
      qText.className = 'q-text';
      qText.textContent = `Câu ${qIdx + 1}. ${item.q}`;
      qDiv.appendChild(qText);

      const opts = document.createElement('div');
      opts.className = 'quiz-options';

      let resolved = false;

      item.options.forEach((opt, oIdx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.type = 'button';
        btn.textContent = `${String.fromCharCode(65 + oIdx)}. ${opt}`;
        btn.addEventListener('click', () => {
          if (resolved) return;
          resolved = true;
          answered++;
          const isCorrect = oIdx === item.correct;
          if (isCorrect) {
            btn.classList.add('correct');
            correctCount++;
          } else {
            btn.classList.add('wrong');
            // Reveal correct answer
            opts.children[item.correct].classList.add('correct');
          }
          // Disable all
          Array.from(opts.children).forEach((c) => c.classList.add('disabled'));

          // Show explanation
          if (item.explain) {
            const fb = document.createElement('div');
            fb.className = 'quiz-feedback';
            fb.innerHTML = `<strong>${isCorrect ? '✓ Đúng' : '✗ Sai'}</strong> — ${item.explain}`;
            qDiv.appendChild(fb);
          }

          // If all answered, show score
          if (answered === data.length) {
            const score = container.querySelector('.quiz-score');
            if (score) {
              score.classList.add('show');
              score.innerHTML = `Kết quả: <span class="num">${correctCount}/${data.length}</span> câu đúng — ${
                correctCount === data.length
                  ? '🎉 Xuất sắc!'
                  : correctCount >= data.length / 2
                  ? '👍 Khá tốt, đọc lại phần sai để chắc kiến thức.'
                  : '📚 Nên xem lại bài rồi quiz lại nhé.'
              }`;
            }
          }
        });
        opts.appendChild(btn);
      });

      qDiv.appendChild(opts);
      questionsWrap.appendChild(qDiv);
    });

    // Insert before .quiz-score
    const scoreEl = container.querySelector('.quiz-score');
    if (scoreEl) container.insertBefore(questionsWrap, scoreEl);
    else container.appendChild(questionsWrap);
  });
})();
