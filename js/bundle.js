/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Делаем модуль

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

// Экспорт модуля по дефолту чтобы вызвать в гл файле сразу
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (calc);

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");
// Импорт ф-и получения данных с сервера


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

    // Ф-Я ПОЛУЧЕНИЯ ДАННЫХ С СЕРВЕРА СЕРВИСРНАЯ И НАХОДИТСЯ В services.js

    // Вызываем функцию, где аргументом будет ссылка на массив с карточками в базе данных
    (0,_services_services__WEBPACK_IMPORTED_MODULE_0__.getResource)('http://localhost:3000/menu')
    // Обрабатываем полож исход
    .then(data => {
        // Тк в бд это массив беребираем его. Аргумент это объекты в массиве (деструктуризация)
        // И на их основе создается новый объект от класса с аргументами
        // Затем render() будет генерировать верстку табов на сайте
        data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container', 'menu__item').render();
        });
    });


    // // Вариант создания с помощью axios
    // axios.get('http://localhost:3000/menu')
    // .then(data => {
    //     data.data.forEach(({img, altimg, title, descr, price}) => {
    //         new MenuCard(img, altimg, title, descr, price, '.menu .container', 'menu__item').render();
    //     });
    // });
    

    // Этот подход избавил нас от создания этих карточек тут вручную
    // И теперь они создлаются на основании данных с базы данных
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cards);

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal */ "./js/modules/modal.js");
/* harmony import */ var _services_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/services */ "./js/services/services.js");
// Импорт ф-й closeModal() и openModal() чтобы использовать тут в формах
// Не забываем указать в эти ф-и аргументы. См modal.js

// Чтобы модальное окно открывалось и закрывалось

// Импортируем скрипт постинга данных на сервер


// Передаем аргументом таймер который берем из script.js
// Так же аргументом будет селектор формы (передается из главного script.js) на случай если будет несколько селекторов
function forms(formSelector, modalTimerId) {

    // Forms
    //!!!!!
    const forms = document.querySelectorAll(formSelector);

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

    //! Ф-Я ПОСТИНГА ДАННЫХ НА СЕРВ СЕРВИСНАЯ И НАХОДИТСЯ В  services.js

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
            // Name будет в базе данных как пункт типа тел имя и тд ВОТ ЗАЧЕМ
            const formData = new FormData(form);

            // Тут мы должны превратить  formData в JSON формат, чего напрямую сделать не можем, его нужно "пересоздать"
            // Для этого мы создадим переменную и поместим в нее JSON - объект
            // Этот объект получился после преобразования formData в массив а потом обратно в объект
            // Методы Object.entries() и Object.fromEntries()
            // Этот объект приет ф-я postData в кач-ве аргумента
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            // Ф-я постинга данных
            (0,_services_services__WEBPACK_IMPORTED_MODULE_1__.postData)('http://localhost:3000/requests', json)
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

        // Теперь мы вызываем структуру модального окна но скрыв форму с заполнением
        // в openModal() как всегда идет класс и таймер сброса
        // И формируем внутри структуру с благодарностью после отправки данных
        (0,_modal__WEBPACK_IMPORTED_MODULE_0__.openModal)('.modal', modalTimerId);

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

            // Аргкмент о котором было ранее сказано
            (0,_modal__WEBPACK_IMPORTED_MODULE_0__.closeModal)('.modal');
        }, 4000);
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (forms);

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "closeModal": () => (/* binding */ closeModal),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "openModal": () => (/* binding */ openModal)
/* harmony export */ });
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (modal);
// Экспорт ф-й чтобы можно было их использовать в других модулях

// Затем в forms.js мы их импортируем

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Переданных аргументах у нас будет передаваться объект
// Этот объект тут и будет деструктуризироваться
//  container - это весь слайдер целиком (блок)
//  slide - каждый отдельный слайд(первая строка)
//  arrow - понятно стрелки
//  totalCounter - общий счетсчик
//  currentCounter - текущий слайд
//  wrapper - это обертка слайдера карусели
//  field - это сама длинная карусель которая двигается
function slider({container, slide, nextArrow, prevArrow, totalCounter, correntCounter, wrapper, field}) {
    
    // Slider

    // В этом сп-е мы создали в обертке еще один блок <div class="offer__slider-inner"></div>
    // И в него поместили сами слайды
    // Это делается для того чтобы главная обертка была как окошко

    // Алгоритм
    //  1) Блоку offer__slider-wrapper(обертка) мы назначим overflow: hidden и все что будет шире - скроется
    //  2) Блок offer__slider-inner будет в виде карусели и будет занимать ширину равную ширине всех слайдов вместе
    //      И при нажатии кнопок мы будет не скрывать/показывать а двигать это карусель влево/вправо

    const slides = document.querySelectorAll(slide),
          // Весь блок слайдера с точками и стрелками
          slider = document.querySelector(container),
          prev = document.querySelector(prevArrow),
          next = document.querySelector(nextArrow),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          // Обертка карусели
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (slider);

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// По аналогии эта ф-я будет принимать в себя аргументы из гл файла чтобы создавыть табы
// Это сами в списке справа
// Сами табы с контентом
// Окно с табами
// Класс активности для выделенного таба

function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    
    // Tabs

    const tabs = document.querySelectorAll(tabsSelector), // - табы (именования табов таблица)
          tabsContent = document.querySelectorAll(tabsContentSelector), // - сами табы с контентом
          tabsParent = document.querySelector(tabsParentSelector); // - окно с табами

    // - Ф-я которая изначально скрывает все табы
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        // - Убираем активность у имени табов 
        tabs.forEach(item => {
            item.classList.remove(activeClass);
        });
    }

    // - Ф-я показа табов (изначально первого) (i = 0 это по умолчанию)
    // - Показывает сам таб блок и активность в списке
    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add(activeClass);
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

        // Тут мы проверяем нажатый элемент нак в условии если он имеет класс 'tabheader__item'
        // Тут универсальный подхот где мы проверяем класс в classList  и он указывается без точки, когда аргемент передается с точкой
        // Методом slice уберем у строки аргумента '.tabheader__item' первый символ (.) и получится 'tabheader__item'
        // Теперь получается что когда нажатый у род блока tabsParent дочерний элемент имеет такой же класс как и в tabs 
        // Они совпадают дальше меняется содержимое tabsContent
        if (target && target.classList.contains(tabsSelector.slice(1))) {
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tabs);

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Передаем в ф-ю id - это селектор таймера (класс)
// А в дедлайн окончание акции последняя точка
// Теперь переменная дедлайн не нужна тк мы время передаем из главного файла

