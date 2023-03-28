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