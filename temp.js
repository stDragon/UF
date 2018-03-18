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
            "mr3id": "1",
            "name": "Acatcia",
            "description": "",
            "type": "classic",
            "material": "massif",
            "preview": "http://www.marya.ru/upload/Acatcia2-h-01_prev.jpg"
        },
        {
            "mr3id": "2",
            "name": "Axis",
            "description": "",
            "type": "classic",
            "material": "",
            "preview": "http://www.marya.ru/upload/resize_cache/iblock/dfe/1200_400_1/dfe90c7ac6ceceb17197912c92f79572.jpg"
        },
        {
            "mr3id": "3",
            "name": "Borgo",
            "description": "",
            "type": "classic",
            "material": "",
            "preview": ""
        },
        {
            "mr3id": "4",
            "name": "Country",
            "description": "",
            "type": "classic",
            "material": "",
            "preview": ""
        },
        {
            "mr3id": "5",
            "name": "Daniela",
            "description": "",
            "type": "classic",
            "material": "",
            "preview": ""
        },
        {
            "mr3id": "6",
            "name": "Fab",
            "description": "",
            "type": "modern",
            "material": "",
            "preview": ""
        },
        {
            "mr3id": "7",
            "name": "Farm",
            "description": "",
            "type": "classic",
            "material": "massif",
            "preview": "http://www.marya.ru/upload/farm-blu-h-02_prev_1.jpg"
        },
        {
            "mr3id": "8",
            "name": "Federica",
            "description": "",
            "type": "classic",
            "material": "MDF,membrana",
            "preview": "http://www.marya.ru/upload/Federica-01_06_A3.jpg"
        },
        {
            "mr3id": "9",
            "name": "Gloria",
            "description": "",
            "type": "classic",
            "material": "massif",
            "preview": "http://www.marya.ru/upload/Gloria1-h-01_prev.jpg"
        },
        {
            "mr3id": "10",
            "name": "Ice",
            "description": "",
            "type": "classic",
            "material": "",
            "preview": ""
        },
        {
            "mr3id": "11",
            "name": "Jazz",
            "description": "",
            "type": "modern",
            "material": "",
            "preview": ""
        },
        {
            "mr3id": "12",
            "name": "JazzPlus",
            "description": "",
            "type": "modern",
            "material": "MDF,enamel",
            "preview": "http://www.marya.ru/upload/JazzPlus-02_prev.jpg"
        },
        {
            "mr3id": "13",
            "name": "Life",
            "description": "",
            "type": "classic",
            "material": "",
            "preview": ""
        },
        {
            "mr3id": "14",
            "name": "Mambo",
            "description": "",
            "type": "modern",
            "material": "",
            "preview": ""
        },
        {
            "mr3id": "15",
            "name": "Mix/MixGlow/MixPrint",
            "description": "",
            "type": "modern",
            "material": "",
            "preview": ""
        },
        {
            "mr3id": "16",
            "name": "Nicolle",
            "description": "",
            "type": "classic",
            "material": "",
            "preview": ""
        },
        {
            "mr3id": "17",
            "name": "Patrizia",
            "description": "",
            "type": "modern",
            "material": "",
            "preview": ""
        },
        {
            "mr3id": "18",
            "name": "Patrizia",
            "description": "",
            "type": "modern",
            "material": "",
            "preview": ""
        },
        {
            "mr3id": "19",
            "name": "Prestige",
            "description": "",
            "type": "modern",
            "material": "",
            "preview": ""
        },
        {
            "mr3id": "20",
            "name": "Primula",
            "description": "",
            "type": "modern",
            "material": "",
            "preview": ""
        }
    ],
    phoneCodes: [
        {
            isoCode: 'RU',
            name: 'Россия',
            code: '7-',
            mask: '999-999-99-99',
            img: '/public/img/flags/ru.gif'
        },
        {
            isoCode: 'BY',
            name: 'Белоруссия',
            code: '37-5',
            mask: '99-999-99-99',
            img: '/public/img/flags/by.gif'
        },
        {
            isoCode: 'UA',
            name: 'Украина',
            code: '38-0',
            mask: '99-999-99-99',
            img: '/public/img/flags/ua.gif'
        },
        {
            isoCode: 'KZ',
            name: 'Казахстан',
            code: '7-7',
            mask: '99-999-99-99',
            img: '/public/img/flags/kz.gif'
        },
        {
            isoCode: 'KG',
            name: 'Киргизия',
            code: '99-6',
            mask: '99-999-99-99',
            img: '/public/img/flags/kg.gif'
        }
    ],
    // Желаемая стоимость
    prices : [
        {
            name: 'менее 100 тыс. руб.'
        },
        {
            name: '100 – 200 тыс. руб.'
        },
        {
            name: '200 – 400 тыс. руб.'
        },
        {
            name: '400 – 600 тыс. руб.'
        },
        {
            name: 'более 600 тыс. руб.'
        }
    ],
    // Цвет кухни
    colors : [
        {
            name: 'Венге'
        },
        {
            name: 'Дуб седой'
        },
        {
            name: 'Выбеленный дуб'
        },
        {
            name: 'Темный дуб'
        },
        {
            name: 'Дуб пепельный'
        },
        {
            name: 'Белый'
        },
        {
            name: 'Бежевый'
        },
        {
            name: 'Коричневый'
        },
        {
            name: 'Желтый'
        },
        {
            name: 'Баклажан'
        },
        {
            name: 'Белая луна'
        },
        {
            name: 'Графит'
        },
        {
            name: 'Серый'
        },
        {
            name: 'Кофе мокко'
        }
    ],
    // Помещение
    room : [
        {
            name : 'кухня'
        },
        {
            name : 'кухня-гостиная'
        }
    ],
    // Тип работ
    type :[
        {
            name : 'новый проект'
        },
        {
            name : 'реконструкция'
        }
    ],
    // Дизайн помещения
    design :[
        {
            name : 'современный и динамичный'
        },
        {
            name : 'оригинальный'
        },
        {
            name : 'классический'
        },
        {
            name : 'простой и светлый'
        },
        {
            name : 'теплый и уютный'
        },
        {
            name : 'яркий'
        },
        {
            name : 'спокойный'
        },
        {
            name : 'другое'
        }
    ],
    // Стены
    walls :[
        {
            name : 'гипсокартон'
        },
        {
            name : 'обои'
        },
        {
            name : 'панель'
        },
        {
            name : 'штукатурка'
        },
        {
            name : 'краска'
        },
        {
            name : 'кирпич/камень'
        }
    ],
    // Тип покрытия пола
    // Расположение кухонного гарнитура
    // Отдельная рабочая поверхность
    // Стиль кухни
    // Материал фасадов верхних секций
    // Материал фасадов нижних секций
    // Наличие столовой группы
    // Материал столешницы
    // Тип мойки
    // Холодильник
    // Морозильник
    // Посудомоечная машина
    // Стиральная
    // Техника для приготовления
    // Кухонная плита
    // Стиль вытяжки
    // Тип вытяжки
    hood_type :[
        {
            name : 'встраиваемая'
        },
        {
            name : 'настенная'
        },
        {
            name : 'островная'
        },
        {
            name : 'угловая'
        },
        {
            name : 'подвесная'
        }
    ],
    // Освещение
    light : [
        {
            name: 'Светильники под секциями'
        },
        {
            name: 'Светильники над секциями'
        },
        {
            name : 'Светильники внутри секции'
        },
        {
            name : 'Светильники внутри выдвижных ящиков'
        },
        {
            name : 'Световые полки'
        }
    ],
    // Дополнительный механизмы
    gear : [
        {
            name: 'для нижних секций'
        },
        {
            name: 'для верхних секций'
        },
        {
            name : 'для угловых секций'
        },
        {
            name : 'системы организации пространства'
        },
        {
            name : 'встраиваемые розетки'
        },
        {
            name : 'для колонн'
        },
        {
            name : 'механизмы под мойку'
        },
        {
            name : 'сушка'
        },
        {
            name : 'системы организации мусорных отходов'
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
            "dataUrl":"//localhost/um/umdata",
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
        testNew: {
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
            "steps": [
                {
                    id:0,
                    "step": 0,
                    "model": "client",
                    "type":"calculation",
                    "class": "",
                    "fields":[
                        {
                            "hidden": false,
                            "name":"header",
                            "sort":1,
                            "type":"html",
                            "label":"Заголовок",
                            "show":false,
                            "value1":"Легко!",
                            "value2":"Бесплатный дизайн-проект в&nbsp;три&nbsp;клика"
                        },
                        {
                            "hidden": false,
                            "name":"surname",
                            "sort":2,
                            "type":"text",
                            "label":"Фамилия",
                            "placeholder":"Ваша фамилия",
                            "show":false,
                            "required":false
                        },
                        {
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
                        {
                            "hidden": false,
                            "name":"email",
                            "sort":4,
                            "type":"email",
                            "label":"E-mail",
                            "placeholder":"Ваш e-mail",
                            "show":true,
                            "required":false
                        },
                        {
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
                        {
                            "hidden": false,
                            "name":"adphone",
                            "sort":6,
                            "type":"text",
                            "label":"Дополнительные телефоны",
                            "placeholder":"Дополнительные телефоны",
                            "show":false,
                            "required":false
                        },
                        {
                            "hidden": false,
                            "name":"city",
                            "sort":7,
                            "type":"text",
                            "collection": true,
                            "url": 'cities',
                            "label":"Город",
                            "placeholder":"Выберите город",
                            "show":true,
                            "required":false
                        },
                        {
                            "hidden": false,
                            "name":"address",
                            "sort":8,
                            "type":"text",
                            "label":"Адрес",
                            "placeholder":"Введите адрес",
                            "show":false,
                            "required":false
                        },
                        {
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
                        {
                            "hidden": false,
                            "name":"pref",
                            "sort":10,
                            "type":"text",
                            "label":"Предпочтительный способ связи",
                            "placeholder":"Предпочтительный способ связи",
                            "show":false,
                            "required":false
                        },
                        {
                            "hidden": false,
                            "name":"product",
                            "sort":11,
                            "type":"text",
                            "label":"Товар",
                            "placeholder":"Товар",
                            "show":false,
                            "required":true
                        },
                        {
                            "hidden": false,
                            "sort":12,
                            "name":"price",
                            "type":"number",
                            "label":"Стоимость",
                            "placeholder":"Стоимость",
                            "show":false,
                            "required":true
                        },
                        {
                            "hidden": false,
                            "name":"pay",
                            "sort":13,
                            "type":"text",
                            "label":"Первый взнос",
                            "placeholder":"Первый взнос",
                            "show":false,
                            "required":true
                        },
                        {
                            "hidden": false,
                            "name":"term",
                            "sort":14,
                            "type":"number",
                            "label":"Желаемый срок кредита (мес.)",
                            "placeholder":"Желаемый срок кредита (мес.)",
                            "show":false,
                            "required":true
                        },
                        {
                            "hidden": false,
                            "name":"kitchen",
                            "sort":15,
                            "type":"text",
                            "label":"Модель кухни",
                            "placeholder":"Выберите модель кухни",
                            "show":false,
                            "required":false
                        },
                        {
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
                        {
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
                        {
                            "hidden": false,
                            "name":"submit",
                            "sort":999,
                            "type":"submit",
                            "label":"Кнопка отправки",
                            "show":true,
                            "text":"Отправить заявку"
                        }
                    ]
                },
                {
                    id:1,
                    "step": 1,
                    "model": "phone",
                    "type": "code",
                    "fields": [
                        {
                            "hidden": false,
                            "name":"code",
                            "sort":1,
                            "type":"text",
                            "label":"Код подтверждения",
                            "placeholder":"Код подтверждения",
                            "show":true,
                            "required":true
                        },
                        {
                            "hidden": false,
                            "name":"submit",
                            "sort":999,
                            "type":"submit",
                            "label":"Кнопка подтверждения телефона",
                            "show":true,
                            "text":"Подтвердить"
                        }
                    ]
                }
            ]
        }
    }
};

exports.tmpDb = db;