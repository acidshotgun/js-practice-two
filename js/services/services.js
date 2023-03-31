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

export {postData, getResource};


