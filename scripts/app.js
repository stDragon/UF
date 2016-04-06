var _ = require('underscore'),
    $ = require('jQuery'),
    Backbone = require('Backbone');

window._ = window._ || _;
window.Backbone = window.Backbone || Backbone;

var UM = window.UM || {};

UM = {
    Models: {},
    Collections: {},
    Views: {},
    Router: {},
    option: {}
};

require('jquery.inputmask');
require('./Backbone.Ymaps.js');
/**
 * @todo временные массивы, удалить после его получения с сервера
 * */
UM.citys = [
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
];

UM.shop = [
    {
        name: 'Кухонная студия "Мария"',
        mr3id: '11',
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
        mr3id: '11',
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
        mr3id: '15',
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
        mr3id: '11',
        brand: 'Мария',
        dealer: '',
        status: 'Продает',
        city: 'Питер',
        address: 'ул. Саратовская, д. 129/133',
        administrator: 'Кролик Киевский',
        priceZone: ''
    }
];

UM.start = function(option) {
    var $head = $('head'),
        $body = $('body');

    this.option = option;

    if (!this.option.serverUrl)
        throw new Error("Не указано имя сервера Мария '" + option.serverUrl + "' проверьте конфигурацию");
    if (!this.option.siteUrl)
        throw new Error("Не указано имя вашего сайта '" + option.siteUrl + "' проверьте конфигурацию");
    if (!this.option.type)
        throw new Error("Не указан тип модуля '" + option.type + "' проверьте конфигурацию");

        var head = '';
    if (this.option.style) {
        var style = this.option.serverUrl + this.option.style;
        head += '<link rel="stylesheet" type="text/css" href="' + style + '">'
    }
    //if(this.option.showMap) {
        head += '<script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&mode=debug" type="text/javascript">';
    //} else {
    //    console.warn('карта отключина');
    //}
    $head.append(head);

    UM.page = new UM.Views.Page({options: this.option});

    if(this.option.type == 'button') {
        UM.button = new UM.Views.Button({});
        $body.append(UM.button.el);
        UM.page.hide();
    }

    $body.append(UM.page.el);
};

UM.vent = _.extend({}, Backbone.Events);

UM.template = function(id) {
    return _.template( $('#' + id).html() );
};

UM.TemplateManager = {
    templates: {},

    get: function(id, callback){
        var template = this.templates[id];

        if (template) {
            callback(template);

        } else {

            var that = this;
            $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
                options.crossDomain ={
                    crossDomain: true
                };
                options.xhrFields = {
                    withCredentials: true
                };
            });
            $.ajax({
                url : UM.option.serverUrl + "templates/" + id + ".html",
                success: function(template){
                    var tmpl = template;
                    that.templates[id] = tmpl;
                    callback(tmpl);
                }
            });

        }

    }

};

UM.Views.Tooltip = Backbone.View.extend({

    tagName: 'span',
    className: 'um-tooltip bottom',

    initialize: function (text) {
        this.render(text);
    },

    render: function(text) {
        this.$el.html(text);
        return this;
    }

});

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
    
    url: function() {
        return UM.option.serverUrl + 'users/'
    },

    validate: function(attrs, options) {
        var emailFilter    = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
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

        if(errors.length) return errors;
    },
    
    initialize: function () {
        this.on('change', this.log, this);
        UM.vent.on('user:setCity', this.setCity, this);
        UM.vent.on('user:setShop', this.setShop, this);
    },
                                       
    log: function () {
        console.log(this.toJSON());
    },

    setCity: function(name) {
        this.set({
            'city': name,
            'shop': ''
        });
    },
    setShop: function(name) {
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

UM.Models.Phone = Backbone.Model.extend({
    defaults: {
        phone: '',
        confirm: false
    }
});

UM.Collections.Citys = Backbone.Collection.extend({
    model: UM.Models.City,

    //url: function() {
    //    return UM.option.serverUrl + '/city/'
    //},

    comparator: function(model) {
        return model.get('name');
    }
});

UM.Collections.Shops = Backbone.Collection.extend({
    model: UM.Models.Shop,

    //url: function() {
    //    return UM.option.serverUrl + '/shop/'
    //},

    filterByCity: function (city) {
        var filtered = this.filter(function (model) {
            return model.get("city") === city;
        });
        return new UM.Collections.Shops(filtered);
    },
    filterByCityForMap: function (city) {
        var filtered = this.filter(function (model) {
            return model.get("city") === city && model.get("lat") && model.get("lat");
        });
        return new UM.Collections.Shops(filtered);
    }
});

UM.Views.Confirm = Backbone.View.extend({

    className: 'um-order-confirm',
    template: 'confirm',

    initialize: function () {
        this.render();
    },

    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function(template){
            var html = $(template);
            that.$el.html(html);
        });
        return this;
    }
});

