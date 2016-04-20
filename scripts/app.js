var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone');

window._ = window._ || _;
window.Backbone = window.Backbone || Backbone;

var UM = window.UM || {
    Models: {},
    Collections: {},
    Views: {},
    Router: {},
    option: []
};

require('jquery.inputmask');
require('./Backbone.Ymaps.js');

/**
 *  Конфигурирует универсальный модуль
 *  */
UM.Models.Config = Backbone.Model.extend({
    defaults: {
        serverUrl: 'http://module.infcentre.ru',
        siteUrl: '',
        formType: 'calculation',
        style: '/css/um-material.css',
        initType: 'button',
        initPosition: 'fixed',
        showMap: false,
        showShop: false
    },

    urlRoot: function () {
        return this.get('serverUrl') + '/api/configs/'
    },

    initialize: function () {
        this.on('sync', this.checkConfig, this);
    },

    checkConfig: function () {
        if (!this.get('serverUrl'))
            throw new Error("Не указано имя сервера Мария serverUrl:'" + this.get('serverUrl') + "' проверьте конфигурацию");
        if (!this.get('siteUrl'))
            throw new Error("Не указано имя вашего сайта siteUrl:'" + this.get('siteUrl') + "' проверьте конфигурацию");
        if (!this.get('initType'))
            throw new Error("Не указан тип модуля initType:'" + this.get('initType') + "' проверьте конфигурацию");
        if (!this.get('initPosition'))
            throw new Error("Не указан способ инициализации initPosition:'" + this.get('initPosition') + "' проверьте конфигурацию");
        if (!this.get('style'))
            console.warn('Стили отключены');
        if (!this.get('showMap'))
            console.warn('Карта отключина');
    }
});
/**
 *  Подгружает необходимые стили и скрипты
 *  */
UM.Views.Config = Backbone.View.extend({
    initialize: function () {
        this.initHead();
        this.initBody();
    },

    getStyle: function () {
        var style = this.model.get('serverUrl') + this.model.get('style');
        return '<link rel="stylesheet" type="text/css" href="' + style + '">';
    },

    getYaMap: function () {
        return '<script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&mode=debug" type="text/javascript">';
    },

    initHead: function () {
        var $head = $('head'),
            head = '';

        if (this.model.get('style'))
            head += this.getStyle();

        if (this.model.get('showMap'))
            head += this.getYaMap();

        if (head)
            $head.append(head);
    },

    initBody: function () {
        var $body = $('body');

        UM.page = new UM.Views.Page({model: this.model});

        if (this.model.get('initType') == 'button') {

            if (this.model.get('initPosition') == 'fixed') {
                UM.button = new UM.Views.ButtonFixed();
                $body.append(UM.button.el);
            } else if (this.model.get('initPosition') == 'static')
                UM.button = new UM.Views.ButtonStatic();

            $body.append(UM.page.el);
            UM.page.hide();

        } else if (this.model.get('initType') == 'form') {

            if (this.model.get('initPosition')  == 'fixed') {
                $body.append(UM.page.el);
            }  else if (this.model.get('initPosition') == 'static')
                $('#um-form-init').append(UM.page.el);
        }
    }
});
/**
 *  Запуск модуля
 *  @param  {string} option - Опции для инициализации модуля.
 *  */
UM.init = function (option) {
    this.option.push(option);
    UM.config = new UM.Models.Config(option);
    UM.config.fetch().then(function(){
        UM.configView = new UM.Views.Config({model: UM.config});
    });
};

/**
 *  Helper создания событий
 *  */
UM.vent = _.extend({}, Backbone.Events);

/**
 *  Helper шаблон из статичного DOM элемента по его ID
 *  */
UM.template = function (id) {
    return _.template($('#' + id).html());
};

/**
 *  Ajax подгрузка шаблона
 *  */
UM.TemplateManager = {
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
                url: UM.config.get('serverUrl') + "/templates/" + id + ".html",
                success: function (template) {
                    var tmpl = template;
                    that.templates[id] = tmpl;
                    callback(tmpl);
                }
            });

        }

    }

};
/**
 *  Тултипы для вывода текста ошибок формы
 *  */
