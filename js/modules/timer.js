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