UM.Views.UserPhoneForm = Backbone.View.extend({

    tagName: 'form',
    className: 'um-form',
    template: 'formPhoneAuth',

    events: {
        'focus #umPhone': 'initMask',
        'submit': 'confirm'
    },

    initialize: function () {
        this.render();
    },

    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function(template){
            var temp = _.template(template);
            var html = $(temp( that.model.toJSON() ));
            that.$el.html(html);
        });
        return this;
    },

    confirm: function (e) {
        e.preventDefault();

        //@TODO: Добавить обработку подтверждения СМС

        UM.vent.trigger('page:showConfirm');
    }
});

UM.Views.UserForm = Backbone.View.extend({
    
    tagName: 'form',
    className: 'um-form',
    template: 'formTpl',

    events: {
        'focus #umPhone': 'initMask',
        'focus #umCity': 'showSelectCity',
        'focus #umShop': 'showSelectShop',
        'focus input:not(#umCity)': 'hideSelectCity',
        'focus input:not(#umShop)': 'hideSelectShop',
        'blur input': 'saveAttr',
        'click .um-icon-add-location': 'showYaMap',
        'submit': 'save'
    },
    
    initialize: function () {
        this.render();
        this.createYaMapModal();
        this.model.on('change', this.setValue, this);
        if(UM.option.showShop){
            this.model.on('change', this.createSelectShop, this);
        }
        this.listenTo(this.model, 'request', function() {
            UM.vent.trigger('page:showLoader');
            this.disabledSubmit();
        });
        this.listenTo(this.model, 'sync', function() {
            UM.vent.trigger('page:hideLoader');
            this.valid();
            UM.vent.trigger('page:showPhoneForm');
        });
        this.listenTo(this.model, 'error', function() {
            UM.vent.trigger('page:hideLoader');
            this.enabledSubmit();
        });
        this.listenTo(this.model, 'invalid', this.invalid);
    },
    
    initMask: function() {
        this.$el.find('[name=phone]').inputmask({"mask": "+7(999)999-99-99"});
    },

    showSelectCity: function() {
        var $el = this.$el.find('.um-dropdown-content.um-city-list');

        if(!$el.length)
            this.$el.find('[name=city]').before(UM.cityCollectionView.el);
        else
            UM.vent.trigger('cityList:show');
    },

    hideSelectCity: function(){
        UM.vent.trigger('cityList:hide');
    },

    createSelectShop: function () {
        if (this.model.hasChanged("city")) {
            var city = this.model.get('city'),
                shop = this.model.get('shop');

            this.removeSelectShop();

            if(city && UM.cityCollection.findWhere({'name': city}).get('showShop')) {
                this.addSelectShop(city);
                if(UM.option.showShop){
                    this.createYaMap();
                }
            } else {
                this.removeSelectShop();
                this.removeYaMap();
                this.model.set('shop', '');
            }
        }
    },

    addSelectShop: function(city) {
        var $el = this.$el.find('[name=shop]');

        UM.cityShopCollection = UM.shopCollection.filterByCity(city);
        UM.shopCollectionView = new UM.Views.Shops({collection: UM.cityShopCollection});

        if(UM.shopCollectionView.$el.children().length){
            $el.before(UM.shopCollectionView.el);

            $el[0].disabled = false;
            $el.parent('.um-form-group').removeClass('um-hidden');
        }
    },

    removeSelectShop: function() {
        var $el = this.$el.find('[name=shop]');

        $el.siblings('.um-dropdown-content').remove();

        $el[0].disabled = true;
        $el.parent('.um-form-group').addClass('um-hidden');
    },

    showSelectShop: function() {
        UM.vent.trigger('shopList:show');
    },

    hideSelectShop: function() {
        UM.vent.trigger('shopList:hide');
    },
    
    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function(template){
            var temp = _.template(template);
            var html = $(temp( that.model.toJSON() ));
            that.$el.html(html);
        });
        return this;
    },

    setValue: function () {
        var attr = this.model.toJSON();
        _.each(attr, function(num, key) {
            this.$el.find('[name=' + key + ']').val(num);
        }, this);
    },

    saveAttr: function(e) {
        var name = $(e.target).attr('name'),
            val = $(e.target).val();
        this.model.set(name, val);
    },

    save: function (e) {
        e.preventDefault();
        
        var data = {
            'surname':   this.$el.find('[name=surname]').val(),
            'firstName': this.$el.find('[name=firstName]').val(),
            'email':     this.$el.find('[name=email]').val(),
            'city':      this.$el.find('[name=city]').val(),
            'shop':      this.$el.find('[name=shop]:not(disabled)').val() || '',
            'phone':     this.$el.find('[name=phone]').val()
        };
        
        this.model.save(data);
    },

    disabledSubmit: function() {
        this.$el.find('.js-create-order')[0].disabled = true;
    },

    enabledSubmit: function() {
        this.$el.find('.js-create-order')[0].disabled = false;
    },

    valid: function () {
        this.$el.find('input')
            .closest('.um-form-group').removeClass('um-has-error')
            .children('.um-tooltip').remove();
    },

    invalid: function(model, errors) {
        this.$el.find('input')
            .closest('.um-form-group').removeClass('um-has-error')
            .children('.um-tooltip').remove();
        _.each(errors, function(error){
            var $el = this.$el.find('[name=' +error.attr + ']'),
                $group = $el.closest('.um-form-group');

            $group.addClass('um-has-error');
            var tooltip = new UM.Views.Tooltip();
            tooltip.$el.html(error.text);
            $group.append(tooltip.el);
        }, this);
    },

    createYaMapModal: function() {
        if(!$('#umMap').length) {

            var content = '<div id="umMap"></div>';
            UM.modalMap = new UM.Views.Modal({'content': content});
            $('body').append(UM.modalMap.el);

        }
    },

    createYaMap: function() {
        $('#umMap').children().remove();

        var mapShopArr = UM.shopCollection.filterByCityForMap(this.model.get('city')).toJSON();

        var latSum = 0,
            lonSum = 0,
            latAvg = 0,
            lonAvg = 0;

        _.each(mapShopArr, function(obj){
            latSum += Number(obj.lat);
            lonSum += Number(obj.lon);
        });
        latAvg = latSum/mapShopArr.length;
        lonAvg = lonSum/mapShopArr.length;

        if(mapShopArr.length) {
            var map = new ymaps.Map('umMap', {
                center: [lonAvg, latAvg],
                zoom: 10
            });
            UM.mapShopCollection =  new Backbone.Collection(mapShopArr);

            var Placemark = Backbone.Ymaps.Placemark.extend({
                placemarkOptions: {

                },

                initialize: function() {
                    var colors = Object.keys(this.styles),
                        idx = _.random(0, colors.length);

                    this.setStyle(colors[idx]);
                },

                hintContent: 'Выбрать студию',

                balloonContent: function() {
                    return 'Выбрана ' + this.model.get('title');
                },

                iconContent: function() {
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
                map: map
            });

            UM.mapShopCollectionView.render();
        } else {
            this.hideYaMap();
        }

    },

    removeYaMap: function () {
        UM.mapShopCollection = {};
        UM.mapShopCollectionView = {};
    },

    showYaMap: function () {
        if (UM.mapShopCollectionView) {
            $('.um-modal').removeClass('um-hidden');
            UM.vent.trigger('shopList:hide');
        }
    },

    hideYaMap: function() {
        $('.um-modal').addClass('um-hidden');
    }
});

