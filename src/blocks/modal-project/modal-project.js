// modal
const modalBtn = document.querySelector('.modal__btn');
const modal = document.querySelector('.modal__overlay');
const modalCloseBtn = document.querySelector('.modal__close-btn');

if (modalBtn && modal) {
  modalBtn.addEventListener('click', function () {
    modal.classList.add('modal__open');
  });
};

if (modalCloseBtn && modal) {
  modalCloseBtn.addEventListener('click', function () {
    modal.classList.remove('modal__open');
  });
};