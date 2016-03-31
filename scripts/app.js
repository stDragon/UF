var _ = require('underscore'),
    $ = require('jQuery'),
    Backbone = require('Backbone');

require('jquery.inputmask');

var UM = {
    Models: {},
    Collections: {},
    Views: {},
    Router: {},
    url: "http://localhost:8888/"
};
/**
 * @todo временный массив, удалить после его получения с сервера
 * */
UM.citys = [
    {
        name: 'Саратов',
        mr3id: '1'
    },
    {
        name: 'Москва',
        mr3id: '2'
    },
    {
        name: 'Питер',
        mr3id: '3'
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
        mr3id: '7'
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

$('head').append('<link rel="stylesheet" type="text/css" href="' + UM.url + 'css/marya-um-styles.css">');

function start() {
    UM.page = new UM.Views.Page();
    $('body').append(UM.page.el);
}

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
                url : UM.url + "templates/" + id + ".html",
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
        wishes: ''
    },
    
    url: UM.url + 'users/',

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
    },
                                       
    log: function () {
        console.log(this.toJSON());
    },

    setCity: function(name) {
        this.set('city', name);
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
        brend: '',
        dealer: '',
        status: '',
        city: '',
        address: '',
        administrator: '',
        priceZone: ''
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
    //url: UM.url +'/city'

    comparator: function(model) {
        return model.get('name');
    }
});

UM.Collections.Shops = Backbone.Collection.extend({
    model: UM.Models.Shop,
    //url: UM.url +'/shop'
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
        'focus input:not(#umCity)': 'hideSelectCity',
        'submit': 'save'
    },
    
    initialize: function () {
        this.render();
        this.model.on('change', this.setValue, this);
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
            this.$el.find('[name=city]').after(UM.cityCollectionView.el);
        else
            UM.vent.trigger('cityList:show');
    },

    hideSelectCity: function(){
        UM.vent.trigger('cityList:hide');
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

    save: function (e) {
        e.preventDefault();
        
        var data = {
            'surname':   this.$el.find('[name=surname]').val(),
            'firstName': this.$el.find('[name=firstName]').val(),
            'email':     this.$el.find('[name=email]').val(),
            'city':      this.$el.find('[name=city]').val(),
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
        this.model.set('active', !this.model.get('playing'));
        UM.vent.trigger('user:setCity', this.model.get('name'));
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
        this.collection.each(function(city) {
            var view = new UM.Views.City({model: city});
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

    unsetActive: function (cityActive) {
        this.collection.each(function(model) {
            if( model.get('name') != cityActive){
                model.set('active', false);
            }
        }, this);
    }

});

UM.Views.Page = Backbone.View.extend({
    
    className: 'um fixed',
    template: '',
    
    initialize: function() {

        this.render(this.showStartForm());

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
        this.$el.html(form);
        return this;
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

$(document).ready(start);

window.UM = UM;