function timer(id, deadline) {
    
    // Timer

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
    
    // В id передается селектор таймера
    // А в дедлайн дата окончания акции тип
    setClock(id, deadline);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (timer);

/***/ }),

/***/ "./js/services/services.js":
/*!*********************************!*\
  !*** ./js/services/services.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getResource": () => (/* binding */ getResource),
/* harmony export */   "postData": () => (/* binding */ postData)
/* harmony export */ });
// В этом файле будут находится сервисные скрипты
// Например которые отпаравляют что-то на сервер или получают
// Их надо будет экспортировать

// Отправки данных на сервер
const postData = async (url, data) => {
    const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: data,
    });

    return await res.json();
};


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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js");
/* harmony import */ var _modules_modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js");
/* harmony import */ var _modules_timer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js");
/* harmony import */ var _modules_cards__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js");
/* harmony import */ var _modules_calc__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js");
/* harmony import */ var _modules_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js");
/* harmony import */ var _modules_slider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js");
// Импорты модулей
// Всегда помещаются в самом верху







// Импортируем ф-ю openModal() сюда чтобы ее принимал modalTimerId


// Слушатель загрузки
window.addEventListener('DOMContentLoaded', () => {
    // Таймер создается тут тк он используется и в modal и в form
    // Он активирует показ модального окна через 50 секунд а modalTimerId в аргументе его сбросит (modal.js)
    // Сбросит потому что в ф-и openModal() прописано что при ее срабатывании таймер сбрасывается при клике или через 50 сек
    // Создание таймера который сработает через время и выполнит ф-ю openModal() с опр аргументами
    // Чтобы она не вызывалась сама по себе при загрузке поместим так же в колбэк котоырй сработает через время
    const modalTimerId = setTimeout(() => (0,_modules_modal__WEBPACK_IMPORTED_MODULE_1__.openModal)('.modal', modalTimerId), 50000);

    // Вызываем все ф-и модулей чтобы они запустились и работали на странице

    // Передаем в tabs() аргументы с которыми она будет работать для создания табов
    //          можно продублировать с другими аргументами и создастся новый блок с табами если нужен
    (0,_modules_tabs__WEBPACK_IMPORTED_MODULE_0__["default"])('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    // Глобальная ф-я modal() принимает в себя 1) Кнопка показа 2) Само окно 3) Таймер
    (0,_modules_modal__WEBPACK_IMPORTED_MODULE_1__["default"])('[data-modal]', '.modal', modalTimerId);
    (0,_modules_cards__WEBPACK_IMPORTED_MODULE_3__["default"])();
    // Калькулятор нах надо там куча всего и зачем его на сайте переиспользовать Когда он должен быть один да?
    (0,_modules_calc__WEBPACK_IMPORTED_MODULE_4__["default"])();
    // В форме будет использоваться таймер передаем его тут и в самом файле form чтобы он работал
    // Закидываем селектор аргументом чтобы ф-я работала с ним (можно потом еще подставлять)
    (0,_modules_forms__WEBPACK_IMPORTED_MODULE_5__["default"])('form', modalTimerId);
    // В слайдере будем передавать объект это деструктуризация будет а передаем объект с настройками
    // В слайдере деструктуризация поэтому сюда в любом порядрке можно передавать аргументы с которыми будет работаь слайдер
    (0,_modules_slider__WEBPACK_IMPORTED_MODULE_6__["default"])({
        container: '.offer__slider',
        slide: '.offer__slide',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        totalCounter: '#total',
        correntCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner',
    });
    // Запускаем таймер с селектором и дедлайном
    (0,_modules_timer__WEBPACK_IMPORTED_MODULE_2__["default"])('.timer', '2023-04-11');
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map