UM.Views.Loader = Backbone.View.extend({
    
    className: 'um-load-bar um-hidden',
    template: 'loaderTpl',
    
    initialize: function() {
        this.render();
    },
    
    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function(template){
            var html = $(template);
            that.$el.html(html);
        });
        return this;
    },
    
    show: function() {
        this.$el.removeClass('um-hidden');
    },

    hide: function() {
        this.$el.addClass('um-hidden');
    }
});

UM.Views.Modal = Backbone.View.extend({

    className: 'um-modal um-hidden',
    template: 'modalTpl',

    events: {
        'click .um-close': 'hide'
    },

    initialize: function(attrs) {
        this.options = attrs;
        if(this.options.content) {

        }
        this.render(this.options.content);
    },

    render: function (content) {
        var that = this;
        UM.TemplateManager.get(this.template, function(template){
            var html = $(template);
            if(content) {
                html.find('.modal-content').html(content);
            }
            that.$el.html(html);
        });
        return this;
    },

    show: function() {
        this.$el.removeClass('um-hidden');
    },

    hide: function() {
        this.$el.addClass('um-hidden');
    }
});

UM.Views.City = Backbone.View.extend({

    events: {
        'click': 'active'
    },

    tagName: "li",
    template: _.template('<span><%= name %></span>'),

    initialize: function() {
        this.render();
        this.model.on('change', this.render, this);
    },

    render: function() {
        var active = this.model.get('active');

        if(active)
            this.$el.addClass('active');
        else
            this.$el.removeClass('active');

        this.$el.html( this.template( this.model.toJSON() ) );

        return this;
    },

    active: function () {
        if(this.model.get('active'))
            UM.vent.trigger('cityList:hide');
        else {
            this.model.set('active', true);
            UM.vent.trigger('user:setCity', this.model.get('name'));
        }
    }
});

