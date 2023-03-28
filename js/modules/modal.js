function modal() {
    
    // Modal
    
    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');


    // Ф-я открывает modal окно при вызове
    function openModal() {
        modal.classList.add('show', 'fade');
        modal.classList.remove('hide');
        // modal.classList.toggle('show');
        // Убрать скролл когда modal block
        document.body.style.overflow = 'hidden';
        // Открыв modal сам он не вылезет. Уберем таймер
        clearInterval(modalTimerId);
    }

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });
    
    // Ф-я закрывает modal окно при вызовах
    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show', 'fade');
        // Вернуть скролл когда modal none
        document.body.style.overflow = 'scroll';
    }
    

    modal.addEventListener('click', (event) => {
        // Если таргет на modal (это внешняя щасть модального окна), или это крестик (data-close) то мы его закрываем
        // data-close - это атрибут который мы указали в инлайне этому блоку
        // Так ф-я будет работать на всех крестиках где есть этот дата-атрибут
        if (event.target === modal || event.target.getAttribute('data-close') == '') {
            closeModal(); // - вызываем если срабатывает условие
        }
    });

    // Закрыть modal при нажатии ESC вешается на документ событие code (event.code)
    document.addEventListener('keydown', (event) => {
        // Проверяется что кнопка нажата именно в момент когда открыто modal с помощью contains()
        if (event.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    // Вызов modal окна при скролле в конец страницы
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            // Удаляем слушатель после первого вызова по скроллу
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
}

module.exports = modal;