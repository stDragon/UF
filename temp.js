/**
 * @todo временные массивы, удалить после появления БД
 * */
var db ={
    cities: [
    {
        name: 'Саратов',
        mr3id: '1',
        showShop: true
    },
    {
        name: 'Москва',
        mr3id: '2',
        showShop: true
    },
    {
        name: 'Питер',
        mr3id: '3',
        showShop: true
    },
    {
        name: 'Самара',
        mr3id: '4'
    },
    {
        name: 'Новгород',
        mr3id: '5'
    },
    {
        name: 'Тула',
        mr3id: '6'
    },
    {
        name: 'Энгельс',
        mr3id: '7',
        showShop: true
    },
    {
        name: 'Омск',
        mr3id: '8'
    },
    {
        name: 'Томск',
        mr3id: '9'
    },
    {
        name: 'Тверь',
        mr3id: '10'
    }
],
    shops: [
        {
            name: 'Кухонная студия "Мария"',
            mr3id: '11',
            mr3cityid: '7',
            brand: 'Мария',
            dealer: '',
            status: 'Продает',
            city: 'Энгельс',
            address: 'ул. Степная, д.11',
            administrator: 'Петр I',
            priceZone: '',
            lon: '51.481297',
            lat: '46.12762'
        },
        {
            name: 'Кухонная студия "Мария"',
            mr3id: '12',
            mr3cityid: '1',
            brand: 'Мария',
            dealer: '',
            status: 'Закрыт',
            city: 'Саратов',
            address: 'Вольский тракт, д. 2',
            administrator: 'Вася Николаев',
            priceZone: '',
            lon: '51.621449',
            lat: '45.972443'
        },
        {
            name: 'Кухонная студия "Мария"',
            mr3id: '13',
            mr3cityid: '1',
            brand: 'Мария',
            dealer: '',
            status: 'Продает',
            city: 'Саратов',
            address: 'ул. Московская, д. 129/133',
            administrator: 'Олик Солдатов',
            priceZone: '',
            lon: '51.537118',
            lat: '46.019346'
        },
        {
            name: 'Кухонная студия "Мария"',
            mr3id: '14',
            mr3cityid: '3',
            brand: 'Мария',
            dealer: '',
            status: 'Продает',
            city: 'Питер',
            address: 'ул. Саратовская, д. 129/133',
            administrator: 'Кролик Киевский',
            priceZone: ''
        }
    ],
    kitchens: [
        {
            mr3id: '1',
            name: 'Federica',
            description: '',
            type: 'classic',
            material: 'MDF, membrana',
            preview: 'http://www.marya.ru/upload/Federica-01_06_A3.jpg'
        },
        {
            mr3id: '2',
            name: 'Rosa',
            description: '',
            type: 'classic',
            material: 'massif',
            preview: 'http://www.marya.ru/upload/rosa-white-h-01_.jpg'
        },
        {
            mr3id: '3',
            name: 'Farm',
            description: '',
            type: 'classic',
            material: 'massif',
            preview: 'http://www.marya.ru/upload/farm-blu-h-02_prev_1.jpg'
        },
        {
            mr3id: '4',
            name: 'Acatcia',
            description: '',
            type: 'classic',
            material: 'massif',
            preview: 'http://www.marya.ru/upload/Acatcia2-h-01_prev.jpg'
        },
        {
            mr3id: '5',
            name: 'Gloria',
            description: '',
            type: 'classic',
            material: 'massif',
            preview: 'http://www.marya.ru/upload/Gloria1-h-01_prev.jpg'
        },
        {
            mr3id: '6',
            name: 'Jazz Plus',
            description: '',
            type: 'modern',
            material: 'MDF, enamel',
            preview: 'http://www.marya.ru/upload/JazzPlus-02_prev.jpg'
        }
    ],
    phoneCodes: [
        {
            isoCode: 'RU',
            name: 'Россия',
            code: '7',
            mask: '999-999-99-99',
            img: '/public/img/flags/ru.gif'
        },
        {
            isoCode: 'BY',
            name: 'Белоруссия',
            code: '375',
            mask: '999-99-99-99',
            img: '/public/img/flags/by.gif'
        },
        {
            isoCode: 'UA',
            name: 'Украина',
            code: '380',
            mask: '999-99-99-99',
            img: '/public/img/flags/ua.gif'
        },
        {
            isoCode: 'KZ',
            name: 'Казахстан',
            code: '77',
            mask: '99-999-99-99',
            img: '/public/img/flags/kz.gif'
        },
        {
            isoCode: 'KG',
            name: 'Киргизия',
            code: '996',
            mask: '999-999-999',
            img: '/public/img/flags/kg.gif'
        }
    ],
    logs: [],
    users: [],
    configs: {
        /** Тестовый конфиг v1.0 */
        test: {
            "id":"test",
            "style":"um-material",
            "initType":"form",
            "initPosition":"fixed",
            "phoneVerification":false,
            "serverUrl":"//localhost/um/umdata",
            "siteUrl":"bx.local",
            "formType":"calculation",
            "formConfig":{
                "header":{
                    "name":"header",
                        "sort":1,
                        "type":"html",
                        "label":"Заголовок",
                        "show":false,
                        "value1":"Легко!",
                        "value2":"Бесплатный дизайн-проект в&nbsp;три&nbsp;клика"
                },
                "surname":{
                    "name":"surname",
                        "sort":2,
                        "type":"text",
                        "label":"Фамилия",
                        "placeholder":"Ваша фамилия",
                        "show":false,
                        "required":false
                },
                "firstName":{
                    "name":"firstName",
                        "sort":3,
                        "type":"text",
                        "label":"Имя",
                        "placeholder":"Ваше имя",
                        "show":true,
                        "required":false,
                        "combineFrom":"surname",
                        "combine":false
                },
                "email":{
                    "name":"email",
                        "sort":4,
                        "type":"email",
                        "label":"E-mail",
                        "placeholder":"Ваш e-mail",
                        "show":true,
                        "required":false
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
                "adphone":{
                    "name":"adphone",
                        "sort":6,
                        "type":"text",
                        "label":"Дополнительные телефоны",
                        "placeholder":"Дополнительные телефоны",
                        "show":false,
                        "required":false
                },
                "city":{
                    "name":"city",
                        "sort":7,
                        "type":"text",
                        "label":"Город",
                        "placeholder":"Выберите город",
                        "show":true,
                        "required":false
                },
                "address":{
                    "name":"address",
                        "sort":8,
                        "type":"text",
                        "label":"Адрес",
                        "placeholder":"Введите адрес",
                        "show":false,
                        "required":false
                },
                "shop":{
                    "name":"shop",
                        "sort":9,
                        "type":"text",
                        "label":"Студия",
                        "placeholder":"Выберите студию",
                        "show":false,
                        "dependence":"city",
                        "mapShow":false,
                        "required":false,
                        "wrap":false
                },
                "pref":{
                    "name":"pref",
                        "sort":10,
                        "type":"text",
                        "label":"Предпочтительный способ связи",
                        "placeholder":"Предпочтительный способ связи",
                        "show":false,
                        "required":false
                },
                "product":{
                    "name":"product",
                        "sort":11,
                        "type":"text",
                        "label":"Товар",
                        "placeholder":"Товар",
                        "show":false,
                        "required":true
                },
                "price":{
                    "sort":12,
                        "name":"price",
                        "type":"number",
                        "label":"Стоимость",
                        "placeholder":"Стоимость",
                        "show":false,
                        "required":true
                },
                "pay":{
                    "name":"pay",
                        "sort":13,
                        "type":"text",
                        "label":"Первый взнос",
                        "placeholder":"Первый взнос",
                        "show":false,
                        "required":true
                },
                "term":{
                    "name":"term",
                        "sort":14,
                        "type":"number",
                        "label":"Желаемый срок кредита (мес.)",
                        "placeholder":"Желаемый срок кредита (мес.)",
                        "show":false,
                        "required":true
                },
                "kitchen":{
                    "name":"kitchen",
                        "sort":15,
                        "type":"text",
                        "label":"Модель кухни",
                        "placeholder":"Выберите модель кухни",
                        "show":false,
                        "required":false
                },
                "personalData":{
                    "name":"personalData",
                        "sort":17,
                        "type":"checkbox",
                        "label":"Согласен с обработкой персональных данных",
                        "show":true,
                        "required":true,
                        "checked":true,
                        "target":"_blank",
                        "href":{
                        "show":false,
                            "text":"Политикой конфиденциальности",
                            "pathname":"#"
                    }
                },
                "wishes":{
                    "name":"wishes",
                        "sort":16,
                        "type":"textarea",
                        "label":"Пожелания",
                        "placeholder":"Пожелания",
                        "show":true,
                        "required":false,
                        "wrap":false
                },
                "submit":{
                    "name":"submit",
                        "sort":18,
                        "type":"submit",
                        "label":"Кнопка отправки",
                        "show":true,
                        "text":"Отправить заявку"
                }
            }
        },
        /** Тестовый конфиг v2.0 */
        "testNew": {
            "id": "testNew",
            "global": {
                "debug": "false",
                "type": "calculation",
                "server": {
                    "url": "//localhost/um/umdata", // //module.infcentre.ru/um/umdata || //umodule.marya.ru/um/umdata
                    "type": "prod" // dev || pre-prod || prod
                },
                "site": {
                    "url": "bx.local"
                }
            },
            "layout": {
                "style": "um-material",
                "class": "my-class",
                "init": {
                    "type": "form",
                    "position": "fixed"
                }
            },
            "steps": "",
            "forms": [
                {
                    id:0,
                    "step": 0,
                    "model": "client",
                    "type":"calculation",
                    "class": "",
                    "fields":{
                        "header":{
                            "hidden": false,
                            "name":"header",
                            "sort":1,
                            "type":"html",
                            "label":"Заголовок",
                            "show":false,
                            "value1":"Легко!",
                            "value2":"Бесплатный дизайн-проект в&nbsp;три&nbsp;клика"
                        },
                        "surname":{
                            "hidden": false,
                            "name":"surname",
                            "sort":2,
                            "type":"text",
                            "label":"Фамилия",
                            "placeholder":"Ваша фамилия",
                            "show":false,
                            "required":false
                        },
                        "firstName":{
                            "hidden": false,
                            "name":"firstName",
                            "sort":3,
                            "type":"text",
                            "label":"Имя",
                            "placeholder":"Ваше имя",
                            "show":true,
                            "required":false,
                            "combineFrom":"surname",
                            "combine":false
                        },
                        "email":{
                            "hidden": false,
                            "name":"email",
                            "sort":4,
                            "type":"email",
                            "label":"E-mail",
                            "placeholder":"Ваш e-mail",
                            "show":true,
                            "required":false
                        },
                        "phone":{
                            "hidden": false,
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
                        "adphone":{
                            "hidden": false,
                            "name":"adphone",
                            "sort":6,
                            "type":"text",
                            "label":"Дополнительные телефоны",
                            "placeholder":"Дополнительные телефоны",
                            "show":false,
                            "required":false
                        },
                        "city":{
                            "hidden": false,
                            "name":"city",
                            "sort":7,
                            "type":"text",
                            "label":"Город",
                            "placeholder":"Выберите город",
                            "show":true,
                            "required":false
                        },
                        "address":{
                            "hidden": false,
                            "name":"address",
                            "sort":8,
                            "type":"text",
                            "label":"Адрес",
                            "placeholder":"Введите адрес",
                            "show":false,
                            "required":false
                        },
                        "shop":{
                            "hidden": false,
                            "name":"shop",
                            "sort":9,
                            "type":"text",
                            "label":"Студия",
                            "placeholder":"Выберите студию",
                            "show":false,
                            "dependence":"city",
                            "mapShow":false,
                            "required":false,
                            "wrap":false
                        },
                        "pref":{
                            "hidden": false,
                            "name":"pref",
                            "sort":10,
                            "type":"text",
                            "label":"Предпочтительный способ связи",
                            "placeholder":"Предпочтительный способ связи",
                            "show":false,
                            "required":false
                        },
                        "product":{
                            "hidden": false,
                            "name":"product",
                            "sort":11,
                            "type":"text",
                            "label":"Товар",
                            "placeholder":"Товар",
                            "show":false,
                            "required":true
                        },
                        "price":{
                            "hidden": false,
                            "sort":12,
                            "name":"price",
                            "type":"number",
                            "label":"Стоимость",
                            "placeholder":"Стоимость",
                            "show":false,
                            "required":true
                        },
                        "pay":{
                            "hidden": false,
                            "name":"pay",
                            "sort":13,
                            "type":"text",
                            "label":"Первый взнос",
                            "placeholder":"Первый взнос",
                            "show":false,
                            "required":true
                        },
                        "term":{
                            "hidden": false,
                            "name":"term",
                            "sort":14,
                            "type":"number",
                            "label":"Желаемый срок кредита (мес.)",
                            "placeholder":"Желаемый срок кредита (мес.)",
                            "show":false,
                            "required":true
                        },
                        "kitchen":{
                            "hidden": false,
                            "name":"kitchen",
                            "sort":15,
                            "type":"text",
                            "label":"Модель кухни",
                            "placeholder":"Выберите модель кухни",
                            "show":false,
                            "required":false
                        },
                        "personalData":{
                            "hidden": false,
                            "name":"personalData",
                            "sort":17,
                            "type":"checkbox",
                            "label":"Согласен с обработкой персональных данных",
                            "show":true,
                            "required":true,
                            "checked":true,
                            "target":"_blank",
                            "href":{
                                "show":false,
                                "text":"Политикой конфиденциальности",
                                "pathname":"#"
                            }
                        },
                        "wishes":{
                            "hidden": false,
                            "name":"wishes",
                            "sort":16,
                            "type":"textarea",
                            "label":"Пожелания",
                            "placeholder":"Пожелания",
                            "show":true,
                            "required":false,
                            "wrap":false
                        },
                        "submit":{
                            "hidden": false,
                            "name":"submit",
                            "sort":999,
                            "type":"submit",
                            "label":"Кнопка отправки",
                            "show":true,
                            "text":"Отправить заявку"
                        }
                    }
                },
                {
                    id:1,
                    "step": 1,
                    "model": "phone",
                    "type": "code",
                    "fields": {
                        "surname":{
                            "hidden": false,
                            "name":"code",
                            "sort":1,
                            "type":"text",
                            "label":"Код подтверждения",
                            "placeholder":"Код подтверждения",
                            "show":true,
                            "required":true
                        },
                        "submit":{
                            "hidden": false,
                            "name":"submit",
                            "sort":999,
                            "type":"submit",
                            "label":"Кнопка подтверждения телефона",
                            "show":true,
                            "text":"Подтвердить"
                        }
                    }
                }
            ]
        }
    }
};

exports.tmpDb = db;