UM.Views.Tooltip = Backbone.View.extend({

    tagName: 'span',
    className: 'um-tooltip bottom',

    initialize: function (text) {
        this.render(text);
    },

    render: function (text) {
        this.$el.html(text);
        return this;
    }

});
/**
 *  Клиент оформивший заявку
 *  */
UM.Models.User = Backbone.Model.extend({
    defaults: {
        surname: '',
        firstName: '',
        email: '',
        phone: '',
        city: '',
        shop: '',
        wishes: ''
    },

    urlRoot: function () {
        return UM.config.get('serverUrl') + '/api/users/'
    },

    validate: function (attrs, options) {
        var emailFilter = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
            lettersFilter = /^[а-яА-ЯёЁa-zA-Z]{1,20}$/,
            phoneFilter = /((8|\+7)-?)?\(?\d{3}\)?-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}/;

        var errors = [];
        if (!attrs.firstName) {
            errors.push({
                text: "Вы не заполнили имя",
                attr: 'firstName'
            });
        } else if (!lettersFilter.test(attrs.firstName)) {
            errors.push({
                text: "Имя должно содержать только буквы",
                attr: 'firstName'
            });
        }
        if (!attrs.surname) {
            errors.push({
                text: "Вы не заполнили фамилию",
                attr: 'surname'
            });
        } else if (!lettersFilter.test(attrs.surname)) {
            errors.push({
                text: "Фамилия должна содержать только буквы",
                attr: 'surname'
            });
        }
        if (!attrs.email) {
            errors.push({
                text: "Вы не заполнили электронную почту",
                attr: 'email'
            });
        } else if (!emailFilter.test(attrs.email)) {
            errors.push({
                text: "Почтовый адресс не коректен",
                attr: 'email'
            });
        }
        if (!attrs.phone) {
            errors.push({
                text: "Вы не заполнили телефон",
                attr: 'phone'
            });
        } else if (!phoneFilter.test(attrs.phone)) {
            errors.push({
                text: "Телефон не коректен",
                attr: 'phone'
            });
        }
        if (!attrs.city) {
            errors.push({
                text: "Вы не выбрали город",
                attr: 'city'
            })
        }

        if (errors.length) return errors;
    },

    initialize: function () {
        this.on('change', this.log, this);
        UM.vent.on('user:setCity', this.setCity, this);
        UM.vent.on('user:setShop', this.setShop, this);
    },

    log: function () {
        console.log(this.toJSON());
    },

    setCity: function (name) {
        this.set({
            'city': name,
            'shop': ''
        });
    },

    setShop: function (name) {
        this.set('shop', name);
    }
});

UM.Models.City = Backbone.Model.extend({
    defaults: {
        name: '',
        mr3id: ''
    }
});

UM.Models.Shop = Backbone.Model.extend({
    defaults: {
        name: '',
        mr3id: '',
        brand: '',
        dealer: '',
        status: '',
        city: '',
        address: '',
        administrator: '',
        priceZone: ''
    },

    initialize: function () {
        this.set('title', this.get('name') + ', ' + this.get('address'));
    }
});
/**
 *  Подтверждения регестрации через телефон
 *  */
UM.Models.Phone = Backbone.Model.extend({
    defaults: {
        phone: '',
        confirm: false,
        code: ''
    },

    url: function () {
        return UM.config.get('serverUrl') + '/api/phone/'
    },

    validate: function (attrs, options) {
        var errors = [];
        if (!attrs.code) {
            errors.push({
                text: "Поле не может быть пустым",
                attr: 'code'
            });
        }

        if (errors.length) return errors;
    }
});
/**
 *  Модальное окно
 *  */
UM.Models.Modal = Backbone.Model.extend({
    defaults: {
        content: ''
    }
});
/**
 *  Коллекция городов
 *  @param {UM.Models.Config} options конфиг для получении коллекции.
 *  */
UM.Collections.Citys = Backbone.Collection.extend({
    model: UM.Models.City,

    initialize: function(models, options) {
        if(options)
            this.options = options;
    },

    url: function() {
        return UM.config.get('serverUrl') + '/api/cities/' + this.options.configId || ''
    },
    /**
     * Сортирует по названию города
     * */
    comparator: function (model) {
        return model.get('name');
    }
});
/**
 *  Коллекция студий
 *  @param {UM.Models.Config} options конфиг для получении коллекции.
 *  */
