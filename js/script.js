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

    const deadline = '2023-04-11'; // - это дедлайн

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


    // Classes for tabs
    // Идея - шаблонизировать карточки и создавать их передвая нужные аргументы

    // Как создать класс карточки?
    // 1) src - путь к изображению, 2) Текст если картинка поламалась, 3) Title, 4) Descr, 5) Price
    // Эти св-ва задаются в кач-ве аргумента в конструктор
    // parentSelector это передваемый контейнер где будут наши элементы

    // Посколько мы можем добавлять множество классов мы воспользуемся оператором rest(...classes)
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.transfer = 27;
            this.changeToUAH();
        }

        // Далее создаем методы и первый метот смена курса валют будет вызваться прямо в конструкторе
        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        // Метод render. Нужно создать элемент и поместить его в верстку. Верстку дополнить данными - аргументами
        // И поместить элемент на страницу
        render() {
         // Тут мы создаем элемент и помещаем его в переменную element (этот элемент будет помещен в контейнер в html)
            const element = document.createElement('div');
            // Если в оператор rest ничего не передается мы присваиваем значение по умолчанию
            if (this.classes.length === 0) {
                this.classes = 'menu__item';
                element.classList.add(this.element);
            } else {
                // Тк rest дает нам массив то мы перебираем его и присваиваем element класс который получим в className
                this.classes.forEach(className => element.classList.add(className));
            }
            // Помещаем в element содержимое которое будет рендерится в нашей верстке
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;

            // Ранее мы создали переменную parent в классе
            // В него мы передаем в данном случае контейнер, в который будем помещать созданные элементы
            this.parent.append(element);
        }
    }

    // Далее просто создаем объекты из класса задавая аргументы для конструктора
    // Можно записывать const menuCard = MenuTab(аргументы)
    // Но мы используем кроткий синтаксис где переменнты не будут хранится а просто потеряются
    // И сразу вызываем на нем наш метод render() который и будет генерировать табы
    new MenuCard(
        'img/tabs/vegy.jpg',
        'vegy',
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
        // Ниже ...rest
        'menu__item'
    ).render();

    new MenuCard(
        'img/tabs/elite.jpg',
        'elite',
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        20,
        '.menu .container',
        'menu__item'
    ).render();

    new MenuCard(
        'img/tabs/post.jpg',
        'post',
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        15,
        '.menu .container',
        'menu__item'
    ).render();


    // Forms
//!!!!!
    const forms = document.querySelectorAll('form');

    // Объект сообщений для различных исходов для запроса
    const message = {
        loading: 'img/form/005spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...',
    };

    // Вешаем обработчик submit на каждую форму их две
    // Через ф-ю. Она будет вешать обработчик на формы
    // Просто вызвав ф-ю postData() на каждую форму
    forms.forEach(item => {
        postData(item);
    });

    // Ф-я которая будет постить данные с событием 'submit - отправить'
    function postData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Создаем блок статуса нашего запроса используя объект img
            // Это спиннер загрузки который видно на медленном интернете
            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            // Добавляем это сообщение к форме (сообщение будет там внутри)
              // С помощью метода insertAdjacentElement()
            form.insertAdjacentElement('afterend', statusMessage);

   
            // Создаем объект, который будет формировать все заполненые данные с формы
            // Ключ - значение. Принимает в себя аргумент функции postData()
            // Главное чтобы отправка сработала нужно в inline input в htlm указать атрибут name="something"
            const formData = new FormData(form);

            // Тут мы должны превратить  formData в JSON формат, чего напрямую сделать не можем
            // Для этого мы создадим пустой объект и запишим туда св-ва reuest'а, а объект сделаем формата JSON
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });

            // Создаем объект запроса(промис) и настраиваем (есть в репозитории learning)
            fetch('server.php', {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(object),
            })
            // Делаем из JSON текст формат
            .then(data => data.text())
            // Код выполняющийся при успешном запросе
            // Показывает благодарность и убирает спинер загрузки
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
                // catch() сработает если что то пошло не так
                // Выдаст окно с ошибкой
            }).catch(() => {
                showThanksModal(message.failure);
                // При любом исходе формы очистятся
            }).finally(form.reset());
        });
    }

    // Ф-я будет изменять благодарственное окно после отправки данных
    // В зависимости от статуса запроса
    // Соответственно аргументом будет сообщение со статусом
    function showThanksModal(message) {
        // получаем само модальное окно
        const prevModalDialog = document.querySelector('.modal__dialog');

        // Скрывем блок отправки данных добавив класс
        prevModalDialog.classList.add('hide');
        // Теперь мы вызываем структуру модального окна
        // И формируем внутри структуру с благодарностью после отправки данных
        openModal();

        // Сама структура и ее содержание
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class='modal__content'>
                <div class='modal__close' data-close>×</div>
                <div class='modal__title'>${message}</div>
            </div>
        `;

        // Тут без создания переменной сразу помещаем в .modal новый контент с созданой благодарностью
        document.querySelector('.modal').append(thanksModal);

        // Тут мы через 4 секунды убираем благодарственное окно и возвращаем блок заполнения
        // На тот случай если потребуется отправить заявку еще раз
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }
});


