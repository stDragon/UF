/**
 * Содержит массивы для выпадающих списков
 * @todo Необходимо перенести в БД, некоторые данные необходимо получать из внешних систем
 */

module.exports = {
    prices: [
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
    colors: [
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
    rooms: [
        {
            name : 'кухня'
        },
        {
            name : 'кухня-гостиная'
        }
    ],
    gears: [
        {
            id: 1,
            name: 'для нижних секций'
        },
        {
            id: 2,
            name: 'для верхних секций'
        },
        {
            id: 3,
            name : 'для угловых секций'
        },
        {
            id: 4,
            name : 'системы организации пространства'
        },
        {
            id: 5,
            name : 'встраиваемые розетки'
        },
        {
            id: 6,
            name : 'для колонн'
        },
        {
            id: 7,
            name : 'механизмы под мойку'
        },
        {
            id: 8,
            name : 'сушка'
        },
        {
            id: 9,
            name : 'системы организации мусорных отходов'
        }
    ],
    worktypes: [
        {
            name : 'новый проект'
        },
        {
            name : 'реконструкция'
        }
    ],
    designs: [
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
    walls: [
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
    floorTypes: [
        {
            name : 'плиточное'
        },
        {
            name : 'ковровое'
        },
        {
            name : 'линолеум'
        }
    ],
    positions: [
        {
            name : 'в одну линию'
        },
        {
            name : 'Г-образная планировка'
        },
        {
            name : 'П-образная планировка'
        }
    ],
    addPlaces: [
        {
            name : 'не нужно'
        },
        {
            name : 'для приготовления выпечки'
        },
        {
            name : 'консервирования'
        }
    ],
    kitchenStyles: [
        {
            style: 'classic',
            name : 'Классика'
        },
        {
            style: 'modern',
            name : 'Современный стиль'
        },
        {
            style: 'neoclassic',
            name : 'Неоклассика'
        }
    ],
    sections: [
        {
            name : 'нет'
        },
        {
            name : 'ламинированная ДСП'
        },
        {
            name : 'массив'
        },
        {
            name : 'МДФ покрытая пластиком'
        },
        {
            name : 'алюминиевая рамка со вставкой: крашеное стекло'
        },
        {
            name : 'алюминиевая рамка со вставкой: пластик'
        },
        {
            name : 'МДФ покрытая эмалью'
        }
    ],
    diningGroups: [
        {
            name : 'уже есть столовая группа'
        },
        {
            name : 'хочу приобрести новую'
        }
    ],
    tabletopMaterials: [
        {
            name : 'пластиковая матовая'
        },
        {
            name : 'пластиковая глянцевая'
        },
        {
            name : 'искусственный камень'
        },
        {
            name : 'закаленное стекло'
        },
        {
            name : 'массив'
        },
        {
            name : 'кварцевый композит'
        },
        {
            name : 'нержавеющая сталь'
        }
    ],
    washingTypes: [
        {
            name : 'одночашечная'
        },
        {
            name : 'одночашечная с крылом'
        },
        {
            name : 'двучашечная'
        },
        {
            name : 'двучашечная с крылом'
        }
    ],
    stoveStyles: [
        {
            style: 'classic',
            name : 'классика'
        },
        {
            style: 'modern',
            name : 'модерн'
        }
    ],
    hoodStyles: [
        {
            style: 'classic',
            name : 'классика'
        },
        {
            style: 'modern',
            name : 'модерн'
        }
    ],
    hoodTypes: [
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
    lightings: [
        {
            id : 1,
            name : 'Светильники под секциями'
        },
        {
            id : 2,
            name : 'Светильники над секциями'
        },
        {
            id : 3,
            name : 'Светильники внутри секции'
        },
        {
            id : 4,
            name : 'Светильники внутри выдвижных ящиков'
        },
        {
            id : 5,
            name : 'Световые полки'
        }
    ]
};