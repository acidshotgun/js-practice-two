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


export default tabs;