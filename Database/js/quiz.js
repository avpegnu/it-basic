/* Quiz interaction — Database pillar */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.quiz-question').forEach((q) => {
    const correct = q.dataset.correct;
    const explain = q.querySelector('.quiz-explain');
    q.querySelectorAll('.quiz-option').forEach((opt, idx) => {
      opt.addEventListener('click', () => {
        if (q.classList.contains('answered')) return;
        q.classList.add('answered');
        const isCorrect = String(idx) === String(correct);
        opt.classList.add(isCorrect ? 'correct' : 'wrong');
        if (!isCorrect) {
          q.querySelectorAll('.quiz-option').forEach((o, i) => {
            if (String(i) === String(correct)) o.classList.add('correct');
          });
        }
        if (explain) explain.classList.add('show');
      });
    });
  });
});
