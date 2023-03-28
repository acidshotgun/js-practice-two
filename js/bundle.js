/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((module) => {

function calc() {

    // Calc

    // Результат колорий
    const result = document.querySelector('.calculating__result span');
    // Параметры которые будут меняться
    // Ставим зн-я sex и  ratio по умолчанию чтобы изначально они как бы были уже нажаты
    // Иначе девушка с умеренной подвижностью введет только цифровые данные и ничего меняться не будет
        // Там нужно будет еще раз кликать на пол и умеренную активность
    let sex, height, weight, age, ratio;

    // Ниже по коду идет запись значений в локальное хранилище
    // Тут проверим что если эти значения существуют то пусть они будут заполнены
    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        // Если нет то это значение будет по умолчанию
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        // Если нет то это значение будет по умолчанию
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    // Ф-я которая инициализирует калькулятор и при загрузке будет подставлять параметры из localStorage и активность
    function initLocalSettings(selector, activeClass) {
        // Получаем элемент из селектора в аргументе (а именно div внутри)
        const element = document.querySelectorAll(selector);

        // Перебераем каждый элемент и убираем все классы активности
        element.forEach(elem => {
            elem.classList.remove(activeClass);
            // Проверяем если в localStorage есть 'sex' и она равер элементу по id то даем класс актсиновти
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            
            // Аналогично тут но сравнение по localStorage и data атрибуту
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    // Инициилизируем ф-ю при фходе и обновлении страницы
    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    // У нас будет две функции одна будет брать значения из инпутов вторая из блоков с активностью дневной
    
    // Ф-я подсчета конечного результат (основная)
    // Для начала мы проверим условия чтобы все нужные параметры были заполнены
    // Те если они не заполнены то == false. Используем (!)
    // Эта ф-я будет вызываться после каждого обновления параметров клик и ввод
    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            // Такой прием с return используется чтобы прервать функцию тогда код ниже идти не будет
            return;
        }

        // Далее исходим из того какой пол выбран
        // А формула взята из инета
        // округляем до ближайшего целого Math.round
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    // Вызываем чтобы очистить поле с калориями
    calcTotal();

    // Теперь ф-ии получения данных
    // Первая ф-я будет получать данные со статического контента, те где просто нужно выбрать суточную активность
    // Аргументы это селектор и класс активности
    // Одна эта ф-я будет вызываться с аргументами для блока с полом и для блока с активностью отдельно
    // По аргументами
    function getStaticInformation(selector, activeClass) {
        // Получаем элементы внутри блока
        // Получаем все div внутри этого родителя
        const elements = document.querySelectorAll(selector);

        // Перебором вешаем на каждый элемент слушатель
        elements.forEach(elem => {
            elem.addEventListener('click', (event) => {
                // У выбора пола и активности разные атрибуты
                // Активность имеет дата атрибут а пол id
                // Тут прописываем условия при клике и получаем разные атрибуты
                // При клике на активность (у нее атрибут) будем получать значение активности
                if (event.target.getAttribute('data-ratio')) {
                    ratio = +event.target.getAttribute('data-ratio');
                    // Так же добавим localStorage чтобы данные запоминались
                    localStorage.setItem('ratio', +event.target.getAttribute('data-ratio'));
                } else {
                    // При клике на пол (у него id) будем получать в sex пол
                    sex = event.target.getAttribute('id');
                    localStorage.setItem('sex', event.target.getAttribute('id'));
                }
    
                // Убираем все классы активности которые передаем в функцию
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
    
                // Затем класс активности назначаем нажатому элементу
                event.target.classList.add(activeClass);
    
                // Вызываем чтобы ф-я чтобы значение калорий менялось после каждого обновления параметров
                calcTotal();
            });
        });
    }

    // Вызываем эту функцию для двух статичных блоков по разным аргументам (сам блок в верстке и класс активности при клике)
    // 1) Это будет по id gender обращаемся к div 2) Это класс активности для выделения (это все в верстке)
    // Блок с полом
    getStaticInformation('#gender div', 'calculating__choose-item_active');
    // Блок с активностью
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');


    // Пишем ф-я которая будет собирать данные с введенных параметров (которые надо вводить)
    // Аргементы это селектр инпута
    function getDynamicInformation(selector) {
        // Получаем тот инпут с которым работаем
        const input = document.querySelector(selector);

        // Обработчик ввода для поля в котором происходит ввод
        input.addEventListener('input', () => {

            // Составляем условие при котором будет проверятся тип вводимых данных при инпуте
            // Если это не число то будет красная обводка
            // Если число то обводки нет
            if (input.value.match(/\D/g)) {
                input.style.border = '2px solid red';
            } else {
                input.style.border = 'none';
            }

            // Чтобы понять какой именно инпут заполняется в данный момент можно использовать switch case
            // В условии мы получаем атрибут выбранного элемента по id и указываем д-я для каждлого условия (инпута)
            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            // Теперь ф-я ореинтируется на инпут и ореинтируя на id записывает данные в опр переменную

            // Вызываем чтобы ф-я чтобы значение калорий менялось после каждого обновления параметров
            calcTotal();
        });
    }

    // Теперь вызываем с трея разными селекторами чтобы работала
    getDynamicInformation('#weight');
    getDynamicInformation('#height');
    getDynamicInformation('#age');
}

module.exports = calc;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

function cards() {
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

    // Создаем функцию которая будет получать с сервера данные для создания карточек
    const getResource = async (url) => {
        const res = await fetch(url);

        // Поскольку fetch() не обрабатывает ошибки кроме 404 он не активирует catch, поэтому их надо прописать самим
        // ok - Этот сатус как 200
        // Если статус не ок, то выкинем ошибку (throw) и пояснение что за ошибка
        // Создается как объект new и теперь можем получить url и статус ошибки
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status ${res.status}`);
        }

        return await res.json();
    };

    // Вызываем функцию, где аргументом будет ссылка на массив с карточками в базе данных
    // getResource('http://localhost:3000/menu')
    // // Обрабатываем полож исход
    // .then(data => {
    //     // Тк в бд это массив беребираем его. Аргумент это объекты в массиве (деструктуризация)
    //     // И на их основе создается новый объект от класса с аргументами
    //     // Затем render() будет генерировать верстку табов на сайте
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         new MenuCard(img, altimg, title, descr, price, '.menu .container', 'menu__item').render();
    //     });
    // });


    // Вариант создания с помощью axios
    axios.get('http://localhost:3000/menu')
    .then(data => {
        data.data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container', 'menu__item').render();
        });
    });
    

    // Этот подход избавил нас от создания этих карточек тут вручную
    // И теперь они создлаются на основании данных с базы данных
}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms() {

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
        bindPostData(item);
    });

    //!Комментарии!
    // Создаем функцию отправки данных на сервер в базу данных
    // Аргументами будет принимать ссылку и то что нужно отрпавить
    // Возвращаться будет результат записанный в переменную res и переведенный в формат обычного объекта методом json()
    // В теле будет передаваться аргумент (это будут те данные которые мы быдем отправлять на серв)

    // НО это асинхронный код и он не будет ждать (промисы асинхорнны)
    // Поэтому чтобы не допустить ошибку необходимо использовать конструкцию async / await
    // async - ставится перед ф-й (говорит, что в ф-и будет асинхронный код)
    // await - парный оператор. Ставится перед теми учустками которые необходимо подождать
    // Теперь когда мы получим ответ от сервера await пропустит код дальше чтобы не было ошибки
    // Так же ставим в возврате, тк это тоже промис и он может быть большим

    const postData = async (url, data) => {
        const res = await fetch(url, {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: data,
        });

        return await res.json();
    };

    // Ф-я которая будет постить данные с событием 'submit - отправить'
    function bindPostData(form) {
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

            // Тут мы должны превратить  formData в JSON формат, чего напрямую сделать не можем, его нужно "пересоздать"
            // Для этого мы создадим переменную и поместим в нее JSON - объект
            // Этот объект получился после преобразования formData в массив а потом обратно в объект
            // Методы Object.entries() и Object.fromEntries()
            // Этот объект приет ф-я postData в кач-ве аргумента
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            // Убрали трансформацию JSON в объект тк функция это уже сделала
            // И в data получаем уже обычный объект 
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
}

module.exports = forms;

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

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

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

function slider() {
    
    // Slider

    // В этом сп-е мы создали в обертке еще один блок <div class="offer__slider-inner"></div>
    // И в него поместили сами слайды
    // Это делается для того чтобы главная обертка была как окошко

    // Алгоритм
    //  1) Блоку offer__slider-wrapper(обертка) мы назначим overflow: hidden и все что будет шире - скроется
    //  2) Блок offer__slider-inner будет в виде карусели и будет занимать ширину равную ширине всех слайдов вместе
    //      И при нажатии кнопок мы будет не скрывать/показывать а двигать это карусель влево/вправо

    const slides = document.querySelectorAll('.offer__slide'),
          // Весь блок слайдера с точками и стрелками
          slider = document.querySelector('.offer__slider'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          // Это сама карусель
          slidesField = document.querySelector('.offer__slider-inner'),
          // Эта переменная нужна чтобы получить ширину самой обертки слайдера которая была задана
          width = window.getComputedStyle(slidesWrapper).width;
          
    let slideIndex = 1;
    
    // Эта переменная будет показывать на сколько мы отступили вправо/влево при помощи tranform
    let offset = 0;

    // Условие для отображения чисел с 0 или без
    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }



    // Кстанавливаем ширину карусели по отношению к кол-ву слайдов (кол-во слайдов умножить на 100%)
    // Те ширина карусели будет равна ширине всех слайдов стоящих подряд в линию
    // Это css стили там еденицы измерения
    slidesField.style.width = 100 * slides.length + '%';

    // И чтобы слайды расположить в ряд и сделать плавный переход прописываем нужные стили
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    // Скрываем то что выходит за рамки wrapper
    slidesWrapper.style.overflow = 'hidden';

    // Тут перебираем все слайды и говорим чтобы все слайды по ширине были равны ширине обертки (width) которую получили
    // И теперь каждый слайд заполняем весь wrapper
    slides.forEach(slide => {
        slide.style.width = width;
    });

    // Точки у слайдера
    // Блоку позиционирование чтобы точки можно было располагатьт абсолютно
    slider.style.position = 'relative';

    // Создаем обертку для всех точек и стилизуем затем помещаем в сам блок слайдера
    const indicators = document.createElement('ol'),
          // Создадим массив для точек чтобы работать с ними в обработчиках событий при переключении слайдов
          dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0; 
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    // Создаем точки. Их кол-во будет зависеть от кол-ва самих слайдов
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        // Ставим каждой точке атрибут с нумерацией от 1 и стилизуем
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;

        if (i == 0) {
            dot.style.opacity = 1;
        }
        // Помещаем точки в обертку для точек
        indicators.append(dot);
        // Добавляем точки в массив
        dots.push(dot);
    }

    // Ф-я условия показа 0 при однозначных current числах
    function checkCurrentNumbers(current) {
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }

    // Ф-я движения блока карусели в сторону на offset пикселей т.е двигается влево на offset px
    function setTranslateCarousel(offset) {
        slidesField.style.transform = `translateX(-${offset}px)`;
    }

    // Ф-я которая внутри с помощью регулярных выражений будет превращать строки типа '100px' в число 100 
    // Чтобы записать в offset
    // МОжно так же использовать в будущем но с другими агрументами
    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');
    }

    // Скрпит сдвига по нажатию
    next.addEventListener('click', () => {
        // Условие при котором слайдер возвращается на первый слайд
        // Поскольку в переменной width у нас строка мы удалим две последние буквы и превратим в число с помощьью (+)
        // Удалим при помощи регулярных выражений и удалим все не числа и превратим '100px' в число 100 например
        if (offset == deleteNotDigits(width) * (slides.length - 1)) {
            offset = 0;
        } else {
            // Когда нажимаем стрелку то прибавляется ширина еще одного слайда и все сдвигается влево
            offset += deleteNotDigits(width);
        }

        // Движение блока карусели в сторону на offset пикселей т.е двигается влево на offset px
        setTranslateCarousel(offset);

        // Условия при котором счетчик будет возвращаться в положение 1 если next на последнем слайде
        // И else он просто увеличивается
        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        // Ф-я условия показа 0 при однозначных current числах
        checkCurrentNumbers(current);
        setDotOpacity(dots);
    });

    prev.addEventListener('click', () => {
        // Условие при котором слайдер возвращается на последний слайд
        // Если мы находимся на первом слайде и жмем кнопку то перемещаемся на последний слайд
        if (offset == 0) {
            offset = deleteNotDigits(width) * (slides.length - 1);
        } else {
            offset -= deleteNotDigits(width);
        }

        // Движение блока карусели в сторону на offset пикселей т.е двигается влево на offset px
        setTranslateCarousel(offset);

        // Тут условие если мы находимся на 1 слайде и проматываем влево и попадаем на последний слайд
        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        // Ф-я условия показа 0 при однозначных current числах
        checkCurrentNumbers(current);
        setDotOpacity(dots);
    });
    
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = deleteNotDigits(width) * (slideTo - 1);

            // Движение блока карусели в сторону на offset пикселей т.е двигается влево на offset px
            setTranslateCarousel(offset);

            // Ф-я условия показа 0 при однозначных current числах
            checkCurrentNumbers(current);
            //Ф-я перебора точек и установка прозрачности
            setDotOpacity(dots);
        });
    });

    // Ф-я перебора точек и установка прозрачности
    // Перебираем точки и всем ставим прозрачность 50%
    // А та точка которая по интексу совпадает со слайдом будет иметь прозрачность 1
    function setDotOpacity(dots) {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    }
}

module.exports = slider;

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tabs() {
    
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
}

// Экспортируем модуль синтаксисом CommonJS
module.exports = tabs;

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

function timer() {
    
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
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
window.addEventListener('DOMContentLoaded', () => {
    const tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
          modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
          timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js"),
          cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
          calc = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js"),
          forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
          slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js");
          
    tabs();
    modal();
    timer();
    cards();
    calc();
    forms();
    slider();
});


 
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map