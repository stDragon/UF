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
    configs: []
};

exports.tmpDb = db;