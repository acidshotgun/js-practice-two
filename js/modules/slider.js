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
          total = document.querySelector(totalCounter),
          current = document.querySelector(correntCounter),
          // Обертка карусели
          slidesWrapper = document.querySelector(wrapper),
          // Это сама карусель
          slidesField = document.querySelector(field),
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

export default slider;