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