UM.Collections.Shops = Backbone.Collection.extend({
    model: UM.Models.Shop,

    initialize: function(models, options) {
        if(options)
            this.options = options;
    },

    url: function() {
        return UM.config.get('serverUrl') + '/api/shops/' + this.options.configId || ''
    },
    /**
     * Создает новый экземпляр Shops по названию города.
     * @param  {string} city - Диаметр окружности.
     * @return {UM.Collections.Shops} Новый объект Shops.
     */
    filterByCity: function (city) {
        var filtered = this.filter(function (model) {
            return model.get("city") === city;
        });
        return new UM.Collections.Shops(filtered);
    },
    /**
     * Создает новый экземпляр Shops по названию города содержащих координаты для карты.
     * @param  {string} city - Диаметр окружности.
     * @return {UM.Collections.Shops} Новый объект Shops.
     */
    filterByCityForMap: function (city) {
        var filtered = this.filter(function (model) {
            return model.get("city") === city && model.get("lat") && model.get("lat");
        });
        return new UM.Collections.Shops(filtered);
    }
});
/**
 *  Окно "заказ принят на обработку"
 *  */
UM.Views.Confirm = Backbone.View.extend({

    className: 'um-order-confirm',
    template: 'confirm',

    initialize: function () {
        this.render();
    },

    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function (template) {
            var html = $(template);
            that.$el.html(html);
        });
        return this;
    }
});
/**
 *  Форма подтверждения телефона
 *  */
UM.Views.UserPhoneForm = Backbone.View.extend({

    tagName: 'form',
    className: 'um-form',
    template: 'formPhoneAuth',

    events: {
        'focus #umPhone': 'initMask',
        'input input': 'setAttr',
        'submit': 'save'
    },

    initialize: function () {
        this.render();
        this.listenTo(this.model, 'change', this.setValue);
        this.listenTo(this.model, 'invalid', this.invalid);
        this.listenTo(this.model, 'request', function () {
            UM.vent.trigger('page:showLoader');
            this.valid();
            this.disabledSubmit();
        });
        this.listenTo(this.model, 'sync', function () {
            UM.vent.trigger('page:hideLoader');
            this.confirm();
        });
        this.listenTo(this.model, 'error', function (obj, name, callback) {
            UM.vent.trigger('page:hideLoader');
            this.enabledSubmit();
            this.error(obj, name, callback);
        },this);
    },

    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function (template) {
            var temp = _.template(template);
            var html = $(temp(that.model.toJSON()));
            that.$el.html(html);
        });
        return this;
    },

    setValue: function () {
        var attr = this.model.toJSON();
        _.each(attr, function (num, key) {
            this.$el.find('[name=' + key + ']').val(num);
        }, this);
    },

    disabledSubmit: function () {
        this.$el.find('button:submit')[0].disabled = true;
    },

    enabledSubmit: function () {
        this.$el.find('button:submit')[0].disabled = false;
    },

    valid: function () {
        this.$el.find('input')
            .closest('.um-form-group').removeClass('um-has-error')
            .children('.um-tooltip').remove();
    },

    invalid: function (model, errors) {
        this.$el.find('input')
            .closest('.um-form-group').removeClass('um-has-error')
            .children('.um-tooltip').remove();
        _.each(errors, function (error) {
            var $el = this.$el.find('[name=' + error.attr + ']'),
                $group = $el.closest('.um-form-group');

            $group.addClass('um-has-error');
            var tooltip = new UM.Views.Tooltip();
            tooltip.$el.html(error.text);
            $group.append(tooltip.el);
        }, this);
    },

    save: function (e) {
        e.preventDefault();

        var data = {};
        this.$el.find('.um-form-control').each(function(){
            data[this.name] = $(this).val();
        });

        this.model.save(data);
    },

    confirm: function () {
        if (this.model.get('confirm')) {
            UM.vent.trigger('page:showConfirm');
        } else {
            throw new Error("Сервер прислал некоректное значение confirm:'" + this.model.get('confirm'));
        }
    },

    error: function (obj, name, callback) {
        var errors = [{
            text: "Не верный код",
            attr: 'code'
        }];
        this.model.set('code', '');
        this.invalid(this.model, errors);
    }
});
/**
 *  Форма заявки на просчет
 *  */
