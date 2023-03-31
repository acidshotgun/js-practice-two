// Нужно сделать чтобы ф-и openModal() и closeModal() стали отдельными функциями и их можно было использовать извне
// в тч в forms 
//  1) Выносим ф-и в из modal() вначало
//  2) Далее экспорт этих ф-й

// Тут вылезет ошибка поскольку переменной modal не существует внутри этих ф-й тк она в modal() 
// Тут вспоминаем инкапсуляцию

// Чтобы обойти эту ошибку 


// Мы должны создавать модули так чтобы они зависели только от аргументов которые в них передаются
// Потому что мы можем создать например еще один слайдер и нам придется дублировать код но с другими селекторами
// Мы просто вызовем ф-ю которая будет создавать весь функционал слайдера 
// Но аргументами будут передаваться другие селекторы 
// Они уже при вызове будут срабатывать на своих селекторах на странице (что то похожее на классы)


// Поэтому мы должны сделать так чтобы внутри ф-и modal() создавались переменные н основе тех
// Селекторов которые будут переданы аргументами этой ф-ии
// modalTrigger и modal будут содержать в себе как раз эти переданные селекторы


// Селекторы будут передаваться в ф-ю в главном файле script.js при импорте


// Так же передаются по аргументам зн-я и в функциии чтобы переменная modal работала в этих ф-ях
// Туда нужно вставить так же получаение по селектору через querySelector
// Изначально функция будет вызываться и не будет знать с чем она работает а поймет она это по селектору
// По сути ф-ии будут работать независимо 
// Но при вызове внутри ф-ии modal() эти ф-ии (close и open) будут принимать в аргумент тот же селектор modalSelector
// Который предастся им ои аргементов ф-и modal()

// Теперь нам нужно передать этот селектор во все случаи когда мы вызываеь ф-ю openModal() и closeModal()
// Решено


// История с modalTimerId
// Мы вырезали создание таймера modalTimerId и поместим в главный script.js чтобы она создавался там
// Оттуда же аргументом передается этот modalTimerId сюда и вызывается в modal() третьим аргументом

// По такому же принципу что и первая задача
// Ф-я openModal() будет вызываться с переданным в аргумент таймером который берется как аргумент у modal()
// openModal() вызывается при клике или через 50 секунд
// Если событие на кнопке вызвано то openModal() автоматически активируется с переданным селектором и таймером
// А по условию если таймер будет передан то он и сбросится




// Ф-я открывает modal окно при вызове
// Передаем аргумент modalTimerId чтобы ф-я могла с ним работать и сбрасывает таймер если мы кликнем на модал окно
function openModal(modalSelector, modalTimerId) {
    // Аргумент передаваемый при вызови ф-и в modal() будет соответствовать переданному в этом modal() селектору
    const modal = document.querySelector(modalSelector);

    modal.classList.add('show', 'fade');
    modal.classList.remove('hide');
    // modal.classList.toggle('show');
    // Убрать скролл когда modal block
    document.body.style.overflow = 'hidden';
    // Открыв modal сам он не вылезет. Уберем таймер
    // И проверим передан ли modalTimerId в аргументе. Если да то запускаем очистку таймера
    // Те
    console.log(modalTimerId);
    
    // Условие которое сбросит таймер если этот аргемент передан
    // Иными словами этот аргумент передается когда openModal() активируется по клику или через 50 секунд
    // Получается этот аргумент при вызове в moddal() где передается таймер и принимается ф-й openModal()
    if (modalTimerId) {
        clearInterval(modalTimerId);
    }
}

// Ф-я закрывает modal окно при вызовах
function closeModal(modalSelector) {
    // Аргумент передаваемый при вызови ф-и в modal() будет соответствовать переданному в этом modal() селектору
    const modal = document.querySelector(modalSelector);

    modal.classList.add('hide');
    modal.classList.remove('show', 'fade');
    // Вернуть скролл когда modal none
    document.body.style.overflow = 'scroll';
}


// Ф-я которая создает модальное окно на основе селекторов в аргементах
// Т.е 1 - это вызов модального окна (кнопка связаться), а 2 - это само модальное окно
function modal(triggerSelector, modalSelector, modalTimerId) {
    
    // Modal
    
    // Подставляем аргументы с селекторами в переменные 
    // Кнопка вызова модального окна
    const modalTrigger = document.querySelectorAll(triggerSelector),
            // Само модальное окно
          modal = document.querySelector(modalSelector);

    modalTrigger.forEach(btn => {
        // Первая передача по селектору. Делаем ф-. после коллбэка чтобы она не вызывалась сразу а после 'click'
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));
    });

    modal.addEventListener('click', (event) => {
        // Если таргет на modal (это внешняя щасть модального окна), или это крестик (data-close) то мы его закрываем
        // data-close - это атрибут который мы указали в инлайне этому блоку
        // Так ф-я будет работать на всех крестиках где есть этот дата-атрибут
        if (event.target === modal || event.target.getAttribute('data-close') == '') {
            closeModal(modalSelector); // - вызываем если срабатывает условие
        }
    });

    // Закрыть modal при нажатии ESC вешается на документ событие code (event.code)
    document.addEventListener('keydown', (event) => {
        // Проверяется что кнопка нажата именно в момент когда открыто modal с помощью contains()
        if (event.code === 'Escape' && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });

    // Вызов modal окна при скролле в конец страницы
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal(modalSelector, modalTimerId);
            // Удаляем слушатель после первого вызова по скроллу
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
}

// Экспорт modal и ф-й
export default modal;
// Экспорт ф-й чтобы можно было их использовать в других модулях
export {openModal, closeModal};
// Затем в forms.js мы их импортируем