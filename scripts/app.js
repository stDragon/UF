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
    },
                                       
    log: function () {
        console.log(this.toJSON());
    }
});

UM.Models.Phone = Backbone.Model.extend({
    defaults: {
        phone: '',
        confirm: false
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
        'submit': 'save'
    },
    
    initialize: function () {
        this.render();
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
    
    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function(template){
            var temp = _.template(template);
            var html = $(temp( that.model.toJSON() ));
            that.$el.html(html);
        });
        return this;
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