UM.Views.СalculationForm = Backbone.View.extend({

    tagName: 'form',
    className: 'um-form',
    template: 'formCalculationTpl',

    events: {
        'focus #umPhone': 'initMask',
        'focus #umCity': 'showSelectCity',
        'focus #umShop': 'showSelectShop',
        'focus input:not(#umCity)': 'hideSelectCity',
        'focus input:not(#umShop)': 'hideSelectShop',
        'input input': 'setAttrs',
        'blur input': 'setAttr',
        'blur textarea': 'setAttr',
        'click .um-icon-add-location': 'showYaMap',
        'submit': 'save'
    },

    initialize: function () {
        UM.cityCollection = new UM.Collections.Citys([], this.model.toJSON());
        UM.cityCollection.fetch().then(function(){
            UM.cityCollectionView = new UM.Views.Citys({collection: UM.cityCollection});
        });

        UM.shopCollection = new UM.Collections.Shops([], this.model.toJSON());
        UM.shopCollection.fetch();

        this.render();

        this.model.on('change', this.setValue, this);
        if (UM.config.get('showShop')) {
            this.createYaMapModal();
            this.model.on('change', this.createSelectShop, this);
        }
        this.listenTo(this.model, 'request', function () {
            UM.vent.trigger('page:showLoader');
            this.valid();
            this.disabledSubmit();
        });
        this.listenTo(this.model, 'sync', function () {
            UM.vent.trigger('page:hideLoader');
            UM.vent.trigger('page:showPhoneForm');
        });
        this.listenTo(this.model, 'error', function () {
            UM.vent.trigger('page:hideLoader');
            this.enabledSubmit();
        });
        this.listenTo(this.model, 'invalid', this.invalid);
    },

    initMask: function () {
        this.$el.find('[name=phone]').inputmask({"mask": "+7(999)999-99-99"});
    },

    showSelectCity: function () {
        var $el = this.$el.find('.um-dropdown-content.um-city-list');

        if (!$el.length)
            this.$el.find('[name=city]').before(UM.cityCollectionView.el);
        else
            UM.vent.trigger('cityList:show');
    },

    hideSelectCity: function () {
        UM.vent.trigger('cityList:hide');
    },

    createSelectShop: function () {
        if (this.model.hasChanged("city")) {
            var city = this.model.get('city'),
                shop = this.model.get('shop');

            this.removeSelectShop();

            if (city && UM.cityCollection.findWhere({'name': city}).get('showShop')) {
                this.addSelectShop(city);
                if (UM.config.get('showShop')) {
                    this.createYaMap();
                }
            } else {
                this.removeSelectShop();
                this.removeYaMap();
                this.model.set('shop', '');
            }
        }
    },

    addSelectShop: function (city) {
        var $el = this.$el.find('[name=shop]');

        UM.cityShopCollection = UM.shopCollection.filterByCity(city);
        UM.shopCollectionView = new UM.Views.Shops({collection: UM.cityShopCollection});

        if (UM.shopCollectionView.$el.children().length) {
            $el.before(UM.shopCollectionView.el);

            $el[0].disabled = false;
            $el.parent('.um-form-group').removeClass('um-hidden');
        }
    },

    removeSelectShop: function () {
        var $el = this.$el.find('[name=shop]');

        $el.siblings('.um-dropdown-content').remove();

        $el[0].disabled = true;
        $el.parent('.um-form-group').addClass('um-hidden');
    },

    showSelectShop: function () {
        UM.vent.trigger('shopList:show');
    },

    hideSelectShop: function () {
        UM.vent.trigger('shopList:hide');
    },

    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function (template) {
            var temp = _.template(template);
            var data = _.extend(that.model.toJSON(), UM.config.toJSON());
            var html = $(temp(data));
            that.$el.html(html);
        });
        return this;
    },
    /** Устанавливает значения полей формы*/
    setValue: function () {
        var attr = this.model.toJSON();
        _.each(attr, function (num, key) {
            this.$el.find('[name=' + key + ']').val(num);
        }, this);
    },
    /**
     * Сохраняет изменения поля в модель.
     */
    setAttr: function (e) {
        var name = $(e.target).attr('name'),
            val = $(e.target).val();
        this.model.set(name, val);
    },
    /**
     * Сохраняет все поля в модель.
     */
    setAttrs: function() {
        var data = {};
        this.$el.find('.um-form-control').each(function(){
            data[this.name] = $(this).val();
        });

        this.model.set(data);
    },
    /**
     * Сохраняет все поля на сервер.
     */
    save: function (e) {
        e.preventDefault();

        var data = {};
        this.$el.find('.um-form-control').each(function(){
            data[this.name] = $(this).val();
        });

        this.model.save(data);
    },
    /**
     * Кнопка отправки становится неактивной
     */
    disabledSubmit: function () {
        this.$el.find('button:submit')[0].disabled = true;
    },
    /**
     * Кнопка отправки становится активной
     */
    enabledSubmit: function () {
        this.$el.find('button:submit')[0].disabled = false;
    },

    valid: function () {
        this.$el.find('input')
            .closest('.um-form-group').removeClass('um-has-error')
            .children('.um-tooltip').remove();
    },
    /**
     * Вывод ошибок
     * @param  {object} model - Диаметр окружности.
     * @param  {object} errors - Диаметр окружности.
     */
    invalid: function (model, errors) {
        this.$el.find('input')
            .closest('.um-form-group').removeClass('um-has-error')
            .children('.um-tooltip').remove();
        _.each(errors, function (error) {
            var $el = this.$el.find('[name=' + error.attr + ']'),
                $group = $el.closest('.um-form-group');

            $group.addClass('um-has-error');
            var tooltip = new UM.Views.Tooltip();
            tooltip.$el.html(error.text);
            $group.append(tooltip.el);
        }, this);
    },
    /**
     * Создание модального окна для Яндекс карты
     */
    createYaMapModal: function () {
        if (!$('#umMap').length) {
            var content = '<div id="umMap"></div>';
            UM.modalMap = new UM.Models.Modal({'content': content});
            UM.modalMapView = new UM.Views.Modal({model: UM.modalMap});
            $('body').append(UM.modalMapView.el);
        }
    },
    /**
     * Создание/обновление Яндекс карты и изменение на нее меток
     */
    createYaMap: function () {
        var $elMap = $('#umMap');

        if (!$elMap.length) return false;

        $elMap.children().remove();

        var mapShopArr = UM.shopCollection.filterByCityForMap(this.model.get('city')).toJSON();

        var latSum = 0,
            lonSum = 0,
            latAvg = 0,
            lonAvg = 0;

        _.each(mapShopArr, function (obj) {
            latSum += Number(obj.lat);
            lonSum += Number(obj.lon);
        });
        latAvg = latSum / mapShopArr.length;
        lonAvg = lonSum / mapShopArr.length;

        if (mapShopArr.length) {
            UM.map = new ymaps.Map('umMap', {
                center: [lonAvg, latAvg],
                zoom: 10
            });
            UM.mapShopCollection = new Backbone.Collection(mapShopArr);

            var Placemark = Backbone.Ymaps.Placemark.extend({
                placemarkOptions: {},

                initialize: function () {
                    var colors = Object.keys(this.styles),
                        idx = _.random(0, colors.length);

                    this.setStyle(colors[idx]);
                },

                hintContent: 'Выбрать студию',

                balloonContent: function () {
                    return 'Выбрана ' + this.model.get('title');
                },

                iconContent: function () {
                    return this.model.get('mr3id');
                },

                events: {
                    'click': 'selectShop'
                },

                selectShop: function () {
                    UM.vent.trigger('user:setShop', this.model.get('title'));
                }
            });

            UM.mapShopCollectionView = new Backbone.Ymaps.CollectionView({
                geoItem: Placemark,
                collection: UM.mapShopCollection,
                map: UM.map
            });

            UM.mapShopCollectionView.render();
        } else {
            this.hideYaMap();
        }

    },

    removeYaMap: function () {
        UM.map.destroy();
        UM.mapShopCollection.reset();
        UM.mapShopCollectionView.destroy();
    },

    showYaMap: function () {
        if (UM.mapShopCollectionView) {
            $('.um-modal').removeClass('um-hidden');
            UM.vent.trigger('shopList:hide');
        }
    },

    hideYaMap: function () {
        $('.um-modal').addClass('um-hidden');
    }
});
/**
 *  Прелоудер
 *  */
