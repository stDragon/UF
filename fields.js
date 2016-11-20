module.exports = [
    {
        "name": "header",
        "sort": "1",
        "type": "html",
        "label": "Заголовок",
        "hidden": false,
        "value1": "Легко!",
        "value2": "Бесплатный дизайн-проект в&nbsp;три&nbsp;клика"
    },
    {
        "name": "surname",
        "sort": "2",
        "type": "text",
        "label": "Фамилия",
        "placeholder": "Ваша фамилия",
        "hidden": false,
        "required": false
    },
    {
        "name": "firstName",
        "sort": "3",
        "type": "text",
        "label": "Имя",
        "placeholder": "Ваше имя",
        "hidden": false,
        "required": false,
        "combineFrom": "surname",
        "combine": false
    },
    {
        "name": "email",
        "sort": "4",
        "type": "email",
        "label": "E-mail",
        "placeholder": "Ваш e-mail",
        "hidden": false,
        "required": false
    },
    {
        "name":"phone",
        "sort":5,
        "type":"tel",
        "label":"Телефон",
        "placeholder":"Ваш номер телефона",
        "hidden":false,
        "required":false,
        "showFlag":true,
        "pattern":"RU",
        "available":"[\"RU\"]"
    },
    {
        "name": "adphone",
        "sort": "6",
        "type": "text",
        "label": "Дополнительные телефоны",
        "placeholder": "Дополнительные телефоны",
        "hidden": false,
        "required": false
    },
    {
        "name": "city",
        "sort": "7",
        "type": "text",
        "label": "Город",
        "placeholder": "Выберите город",
        "hidden": false,
        "required": false
    },
    {
        "name": "address",
        "sort": "8",
        "type": "text",
        "label": "Адрес",
        "placeholder": "Введите адрес",
        "hidden": false,
        "required": false
    },
    {
        "name": "shop",
        "sort": "9",
        "type": "text",
        "label": "Студия",
        "placeholder": "Выберите студию",
        "hidden": false,
        "dependence": "city",
        "mapShow": false,
        "required": false,
        "wrap": false
    },
    {
        "name": "pref",
        "sort": "10",
        "type": "text",
        "label": "Предпочтительный способ связи",
        "placeholder": "Предпочтительный способ связи",
        "hidden": false,
        "required": false
    },
    {
        "name": "product",
        "sort": "11",
        "type": "text",
        "label": "Товар",
        "placeholder": "Товар",
        "hidden": false,
        "required": true
    },
    {
        "sort": "12",
        "name": "price",
        "type": "number",
        "label": "Стоимость",
        "placeholder": "Стоимость",
        "hidden": false,
        "required": true
    },
    {
        "name": "pay",
        "sort": "13",
        "type": "text",
        "label": "Первый взнос",
        "placeholder": "Первый взнос",
        "hidden": false,
        "required": true
    },
    {
        "name": "term",
        "sort": "14",
        "type": "number",
        "label": "Желаемый срок кредита (мес.)",
        "placeholder": "Желаемый срок кредита (мес.)",
        "hidden": false,
        "required": true
    },
    {
        "name": "kitchen",
        "sort": "15",
        "type": "text",
        "label": "Модель кухни",
        "placeholder": "Выберите модель кухни",
        "hidden": false,
        "required": false
    },
    {
        "name": "personalData",
        "sort": "17",
        "type": "checkbox",
        "label": "Согласен с обработкой персональных данных",
        "hidden": false,
        "required": true,
        "checked": true,
        "target": "_blank",
        "href": {
            "show": false,
            "text": "Политикой конфиденциальности",
            "pathname": "#"
        }
    },
    {
        "name": "wishes",
        "sort": "16",
        "type": "textarea",
        "label": "Пожелания",
        "placeholder": "Пожелания",
        "hidden": false,
        "required": false,
        "wrap": false
    },
    {
        "name": "buttonPrev",
        "sort": "997",
        "type": "button",
        "label": "Кнопка к предидущему шагу",
        "hidden": false,
        "required": false,
        "text": "Назад"
    },
    {
        "name": "buttonNext",
        "sort": "998",
        "type": "button",
        "label": "Кнопка к следующему шагу",
        "hidden": false,
        "required": false,
        "text": "Далее"
    },
    {
        "name": "submit",
        "sort": "999",
        "type": "submit",
        "label": "Кнопка отправки",
        "hidden": false,
        "required": false,
        "text": "Отправить заявку"
    }
];