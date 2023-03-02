window.addEventListener('DOMContentLoaded', () => {


    // Tabs

    const tabs = document.querySelectorAll('.tabheader__item'), // - табы (именования табов таблица)
          tabsContent = document.querySelectorAll('.tabcontent'), // - сами табы с контентом
          tabsParent = document.querySelector('.tabheader__items'); // - окно с табами

    // - Ф-я которая изначально скрывает все табы
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        // - Убираем активность у имени табов 
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    // - Ф-я показа табов (изначально первого) (i = 0 это по умолчанию)
    // - Показывает сам таб блок и активность в списке
    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }


    // - Запускаем ф-и для изначального отображения
    hideTabContent();
    showTabContent();


    // - Тут мы создаем для окна с табами делигирование событий чтобы получить и повесить события на доч. элементы 
    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

    // - Если нажатый элемент имеет класс 'tabheader__item' т.е. если мы на него нажали выполняем условие
    // - Перебираем сами наименования табов в таблице с forEach() 
    // - И как только перебираемый элемент равен тому который в таргете то вызываем ф-ии показа по номеру индекса
    // - Эти элементы будут равны тк по сути работаем с одинми и теми же элементами
    // - Только одни получены как дочерние через делигирование а вторые через перебор с forEach()
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    console.dir(target);
                    console.dir(item);
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });


    // Timer

    const deadline = '2023-03-11'; // - это дедлайн

    // Это ф-я которая будет получать и обрабатывать разницу между дедлайном и нынешней датой
    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        // Условия чтобы стояли нули если дата прошла
        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);
        }
              

        // Возвращаем полученные даты
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    // Ф-я добавляет нули перед одиночными числами
    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    // Это ф - я установки таймера где в переменные мы получаем DOM - элементы для дат
    // Аргументы это сам селектор .timer в верстке и дедлайн
    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        // СРазу вызываем ф-ю чтобы таймер обновлялся моментально без загрузки
        updateClock();

        // Ф-я обновления таймера - подставляет нужное нам время под таймер
        // Внутри вызываем ф-ю getTimeRemaining() для которой аргумент это дэдлайн
        function updateClock() {
            const t = getTimeRemaining(endtime);

            // В переменной t будет объект который возвращает ф-я getTimeRemaining()
            // И через t мы получаем доступ к дням часам и тд
            // Присвамиваем с функцией getZero(), чтобы перед одиночными числами ставился ноль
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    
    setClock('.timer', deadline);


    // Modal
    
    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal'),
          modalCloseBtn = document.querySelector('[data-close]');


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
    
    modalCloseBtn.addEventListener('click', closeModal); // - передаем ф-ю но не вызваем

    modal.addEventListener('click', (event) => {
        // Если таргет на modal (это внешняя щасть модального окна), то мы его закрываем
        if (event.target === modal) {
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

    const modalTimerId = setTimeout(openModal, 30000);

    // Вызов modal окна при скролле в конец страницы
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            // Удаляем слушатель после первого вызова по скроллу
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
});
