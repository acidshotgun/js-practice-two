// Импорты модулей
// Всегда помещаются в самом верху
import tabs from './modules/tabs';
import modal from './modules/modal';
import timer from './modules/timer';
import cards from './modules/cards';
import calc from './modules/calc';
import forms from './modules/forms';
import slider from './modules/slider';
// Импортируем ф-ю openModal() сюда чтобы ее принимал modalTimerId
import { openModal } from './modules/modal';

// Слушатель загрузки
window.addEventListener('DOMContentLoaded', () => {
    // Таймер создается тут тк он используется и в modal и в form
    // Он активирует показ модального окна через 50 секунд а modalTimerId в аргументе его сбросит (modal.js)
    // Сбросит потому что в ф-и openModal() прописано что при ее срабатывании таймер сбрасывается при клике или через 50 сек
    // Создание таймера который сработает через время и выполнит ф-ю openModal() с опр аргументами
    // Чтобы она не вызывалась сама по себе при загрузке поместим так же в колбэк котоырй сработает через время
    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 50000);

    // Вызываем все ф-и модулей чтобы они запустились и работали на странице

    // Передаем в tabs() аргументы с которыми она будет работать для создания табов
    //          можно продублировать с другими аргументами и создастся новый блок с табами если нужен
    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    // Глобальная ф-я modal() принимает в себя 1) Кнопка показа 2) Само окно 3) Таймер
    modal('[data-modal]', '.modal', modalTimerId);
    cards();
    // Калькулятор нах надо там куча всего и зачем его на сайте переиспользовать Когда он должен быть один да?
    calc();
    // В форме будет использоваться таймер передаем его тут и в самом файле form чтобы он работал
    // Закидываем селектор аргументом чтобы ф-я работала с ним (можно потом еще подставлять)
    forms('form', modalTimerId);
    // В слайдере будем передавать объект это деструктуризация будет а передаем объект с настройками
    // В слайдере деструктуризация поэтому сюда в любом порядрке можно передавать аргументы с которыми будет работаь слайдер
    slider({
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
    timer('.timer', '2023-04-11');
});