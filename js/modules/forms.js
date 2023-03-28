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