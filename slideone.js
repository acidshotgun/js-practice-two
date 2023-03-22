// Первый слайд простой
// Второй и более сложный в проекте стоит
// Он будет в виде карсусели

const slides = document.querySelectorAll('.offer__slide'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current');
    // Зн-е первого слайда
    let slideIndex = 1;

    // Вызываем ф-ю чтобы показать первый слайд. Аргумент это номер слайда
    showSlides(slideIndex);

    // Показываем корректный номер (1) слайда учитывая ноль если число однозначное
    // total это общее число
    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
    } else {
        total.textContent = slides.length;
    }

    // Ф-я показа слайдов. Аргумент это slideIndex
    // Создадим условие что если переключаем последний слайд то сдайдер возвращается в начальное положение
    // И наоборот
    function showSlides(n) {
        if (n > slides.length) {
            slideIndex = 1;
        }

        if (n < 1) {
            slideIndex = slides.length;
        }

        // Очищаем все слайды и показываем начальный
        slides.forEach(item => item.style.display = 'none');

        // Изначально показываем первый слайд
        // И этот же блок будет показывать нужный слайд по индексу
        slides[slideIndex - 1].style.display = 'block';

        // Тут мы уже показываем номер слайда относительно самой картинки
        // Повторяя условие что если число меньше 10 то добавится ноль
        // Если нет то буз нуля
        // В переменную current записываем это число через textContent
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }

    // Это ф-я которая будет переключать слайды
    // В ее теле мы вызываем ф-ю показа где slideIndex + или - (n) 1
    // Так он будет переключаться 
    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    // Вешаем слушатели на стрелки
    // Они будут вызвать ф-ю переключения слайдеров передавая нужный аргумент
    // Аргумент это + или - 1
    prev.addEventListener('click', () => {
        plusSlides(-1);
    });

    next.addEventListener('click', () => {
        plusSlides(1);
    });



