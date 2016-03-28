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
                    var $tmpl = $(template);
                    that.templates[id] = $tmpl;
                    callback($tmpl);
                }
            });

        }

    }

};

UM.Models.User = Backbone.Model.extend({
    defaults: {
        firstName: '',
        surname: '',
        phone: '',
        city: '',
        wishes: ''
    },
    
    url: UM.url + 'users/',
    
    initialize: function () {
        this.on('change', this.log, this);
    },
                                       
    log: function () {
        console.log(this.toJSON());
    }
});

UM.Views.Form = Backbone.View.extend({
    
    tagName: 'form',
    className: 'um-form',
    template: 'formTpl',

    events: {
        'focus #umPhone': 'initMask',
        'submit': 'save'
    },
    
    initialize: function () {
        this.render();
        this.listenTo(this.model, 'sync', function(){UM.page.hideLoader()});
    },
    
    initMask: function() {
        this.$el.find('#umPhone').inputmask({"mask": "+7(999)999-99-99"});
    },
    
    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function(template){
            var html = $(template);
            that.$el.html(html);
        });
        return this;
    },

    save: function (e) {
        e.preventDefault();
        
        this.$el.find('.js-create-order').disabled = true;

        UM.page.showLoader();
        
        var data = {
            'firstName': this.$el.find('#umFirstname').val(),
            'surname':   this.$el.find('#umSurname').val(),
            'city':      this.$el.find('#umCity').val(),
            'phone':     this.$el.find('#umPhone').val()
        };
        
        this.model.save(data);
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

    events: {
        'showLoader': 'showLoader',
        'hideLoader': 'hideLoader'
    },
    
    initialize: function() {
        this.render();
    },
    
    render: function() {
        this.$el.html(this.showStartForm());
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
        UM.user = new UM.Views.Form({model: new UM.Models.User});
        return UM.user.el;
    }
});

$(document).ready(start);

window.UM = UM;