UM.Views.Loader = Backbone.View.extend({

    className: 'um-load-bar um-hidden',
    template: 'loaderTpl',

    initialize: function () {
        this.render();
    },

    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function (template) {
            var html = $(template);
            that.$el.html(html);
        });
        return this;
    },

    show: function () {
        this.$el.removeClass('um-hidden');
    },

    hide: function () {
        this.$el.addClass('um-hidden');
    }
});
/**
 *  Модальное окно
 *  */
UM.Views.Modal = Backbone.View.extend({

    className: 'um-modal um-hidden',
    template: 'modalTpl',

    events: {
        'click .um-close': 'hide'
    },

    initialize: function () {
        this.render();
    },

    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function (template) {
            var temp = _.template(template);
            var html = $(temp(that.model.toJSON()));
            that.$el.html(html);
        });
        return this;
    },

    show: function () {
        this.$el.removeClass('um-hidden');
    },

    hide: function () {
        this.$el.addClass('um-hidden');
    }
});

UM.Views.City = Backbone.View.extend({

    events: {
        'click': 'active'
    },

    tagName: "li",
    template: _.template('<span><%= name %></span>'),

    initialize: function () {
        this.render();
        this.model.on('change', this.render, this);
    },

    render: function () {
        var active = this.model.get('active');

        if (active)
            this.$el.addClass('active');
        else
            this.$el.removeClass('active');

        this.$el.html(this.template(this.model.toJSON()));

        return this;
    },

    active: function () {
        if (this.model.get('active'))
            UM.vent.trigger('cityList:hide');
        else {
            this.model.set('active', true);
            UM.vent.trigger('user:setCity', this.model.get('name'));
        }
    }
});
/**
 *  Список городов
 *  */
