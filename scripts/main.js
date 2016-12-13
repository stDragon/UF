var jQuery = require('jquery'),
    Clipboard = require('clipboard'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    conf = require('../nconf.js');
require('backbone.ribs');
window.jQuery = jQuery;
window.Backbone = Backbone;

module.exports = jQuery;
module.exports = Clipboard;
module.exports = _;
module.exports = Backbone;
module.exports = conf;


require('materialize-css');
window.Materialize = Materialize;
module.exports = Materialize;

$(document).ready(function() {
    window.validate_field = function(){}; //отмена встроенного валидатора Materialize

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {},
        Helpers: {},
        serverUrl: conf.server.url + '/um/umdata',
        conf: conf
    };
    module.exports = App;

    App.codes = [
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
            available: false,
            isoCode: 'UA',
            name: 'Украина',
            code: "380-",
            mask: '999-99-99-99',
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
            code: '996-',
            mask: '999-999-999',
            img: '/public/img/flags/kg.gif'
        }
    ];

    App.Models.PhoneCode = require('./models/phoneCode.js');
    App.Collections.PhoneCodes = require('./collections/phoneCodes.js');
    App.Views.SelectOption = require('./views/selectOption.js');
    App.Views.Select = require('./views/select.js');

    /**
     *  Ajax подгрузка шаблона
     *  */
    App.Helpers.TemplateManager = {
        templates: {},

        get: function (id, callback) {
            var template = this.templates[id];

            if (template) {
                callback(template);

            } else {

                var that = this;
                $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                    options.crossDomain = {
                        crossDomain: true
                    };
                    options.xhrFields = {
                        withCredentials: true
                    };
                });
                $.ajax({
                    url: conf.server.url + '/module/' + id,
                    success: function (template) {
                        var tmpl = template;
                        that.templates[id] = tmpl;
                        callback(tmpl);
                    }
                });

            }

        }

    };

    function init(option) {
        App.config = new App.Models.Config(option);
        if(option)
            App.config.fetch().then(function(){
                App.formCodeView = new App.Views.CodeGeneratorForm({model: App.config});
                $('#formCodeGenerator').html(App.formCodeView.el);
                App.example = new App.Views.Example({model: App.config});
            });
        else {
            App.formCodeView = new App.Views.CodeGeneratorForm({model: App.config});
            $('#formCodeGenerator').html(App.formCodeView.el);
            App.example = new App.Views.Example({model: App.config});
        }
    }

    App.Models.Config = Backbone.Ribs.Model.extend({
        defaults: {
            serverUrl: App.serverUrl,
            siteUrl: '',
            formType: 'calculation',
            formConfig: '',
            style: 'um-material',
            initType: 'button',
            initPosition: 'fixed',
            phoneVerification: false
        },

        urlRoot: function () {
            return App.serverUrl + '/conf/'
        },

        initialize: function () {
            if (!this.id)
                this.createFormFieldGenerator();
            else
                this.listenToOnce(this, 'sync', this.createFormFieldGenerator);

            this.on('change:phoneVerification', this.activePhoneField, this);

            if (App.conf.server.type != 'prod')
                this.on('change', this.log, this);
        },

        activePhoneField: function () {
            if(this.get('phoneVerification') && this.formField) {
                this.formField.set('phone.show', true);
                this.formField.set('phone.required', true);
            }
        },

        unactivePhoneField: function () {
            if(!this.get('formConfig.phone.required')) {
                this.set('phoneVerification', false);
            }
        },

        validate: function (attrs, options) {
            /** @todo проверить корректность регулярки*/
            var regURL = /^(https?:\/\/)?([\S\.]+)\.(\S{2,6}\.?)(\/[\S\.]*)*\/?$/;

            var errors = [];
            if (!attrs.siteUrl) {
                errors.push({
                    text: 'Вы не заполнили поле "Сайт, на котором будет использоваться модуль',
                    attr: 'siteUrl'
                });
            } else if (!regURL.test(attrs.siteUrl)) {
                errors.push({
                    text: "Сайт не корректен",
                    attr: 'siteUrl'
                });
            }

            if (errors.length) return errors;
        },

        log: function () {
            console.log(this.toJSON());
        },

        createFormFieldGenerator: function() {
            var options = {};
            if (this.get('phoneVerification'))
                options ={
                phoneVerification: true
            };
            this.formField = new App.Models.FormFieldGenerator(this.toJSON().formConfig, options);
            this.listenTo(this.formField, 'change', this.setFormConfig);
            this.listenTo(this.formField, 'change', this.unactivePhoneField);
            this.setFormConfig();
        },

        setFormConfig: function () {
            this.set('formConfig', this.formField.toJSON());
        },

        getButtonDOM: function() {
            return '<button type="button" data-um-id="' + this.id + '" class="um-btn um-btn-contrast ' + this.get('style') + '">Заказать кухню</button>'
        },

        getFormDOM: function() {
            return '<div data-um-id="' + this.id + '"></div>'
        },

        getScriptHref: function () {
            if (App.conf.server.type == 'dev')
                return '//' + location.hostname + '/public/js/marya-um.full.js';
            else
                return '//' + location.hostname + '/public/js/marya-um.js';
        },

        getScript: function () {
            return '<script type="text/javascript" src="' + this.getScriptHref() + '"><\/script>' +
                '<script>UM.init(' + JSON.stringify(this.toJSON()) + ');<\/script>';
        },

        getShortScript: function () {
            var data = {id: this.get('id')};
            return '<script type="text/javascript" src="' + this.getScriptHref() + '"><\/script>' +
                '<script>UM.init(' + JSON.stringify(data) + ');<\/script>';
        },

        getCode: function () {
            var code = this.getShortScript();

            if (this.get('initPosition') == 'fixed') {

                return  code;

            } else if (this.get('initPosition') == 'static') {

                if (this.get('initType') == 'button')
                    return this.getButtonDOM() + code;
                else if(this.get('initType') == 'form')
                    return this.getFormDOM() + code;

            } else {

                throw new Error("Не указано initPosition '" + this.get('initPosition') + "' проверьте конфигурацию");

            }
        }
    });

    App.Models.FormFieldGenerator = Backbone.Ribs.Model.extend({

        defaults: {
            header: {
                label: 'Заголовок',
                show: false,
                value1: 'Легко!',
                value2: 'Бесплатный дизайн-проект в&nbsp;три&nbsp;клика'
            },
            surname: {
                type: 'text',
                label: 'Фамилия',
                placeholder: 'Ваша фамилия',
                show: false,
                required: false
            },
            firstName: {
                type: 'text',
                label: 'Имя',
                placeholder: 'Ваше имя',
                show: true,
                required: false,
                combine: false
            },
            email: {
                type: 'email',
                label: 'E-mail',
                placeholder: 'Ваш e-mail',
                show: true,
                required: false
            },
            phone: {
                type: 'tel',
                label: 'Телефон',
                placeholder: 'Ваш номер телефона',
                show: true,
                required: false,
                showFlag: true,
                pattern: 'RU',
                available: '["RU"]'
            },
            adphone: {
                type: 'text',
                label: 'Дополнительные телефоны',
                placeholder: 'Дополнительные телефоны',
                show: false,
                required: false
            },
            city: {
                type: 'text',
                label: 'Город',
                placeholder: 'Выберите город',
                show: true,
                required: false
            },
            address: {
                type: 'text',
                label: 'Адрес',
                placeholder: 'Введите адрес',
                show: false,
                required: false
            },
            shop: {
                type: 'text',
                label: 'Студия',
                placeholder: 'Выберите студию',
                show: false,
                mapShow: false,
                required: false,
                wrap: false
            },
            pref: {
                type: 'text',
                label: 'Предпочтительный способ связи',
                placeholder: 'Предпочтительный способ связи',
                show: false,
                required: false
            },
            product: {
                type: 'text',
                label: 'Товар',
                placeholder: 'Товар',
                show: false,
                required: true
            },
            price: {
                type: 'text',
                label: 'Желаемая стоимость',
                placeholder: 'Желаемая стоимость',
                show: false,
                required: true
            },
            pay: {
                type: 'text',
                label: 'Первый взнос',
                placeholder: 'Первый взнос',
                show: false,
                required: true
            },
            term: {
                type: 'number',
                label: 'Желаемый срок кредита (мес.)',
                placeholder: 'Желаемый срок кредита (мес.)',
                show: false,
                required: true
            },
            kitchen: {
                type: 'text',
                label: 'Модель кухни',
                placeholder: 'Выберите модель кухни',
                show: false,
                required: false
            },
            personalData: {
                type: 'checkbox',
                label: 'Согласен с обработкой персональных данных',
                show: true,
                required: true,
                checked: true,
                target: '_blank',
                href: {
                    show: false,
                    text: 'Политикой конфиденциальности',
                    pathname: '#'
                }
            },
            wishes: {
                type: 'textarea',
                label: 'Пожелания',
                placeholder: 'Пожелания',
                show: true,
                required: false,
                wrap: false
            },
            // новые поля
            description: {
                type: 'textarea',
                label: 'Описание помещения',
                placeholder: 'Описание помещения',
                show: false,
                required: false
            },
            color: {
                type: 'text',
                label: 'Цвет',
                placeholder: 'Цвет',
                show: false,
                required: false
            },
            comment: {
                type: 'textarea',
                label: 'Комментарий к файлу',
                placeholder: 'Комментарий к файлу',
                show: false,
                required: false
            },
            file: {
                type: 'file',
                label: 'Приложить файлы',
                placeholder: 'Приложить файлы',
                show: false,
                required: false
            },
            room: {
                type: 'text',
                label: 'Помещение',
                placeholder: 'Помещение',
                show: false,
                required: false
            },
            worktype: {
                type: 'text',
                label: 'Тип работ',
                placeholder: 'Тип работ',
                show: false,
                required: true
            },
            design: {
                type: 'text',
                label: 'Дизайн помещения',
                placeholder: 'Дизайн помещения',
                show: false,
                required: true
            },
            walls: {
                type: 'text',
                label: 'Стены',
                placeholder: 'Стены',
                show: false,
                required: true
            },
            floorHeader: {
                label: 'Заголовок',
                show: false,
                value1: 'Полы'
            },
            floorColor: {
                type: 'text',
                label: 'Цвет пола',
                placeholder: 'Цвет пола',
                show: false,
                required: true
            },
            floorType: {
                type: 'text',
                label: 'Тип покрытия пола',
                placeholder: 'Тип покрытия пола',
                show: false,
                required: false
            },
            floorChange: {
                type: 'checkbox',
                label: 'Будет ли меняться пол во время ремонта?',
                placeholder: 'Будет ли меняться пол во время ремонта?',
                show: false,
                required: false,
                checked: false
            },
            ceilingHeader: {
                label: 'Заголовок',
                show: false,
                value1: 'Потолок'
            },
            ceilingHeight: {
                type: 'text',
                label: 'Высота потолка(м)',
                placeholder: 'Высота потолка(м)',
                show: false,
                required: true
            },
            ceilingChange: {
                type: 'text',
                label: 'Будет ли меняться высота потолка во время ремонта?',
                placeholder: 'Будет ли меняться высота потолка во время ремонта?',
                show: false,
                required: false,
                checked: false
            },
            styleHeader: {
                label: 'Заголовок',
                show: false,
                value1: 'Планирование кухни и решение стиля'
            },
            position: {
                type: 'text',
                label: 'Как вы планируете распололжить кухонный гарнитур?',
                placeholder: 'Как вы планируете расположить кухонный гарнитур?',
                show: false,
                required: true
            },
            addPlace: {
                type: 'text',
                label: 'Нужно ли вам отдельное место (дополнительная рабочая поверхность)?',
                placeholder: 'Нужно ли вам отдельное место (дополнительная рабочая поверхность)?',
                show: false,
                required: true
            },
            kitchenHeader: {
                label: 'Заголовок',
                show: false,
                value1: 'Материал изготовления и стиль фасадов'
            },
            kitchenStyle: {
                type: 'text',
                label: 'Стиль кухни',
                placeholder: 'Стиль кухни',
                show: false,
                required: true
            },
            upperSection: {
                type: 'text',
                label: 'Материал верхних секций',
                placeholder: 'Материал верхних секций',
                show: false,
                required: true
            },
            lowerSection: {
                type: 'text',
                label: 'Материал нижних секций',
                placeholder: 'Материал нижних секций',
                show: false,
                required: true
            },
            ColorHeader: {
                label: 'Заголовок',
                show: false,
                value1: 'Цвет'
            },
            upperSectionColor: {
                type: 'text',
                label: 'Цвет верхних секций',
                placeholder: 'Цвет верхних секций',
                show: false,
                required: false
            },
            lowerSectionColor: {
                type: 'text',
                label: 'Цвет нижних секций',
                placeholder: 'Цвет нижних секций',
                show: false,
                required: false
            },
            combineWishes: {
                type: 'text',
                label: 'Пожелания по возможным вариантам комбинации цветов (верх, низ)',
                placeholder: 'Пожелания по возможным вариантам комбинации цветов (верх, низ)',
                show: false,
                required: false
            },
            diningGroupHeader: {
                label: 'Заголовок',
                show: false,
                value1: 'Столовая группа'
            },
            diningGroup: {
                type: 'text',
                label: 'Наличие столовой группы',
                placeholder: 'Наличие столовой группы',
                show: false,
                required: false
            },
            diningGroupLength: {
                type: 'text',
                label: 'Длина столовой группы(м)',
                placeholder: 'Длина столовой группы (м)',
                show: false,
                required: false
            },
            diningGroupWidth: {
                type: 'text',
                label: 'Ширина столовой группы(м)',
                placeholder: 'Ширина столовой группы (м)',
                show: false,
                required: false
            },
            diningGroupHeight: {
                type: 'text',
                label: 'Высота столовой группы(м)',
                placeholder: 'Высота столовой группы (м)',
                show: false,
                required: false
            },
            chairs: {
                type: 'text',
                label: 'Количество стульев',
                placeholder: 'Количество стульев',
                show: false,
                required: false
            },
            diningGroupMaterial: {
                type: 'text',
                label: 'Материал столовой группы',
                placeholder: 'Материал столовой группы',
                show: false,
                required: false
            },
            diningGroupStyle: {
                type: 'text',
                label: 'Стиль столовой группы',
                placeholder: 'Стиль столовой группы',
                show: false,
                required: false
            },
            diningGroupColor: {
                type: 'text',
                label: 'Цвет столовой группы',
                placeholder: 'Цвет столовой группы',
                show: false,
                required: false
            },
            diningGroupExt: {
                type: 'text',
                label: 'Дополнительные элементы столовой группы',
                placeholder: 'Дополнительные элементы столовой группы',
                show: false,
                required: false
            },
            tabletopHeader: {
                label: 'Заголовок',
                show: false,
                value1: 'Столешница'
            },
            tabletopMaterial: {
                type: 'text',
                label: 'Материал столешницы',
                placeholder: 'Материал столешницы',
                show: false,
                required: true
            },
            tabletopExt: {
                type: 'text',
                label: 'Примечание(столешница)',
                placeholder: 'Примечаение(столешница)',
                show: false,
                required: false
            },
            washingHeader: {
                label: 'Заголовок',
                show: false,
                value1: 'Мойка'
            },
            washingType: {
                type: 'text',
                label: 'Тип мойки',
                placeholder: 'Тип мойки',
                show: false,
                required: false
            },
            washingExt: {
                type: 'text',
                label: 'Мойка. Другое(опишите)',
                placeholder: 'Мойка. Другое(опишите)',
                show: false,
                required: false
            },
            techHeader: {
                label: 'Заголовок',
                show: false,
                value1: 'Техника'
            },
            fridge: {
                type: 'text',
                label: 'Отдельностоящий холодильник(кол-во)',
                placeholder: 'Отдельностоящий холодильник(кол-во)',
                show: false,
                required: false
            },
            inFridge: {
                type: 'text',
                label: 'Встраиваемый холодильник(кол-во)',
                placeholder: 'Встраиваемый холодильник(кол-во)',
                show: false,
                required: false
            },
            fridgeExt: {
                type: 'text',
                label: 'Xолодильник(примечание)',
                placeholder: 'Xолодильник(примечание)',
                show: false,
                required: false
            },
            deepFreeze: {
                type: 'text',
                label: 'Отдельностоящий морозильник(кол-во)',
                placeholder: 'Отдельностоящий морозильник(кол-во)',
                show: false,
                required: false
            },
            inDeepFreeze: {
                type: 'text',
                label: 'Встраиваемый морозильник(кол-во)',
                placeholder: 'Встраиваемый морозильник(кол-во)',
                show: false,
                required: false
            },
            deepFreezeExt: {
                type: 'text',
                label: 'Морозильник(примечание)',
                placeholder: 'Морозильник(примечание)',
                show: false,
                required: false
            },
            dishwasher: {
                type: 'text',
                label: 'Отдельностоящая посудомоечная машина(кол-во)',
                placeholder: 'Отдельностоящая посудомоечная машина(кол-во)',
                show: false,
                required: false
            },
            inDishwasher: {
                type: 'text',
                label: 'Встраиваемая посудомоечная машина(кол-во)',
                placeholder: 'Встраиваемая посудомоечная машина(кол-во)',
                show: false,
                required: false
            },
            dishwasherExt: {
                type: 'text',
                label: 'Посудомоечная машина(примечание)',
                placeholder: 'Посудомоечная машина(примечание)',
                show: false,
                required: false
            },
            washer: {
                type: 'text',
                label: 'Отдельностоящая стиральная машина(кол-во)',
                placeholder: 'Отдельностоящая стиральная машина(кол-во)',
                show: false,
                required: false
            },
            inWasher: {
                type: 'text',
                label: 'Встраиваемая стиральная машина(кол-во)',
                placeholder: 'Встраиваемая стиральная машина(кол-во)',
                show: false,
                required: false
            },
            washerExt: {
                type: 'text',
                label: 'Стиральная машина(примечание)',
                placeholder: 'Стиральная машина(примечание)',
                show: false,
                required: false
            },
            stoveNumber: {
                type: 'text',
                label: 'Отдельностоящая кухонная плита(кол-во)',
                placeholder: 'Отдельностоящая кухонная плита(кол-во)',
                show: false,
                required: false
            },
            inMicrowaveNumber: {
                type: 'text',
                label: 'Встраиваемая микроволновая печь(кол-во)',
                placeholder: 'Встраиваемая микроволновая печь(кол-во)',
                show: false,
                required: false
            },
            freeMicrowaveNumber: {
                type: 'text',
                label: 'Отдельностоящая микроволновая печь(кол-во)',
                placeholder: 'Отдельностоящая микроволновая печь(кол-во)',
                show: false,
                required: false
            },
            oven: {
                type: 'text',
                label: 'Встраиваемый духовой шкаф(кол-во)',
                placeholder: 'Встраиваемый духовой шкаф(кол-во)',
                show: false,
                required: false
            },
            hob: {
                type: 'text',
                label: 'Встраиваемая варочная панель(кол-во)',
                placeholder: 'Встраиваемая варочная панель(кол-во)',
                show: false,
                required: false
            },
            stoveStyle: {
                type: 'text',
                label: 'Кухонная плита',
                placeholder: 'Кухонная плита',
                show: false,
                required: false
            },
            hoodHeader: {
                label: 'Заголовок',
                show: false,
                value1: 'Вытяжки'
            },
            hoodStyle: {
                type: 'text',
                label: 'Стиль вытяжки',
                placeholder: 'Стиль вытяжки',
                show: false,
                required: true
            },
            hoodType: {
                type: 'text',
                label: 'Тип вытяжки',
                placeholder: 'Тип вытяжки',
                show: false,
                required: true
            },
            hoodNumber: {
                type: 'text',
                label: 'Кол-во вытяжек',
                placeholder: 'Кол-во вытяжек',
                show: false,
                required: false
            },
            hoodExt: {
                type: 'text',
                label: 'Примечание к вытяжкам',
                placeholder: 'Примечание к вытяжкам',
                show: false,
                required: false
            },
            lighting: {
                type: 'text',
                label: 'Освещение',
                placeholder: 'Освещение',
                show: false,
                required: false
            },
            lightingExt: {
                type: 'text',
                label: 'Освещение. Другое(опишите)',
                placeholder: 'Освещение. Другое(опишите)',
                show: false,
                required: false
            },
            gear: {
                type: 'text',
                label: 'Дополнительные механизмы',
                placeholder: 'Дополнительные механизмы',
                show: false,
                required: false
            },
            gearExt: {
                type: 'text',
                label: 'Дополнительные механизмы. Другое(опишите)',
                placeholder: 'Дополнительные механизмы. Другое(опишите)',
                show: false,
                required: false
            },
            submit: {
                type: 'submit',
                label: 'Кнопка отправки',
                text: 'Отправить заявку'
            }
        },

        initialize: function(model, options) {

            if (options && options.phoneVerification) {
                this.set('phone.show', true);
                this.set('phone.required', true);
            }

            this.phoneCodesCollection = new App.Collections.PhoneCodes({model: App.Models.PhoneCode});

            var that = this;

            /** @todo надо перенести данные на сервер */
            this.phoneCodesCollection.set(App.codes);
            this.createPhoneCodes();
            /*this.phoneCodesCollection.fetch().then(function() {
                that.createPhoneCodes();
            });*/

            if (App.conf.server.type != 'prod')
                this.on('change', this.log, this);
        },

        createPhoneCodes: function () {
            this.phoneCodesAvailableCollection = new App.Collections.PhoneCodes(this.phoneCodesCollection.toJSON());
            this.phoneCodesNotAvailableCollection = new App.Collections.PhoneCodes(this.phoneCodesCollection.toJSON());
            this.setActivePhone();
        },

        setActivePhone: function () {
            if (this.get('phone.available')) {
                this.phoneCodesAvailableCollection.setActive($.parseJSON(this.get('phone.available')));
            }
            if (this.get('phone.notAvailable')) {
                this.phoneCodesNotAvailableCollection.setActive($.parseJSON(this.get('phone.notAvailable')));
            }
        },

        log: function () {
            console.log(this.toJSON());
        }
    });

    App.Views.CodeGeneratorForm = Backbone.View.extend({

        tagName: 'form',
        className: 'form-code-generator',
        template: 'formCodeGeneratorTpl',

        events: {
            "change input"        : "changed",
            "change select"       : "changed",
            "submit"              : "submit"
        },

        initialize: function () {
            this.render();

            if (this.model.get('formConfig')) {
                this.renderFormField();
            }

            this.listenTo(this.model, 'change', this.setValue);
            this.listenTo(this.model, 'sync', this.renderCode);
            this.listenTo(this.model, 'sync', this.showMassageSave);
            this.listenTo(this.model, 'invalid', this.invalid);
            this.listenTo(this.model, 'invalid', this.unrenderCode);
            this.listenTo(this.model, 'request', this.valid);
            _.bindAll(this, 'changed');

            var clipboard = new Clipboard('.js-copy-code');

            clipboard.on('success', function(e) {
                console.log(e);
                Materialize.toast('Код скопирован в буфер обмена', 2000);
            });
            clipboard.on('error', function(e) {
                console.log(e);
                console.error('Не удалось скопировать');
            });
        },

        render: function () {
            var that = this;
            App.Helpers.TemplateManager.get(this.template, function (template) {
                var data = _.extend(that.model.toJSON());
                var temp = _.template(template, data);
                var html = $(temp(data));
                that.$el.html(html);
                that.setValue();
                if(that.model.id) that.renderCode();
            });
            return this;
        },

        renderFormField: function() {
            App.formFieldGeneratorView = new App.Views.FormFieldGenerator({model: this.model.formField});
            $('#formFieldGenerator').html(App.formFieldGeneratorView.el);
        },

        setValue: function () {
            var attr = this.model.toJSON();
            _.each(attr, function (num, key) {
                var $el = this.$el.find('[name=' + key + ']');
                if ($el.is(':checkbox'))
                    $el.prop("checked", num);
                else
                    $el.val(num);
            }, this);
            this.$el.find('select').material_select();
        },

        renderCode: function () {
            this.$el.find('[name=code]')
                .val(this.model.getCode())
                .addClass('valid');
        },

        unrenderCode: function () {
            this.$el.find('[name=code]')
                .val('')
                .removeClass('valid');
        },

        changed: function(e) {
            var changed = e.currentTarget;

            var value;
            if (changed.type == 'checkbox') {
                value = changed.checked;
            } else if (changed.type == 'file') {
                value = changed[0].files[0];
            } else {
                value = changed.value;
            }

            if (value === 'false') value = false;
            if (value === 'true') value = true;

            var obj = {};
            obj[changed.name] = value;

            this.model.set(obj);
        },

        valid: function () {
            this.$el.find('input')
                .removeClass('invalid')
                .addClass('valid');
        },

        invalid: function (model, errors) {
            this.$el.find('input')
                .removeClass('invalid')
                .removeClass('valid');
            _.each(errors, function (error) {
                var $el = this.$el.find('[name=' + error.attr + ']');

                $el.removeClass('valid')
                    .addClass('invalid');
            }, this);
        },

        showMassageSave: function () {
            Materialize.toast('Изменения сохранены', 2000);
        },

        submit: function (e) {
            e.preventDefault();
            this.model.save();
        }
    });

    App.Views.FormFieldGenerator = Backbone.Ribs.View.extend({
        tagName: 'form',
        className: 'form-field-generator',
        template: 'formFieldGenerator',

        events: {
            "change input"        : "changed",
            "change select"       : "changed",
            "submit"              : "submit"
        },

        initialize: function () {
            this.render();

            this.listenTo(this.model, 'change', this.setValues);

            _.bindAll(this, 'changed');
        },

        render: function () {
            var that = this;
            App.Helpers.TemplateManager.get(this.template, function (template) {
                var temp = _.template(template);
                var data = that.model.toJSON();
                var html = $(temp(data));
                that.$el.html(html);
                that.selectPhoneCodesAvailable = new App.Views.Select({el: '[name="phone.available"]', collection: that.model.phoneCodesAvailableCollection}).render();
                that.selectPhoneCodesNotAvailable = new App.Views.Select({el: '[name="phone.notAvailable"]', collection: that.model.phoneCodesNotAvailableCollection}).render();
            });
            return this;
        },

        setValues: function () {
            /** @TODO Костыль из-за вложенного объекта, надо найти нормальное решение*/
            var attr = this.model.toJSON();
            _.each(attr, function (num, key) {
                if (typeof num == 'object') {
                    var parentKey = key;
                    _.each(num, function (num, key) {
                        var $el = this.$el.find('[name="' + parentKey + '.' + key + '"]');
                        this.setValue($el, num);
                    },this);
                } else {
                    var $el = this.$el.find('[name="' + key + '"]');
                    this.setValue($el, num);
                }

            }, this);
            this.$el.find('select').material_select();
        },

        setValue: function ($el, val) {
            if ($el.is(':checkbox'))
                $el.prop("checked", val);
            if ($el.children('option').length){

                $el.children('option').attr('selected', false);

                val = $.parseJSON(val);
                _.each(val, function(n){
                    $el.children('option[value="' + n + '"]')[0].selected = true;
                });
            }
            else
                $el.val(val);
        },

        changed: function(e) {
            var changed = e.currentTarget;

            var value;
            if (changed.type == 'checkbox') {
                value = changed.checked;
            } else if(changed.type == 'select-multiple'){
                value = [];
                _.each(changed, function(option){
                    if (option.selected)
                        value.push(option.value);
                });
            } else if (changed.type == 'file') {
                value = changed[0].files[0];
            } else {
                value = changed.value;
            }

            if (value === 'false') value = false;
            if (value === 'true') value = true;

            if (Array.isArray(value)) {
                value = JSON.stringify(value);
            }

            var obj = {};
            obj[changed.name] = value;

            this.model.set(obj);
        },

        submit: function (e) {
            e.preventDefault();
            App.config.save();
        }
    });

    App.Views.Example = Backbone.View.extend({
        el: '#example',

        initialize: function () {
            this.listenTo(this.model, 'invalid', this.unrender);
            this.listenTo(this.model, 'error', this.unrender);
            this.listenTo(this.model, 'sync', this.render);
        },

        render: function () {

            this.unrender();

            if (this.model.get('initPosition') == 'static') {

                if (this.model.get('initType') == 'button')
                    this.$el.html(this.model.getButtonDOM());

                else if (this.model.get('initType') == 'form')
                    this.$el.html(this.model.getFormDOM());

            } else this.$el.html('');

            UM.init({id: this.model.id});
        },

        unrender: function() {
            if(UM.configsCollection) {
                if(UM.pages[this.model.id])
                    if (Array.isArray(UM.pages[this.model.id]))
                        UM.pages[this.model.id][0].unrender();
                    else
                        UM.pages[this.model.id].unrender();

                if(UM.buttons[this.model.id] && UM.buttons[this.model.id].$el.hasClass('um-btn-start--fixed'))
                    UM.buttons[this.model.id].unrender();

                UM.configsCollection.reset();
            }
        }

    });

    var codeID = $('#formCodeGenerator').data('id');

    if(codeID){
        init({id: codeID});
    } else
        init();
});