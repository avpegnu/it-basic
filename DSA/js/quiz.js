/* Quiz tương tác — click vào option để xem đúng/sai và giải thích */
(function () {
  const questions = document.querySelectorAll('.quiz-question');
  questions.forEach((q) => {
    const correctIndex = parseInt(q.dataset.correct, 10);
    const options = q.querySelectorAll('.quiz-options li');
    options.forEach((opt, i) => {
      opt.addEventListener('click', () => {
        if (q.classList.contains('answered')) return;
        q.classList.add('answered');
        options.forEach((o) => o.classList.add('disabled'));
        if (i === correctIndex) {
          opt.classList.add('correct');
        } else {
          opt.classList.add('wrong');
          options[correctIndex]?.classList.add('correct');
        }
      });
    });
  });
})();
