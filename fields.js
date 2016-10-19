module.exports = {
    "header": {
        "name": "header",
        "sort": "1",
        "type": "html",
        "label": "Заголовок",
        "show": false,
        "value1": "Легко!",
        "value2": "Бесплатный дизайн-проект в&nbsp;три&nbsp;клика"
    },
    "surname": {
        "name": "surname",
        "sort": "2",
        "type": "text",
        "label": "Фамилия",
        "placeholder": "Ваша фамилия",
        "show": false,
        "required": false
    },
    "firstName": {
        "name": "firstName",
        "sort": "3",
        "type": "text",
        "label": "Имя",
        "placeholder": "Ваше имя",
        "show": true,
        "required": false,
        "combineFrom": "surname",
        "combine": false
    },
    "email": {
        "name": "email",
        "sort": "4",
        "type": "email",
        "label": "E-mail",
        "placeholder": "Ваш e-mail",
        "show": true,
        "required": false
    },
    "phone":{
        "name":"phone",
        "sort":5,
        "type":"tel",
        "label":"Телефон",
        "placeholder":"Ваш номер телефона",
        "show":true,
        "required":false,
        "showFlag":true,
        "pattern":"RU",
        "available":"[\"RU\"]"
    },
    "adphone": {
        "name": "adphone",
        "sort": "6",
        "type": "text",
        "label": "Дополнительные телефоны",
        "placeholder": "Дополнительные телефоны",
        "show": false,
        "required": false
    },
    "city": {
        "name": "city",
        "sort": "7",
        "type": "text",
        "label": "Город",
        "placeholder": "Выберите город",
        "show": true,
        "required": false
    },
    "address": {
        "name": "address",
        "sort": "8",
        "type": "text",
        "label": "Адрес",
        "placeholder": "Введите адрес",
        "show": false,
        "required": false
    },
    "shop": {
        "name": "shop",
        "sort": "9",
        "type": "text",
        "label": "Студия",
        "placeholder": "Выберите студию",
        "show": false,
        "dependence": "city",
        "mapShow": false,
        "required": false,
        "wrap": false
    },
    "pref": {
        "name": "pref",
        "sort": "10",
        "type": "text",
        "label": "Предпочтительный способ связи",
        "placeholder": "Предпочтительный способ связи",
        "show": false,
        "required": false
    },
    "product": {
        "name": "product",
        "sort": "11",
        "type": "text",
        "label": "Товар",
        "placeholder": "Товар",
        "show": false,
        "required": true
    },
    "price": {
        "sort": "12",
        "name": "price",
        "type": "number",
        "label": "Стоимость",
        "placeholder": "Стоимость",
        "show": false,
        "required": true
    },
    "pay": {
        "name": "pay",
        "sort": "13",
        "type": "text",
        "label": "Первый взнос",
        "placeholder": "Первый взнос",
        "show": false,
        "required": true
    },
    "term": {
        "name": "term",
        "sort": "14",
        "type": "number",
        "label": "Желаемый срок кредита (мес.)",
        "placeholder": "Желаемый срок кредита (мес.)",
        "show": false,
        "required": true
    },
    "kitchen": {
        "name": "kitchen",
        "sort": "15",
        "type": "text",
        "label": "Модель кухни",
        "placeholder": "Выберите модель кухни",
        "show": false,
        "required": false
    },
    "personalData": {
        "name": "personalData",
        "sort": "17",
        "type": "checkbox",
        "label": "Согласен с обработкой персональных данных",
        "show": true,
        "required": true,
        "checked": true,
        "target": "_blank",
        "href": {
            "show": false,
            "text": "Политикой конфиденциальности",
            "pathname": "#"
        }
    },
    "wishes": {
        "name": "wishes",
        "sort": "16",
        "type": "textarea",
        "label": "Пожелания",
        "placeholder": "Пожелания",
        "show": true,
        "required": false,
        "wrap": false
    },
    "submit": {
        "name": "submit",
        "sort": "999",
        "type": "submit",
        "label": "Кнопка отправки",
        "show": true,
        "required": false,
        "text": "Отправить заявку"
    }
};