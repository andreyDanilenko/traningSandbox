// one
// const questionBtns = document.querySelectorAll('.question-btn');

// questionBtns.forEach(function (btn) {
//   btn.addEventListener('click', function (e) {
//     const questions = e.currentTarget.parentElement.parentElement;
//     questions.classList.toggle('show-text');
//   });
// });
// two
const questions = document.querySelectorAll(".question");

questions.forEach(function (question) {
  const btn = question.querySelector('.question-btn')
  console.log(btn)
  btn.addEventListener('click', function () {
    questions.forEach(function (item) {
      if (item !== question) {
        item.classList.remove('show-text');
      }
    });
    question.classList.toggle('show-text');
  });
});