UM.Views.Citys = Backbone.View.extend({

    tagName: 'ul',
    className: 'um-dropdown-content um-city-list',

    initialize: function () {
        this.render();
        UM.vent.on('cityList:show', this.show, this);
        UM.vent.on('cityList:hide', this.hidden, this);
        this.collection.on('change', this.hidden, this);
        this.collection.on('sync', this.render, this);
    },

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.City({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    },

    hidden: function () {
        this.$el.addClass('um-hidden');
    },

    show: function () {
        this.unsetActive(UM.user.get('city'));
        this.$el.removeClass('um-hidden');
    },

    unsetActive: function (active) {
        this.collection.each(function (model) {
            if (model.get('name') != active) {
                model.set('active', false);
            }
        }, this);
    }
});

UM.Views.Shop = Backbone.View.extend({

    events: {
        'click': 'active'
    },

    tagName: "li",
    template: _.template('<span><%= name %>, <%= address %></span>'),

    initialize: function () {
        this.render();
        this.model.on('change', this.render, this);
    },

    render: function () {
        var active = this.model.get('active');

        if (active)
            this.$el.addClass('active');
        else
            this.$el.removeClass('active');

        this.$el.html(this.template(this.model.toJSON()));

        return this;
    },

    active: function () {
        if (this.model.get('active'))
            UM.vent.trigger('shopList:hide');
        else {
            this.model.set('active', true);

            var shopName = this.model.get('name') + ', ' + this.model.get('address');

            UM.vent.trigger('user:setShop', shopName);
        }

    }
});
/**
 *  Список студий
 *  */
UM.Views.Shops = Backbone.View.extend({

    tagName: 'ul',
    className: 'um-dropdown-content um-shop-list',

    initialize: function () {
        this.render();
        UM.vent.on('shopList:show', this.show, this);
        UM.vent.on('shopList:hide', this.hidden, this);
        this.collection.on('change', this.hidden, this);
    },

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.Shop({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    },

    hidden: function () {
        this.$el.addClass('um-hidden');
    },

    show: function () {
        this.unsetActive(UM.user.get('shop'));
        this.$el.removeClass('um-hidden');
    },

    unsetActive: function (active) {
        this.collection.each(function (model) {
            if (model.get('name') + ', ' + model.get('address') != active) {
                model.set('active', false);
            }
        }, this);
    }
});
/**
 *  Основное окно универсального модуля
 *  */
UM.Views.Page = Backbone.View.extend({

    tagName: 'article',
    className: 'um',

    events: {
        'click .um-close': 'hide'
    },

    initialize: function () {
        /** В фиксированном окне добваляется соответствующий класс DOM элементу */
        if (this.model.get('initType') == 'button' || this.model.get('initPosition') == 'fixed')
            this.$el.addClass('fixed');

        this.render(this.showStartForm());

        UM.vent.on('page:show', this.show, this);

        UM.vent.on('page:showLoader', function () {
            this.render(this.showLoader());
        }, this);

        UM.vent.on('page:hideLoader', function () {
            this.render(this.hideLoader());
        }, this);

        UM.vent.on('page:showPhoneForm', function () {
            this.render(this.showPhoneForm());
        }, this);

        UM.vent.on('page:showConfirm', function () {
            this.render(this.showConfirm());
        }, this);

        this.listenTo(this.model, 'destroy', this.unrender);
    },

    render: function (form) {
        /** В фиксированном окне добваляется кнопка закрытия окна */
        if (this.model.get('initType') == 'button' || this.model.get('initPosition') == 'fixed') {
            var close =
                '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="um-close">' +
                    '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>' +
                    '<path d="M0 0h24v24H0z" fill="none"/>' +
                '</svg>';
        }
        this.$el.html(form);
        this.$el.prepend(close);
        return this;
    },

    unrender: function() {
        this.remove(); // this.$el.remove()
    },

    show: function () {
        this.$el.removeClass('um-hidden');
    },

    hide: function () {
        this.$el.addClass('um-hidden');
        if (this.model.get('initType') == 'button') {
            UM.vent.trigger('button:show');
        }
    },

    /** Добавление прелоудера для обмена данными с сервером */
    initLoader: function () {
        UM.laoder = new UM.Views.Loader();
        this.$el.prepend(UM.laoder.el);
    },

    showLoader: function () {
        if (!UM.laoder) {
            this.initLoader();
        }
        UM.laoder.show();
    },

    hideLoader: function () {
        if (!UM.laoder) {
            this.initLoader();
        }
        UM.laoder.hide();
    },

    /**
     * Рендер выбранной в конфигураторе формы
     * */
    showStartForm: function () {
        if (this.model.get('formType') == 'calculation') {
            UM.user = new UM.Models.User({configId: this.model.get('id')});
            UM.сalculationFormView = new UM.Views.СalculationForm({model: UM.user});
            return UM.сalculationFormView.el;
        } else {
            throw new Error("Тип заявки '" + this.model.get('formType') + "' не поддерживается или не корректен");
        }
    },
    /**
     * Рендер формы подтверждения телефона
     * */
    showPhoneForm: function () {
        var phone = UM.user.get('phone');
        UM.phone = new UM.Models.Phone({phone: phone});
        UM.phoneView = new UM.Views.UserPhoneForm({model: UM.phone});
        return UM.phoneView.el;
    },
    /**
     * Рендер сообщения ою оформлении заявки
     * */
    showConfirm: function () {
        UM.confirmView = new UM.Views.Confirm();
        return UM.confirmView.el;
    }
});
/**
 *  Кнопка инициализации универсального модуля
 *  */
UM.Views.Button = Backbone.View.extend({
    events: {
        'click': 'clicked'
    }
});
/**
 *  Кнопка связанная со статиным DOM элементом
 *  */
UM.Views.ButtonStatic = UM.Views.Button.extend({
    el: $('#um-btn-init'),

    clicked: function () {
        UM.vent.trigger('page:show');
    }
});
/**
 *  Кнопка фиксированная относительно окна браузера
 *  */
UM.Views.ButtonFixed = UM.Views.Button.extend({
    className: 'um-btn um-btn--raised um-btn-red um-btn-start--fixed',
    tagName: 'button',

    initialize: function () {
        this.render();
        UM.vent.on('button:show', this.show, this);
    },

    render: function () {
        this.$el.html('Заказать кухню');
        return this;
    },

    unrender: function() {
        this.remove(); // this.$el.remove()
    },

    show: function () {
        this.$el.removeClass('um-hidden');
    },

    hide: function () {
        this.$el.addClass('um-hidden');
    },

    clicked: function () {
        UM.vent.trigger('page:show');
        this.hide();
    }
});

window.UM = UM;