UM.Views.Citys = Backbone.View.extend({

    tagName: 'ul',
    className: 'um-dropdown-content um-city-list',

    initialize: function() {
        this.render();
        UM.vent.on('cityList:show', this.show, this);
        UM.vent.on('cityList:hide', this.hidden, this);
        this.collection.on('change', this.hidden, this);
    },

    render: function() {
        this.collection.each(function(model) {
            var view = new UM.Views.City({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    },

    hidden: function() {
        this.$el.addClass('um-hidden');
    },

    show: function() {
        this.unsetActive(UM.user.get('city'));
        this.$el.removeClass('um-hidden');
    },

    unsetActive: function (active) {
        this.collection.each(function(model) {
            if( model.get('name') != active){
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

    initialize: function() {
        this.render();
        this.model.on('change', this.render, this);
    },

    render: function() {
        var active = this.model.get('active');

        if(active)
            this.$el.addClass('active');
        else
            this.$el.removeClass('active');

        this.$el.html( this.template( this.model.toJSON() ) );

        return this;
    },

    active: function () {
        if(this.model.get('active'))
            UM.vent.trigger('shopList:hide');
        else {
            this.model.set('active', true);

            var shopName = this.model.get('name') + ', ' + this.model.get('address');

            UM.vent.trigger('user:setShop', shopName);
        }

    }
});

UM.Views.Shops = Backbone.View.extend({

    tagName: 'ul',
    className: 'um-dropdown-content um-shop-list',

    initialize: function() {
        this.render();
        UM.vent.on('shopList:show', this.show, this);
        UM.vent.on('shopList:hide', this.hidden, this);
        this.collection.on('change', this.hidden, this);
    },

    render: function() {
        this.collection.each(function(model) {
            var view = new UM.Views.Shop({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    },

    hidden: function() {
        this.$el.addClass('um-hidden');
    },

    show: function() {
        this.unsetActive(UM.user.get('shop'));
        this.$el.removeClass('um-hidden');
    },

    unsetActive: function (active) {
        this.collection.each(function(model) {
            if( model.get('name') + ', ' + model.get('address') != active){
                model.set('active', false);
            }
        }, this);
    }
});

UM.Views.Page = Backbone.View.extend({
    
    className: 'um fixed',
    template: '',

    events: {
        'click .um-close': 'hide'
    },
    
    initialize: function(options) {
        this.options = options.options;

        this.render(this.showStartForm());

        UM.vent.on('page:show', this.show, this);

        UM.vent.on('page:showLoader', function(){
            this.render(this.showLoader());
        }, this);

        UM.vent.on('page:hideLoader', function(){
            this.render(this.hideLoader());
        }, this);

        UM.vent.on('page:showPhoneForm', function(){
            this.render(this.showPhoneForm());
        }, this);

        UM.vent.on('page:showConfirm', function(){
            this.render(this.showConfirm());
        }, this);

    },
    
    render: function(form) {
        if (this.options.type == 'button'){
            var close = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="um-close">' +
                '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>' +
                '<path d="M0 0h24v24H0z" fill="none"/>' +
                '</svg>';
        }
        this.$el.html(form);
        this.$el.prepend(close);
        return this;
    },

    show: function() {
      this.$el.removeClass('um-hidden');
    },

    hide: function() {
        this.$el.addClass('um-hidden');
        if (this.options.type == 'button'){
            UM.vent.trigger('button:show');
        }
    },

    initLoader: function() {
        UM.laoder = new UM.Views.Loader();
        this.$el.prepend(UM.laoder.el);
    },

    showLoader: function() {
        if(!UM.laoder) {
            this.initLoader();
        }
        UM.laoder.show();
    },

    hideLoader: function() {
        if(!UM.laoder) {
            this.initLoader();
        }
        UM.laoder.hide();
    },
    
    showStartForm: function() {
        UM.cityCollection = new UM.Collections.Citys(UM.citys);
        UM.cityCollectionView = new UM.Views.Citys({collection: UM.cityCollection});

        UM.shopCollection = new UM.Collections.Shops(UM.shop);

        UM.user = new UM.Models.User;
        UM.userCreateFormView = new UM.Views.UserForm({model: UM.user});
        return UM.userCreateFormView.el;
    },

    showPhoneForm: function () {
        var phone = UM.user.get('phone');
        UM.phone = new UM.Models.Phone({phone:phone});
        UM.phoneView = new UM.Views.UserPhoneForm({model: UM.phone});
        return UM.phoneView.el;
    },

    showConfirm: function () {
        UM.confirmView = new UM.Views.Confirm();
        return UM.confirmView.el;
    }
});

UM.Views.Button = Backbone.View.extend({
    className: 'um-btn um-btn--raised um-btn-red um-btn-start--fixed js-open-order',
    tagName:'button',

    events: {
        'click': 'clicked'
    },

    initialize: function() {
        this.render();
        UM.vent.on('button:show', this.show, this);
    },

    render: function() {
        this.$el.html('Заказать кухню');
        return this;
    },

    show: function() {
        this.$el.removeClass('um-hidden');
    },

    hide: function() {
        this.$el.addClass('um-hidden');
    },

    clicked: function() {
        UM.vent.trigger('page:show');
        this.hide();
    }
});

window.UM = UM;