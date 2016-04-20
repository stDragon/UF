$(document).ready(function() {
    $('select').material_select();
    window.validate_field = function(){}; //отмена встроенного валидатора Materialize

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {}
    };

    function init() {
        App.config = new App.Models.Config;
        App.formCode = new App.Views.CodeGeneratorForm({model: App.config});
        App.example = new App.Views.Example({model: App.config});
    }

    App.Models.Config = Backbone.Model.extend({
        defaults: {
            serverUrl: 'http://umodule.marya.ru',
            siteUrl: '',
            formType: 'calculation',
            style: '/public/css/um-material.css',
            initType: 'button',
            initPosition: 'fixed',
            showMap: false,
            showShop: false
        },

        urlRoot: function () {
            return this.get('serverUrl') + '/api/configs/'
        },

        initialize: function () {
            /** @todo временное решение для получения имя сервера отдающего кнопку*/
            var hostname = window.location.origin;
            this.set('serverUrl', hostname);
            this.on('sync', this.log, this);
        },

        validate: function (attrs, options) {
            /** @todo проверить корректность регулярки*/
            var regURL = /^(https?:\/\/)?([\S\.]+)\.(\S{2,6}\.?)(\/[\S\.]*)*\/?$/;

            var errors = [];
            if (!attrs.siteUrl) {
                errors.push({
                    text: 'Вы не заполнили поле "Сайт на котором будет использоваться модуль',
                    attr: 'siteUrl'
                });
            } else if (!regURL.test(attrs.siteUrl)) {
                errors.push({
                    text: "Сайт не коректен",
                    attr: 'siteUrl'
                });
            }

            if (errors.length) return errors;
        },

        log: function () {
            console.log(this.toJSON());
        },

        getButtonDOM: function() {
            return '<button type="button" id="um-btn-init" class="um-btn um-btn--raised um-btn-red">Заказать кухню</button>'
        },

        getFormDOM: function() {
            return '<div id="um-form-init"></div>'
        },

        getScript: function () {
            return '<script type="text/javascript" src="' + this.get('serverUrl') + '/js/marya-um.js"><\/script>' +
                '<script>UM.init(' + JSON.stringify(this.toJSON()) + ');<\/script>';
        },

        getShortScript: function () {
            return '<script type="text/javascript" src="' + this.get('serverUrl') + '/js/marya-um.js"><\/script>' +
                '<script>UM.init({"id": ' + this.get('id') + '});<\/script>';
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

    App.Views.CodeGeneratorForm = Backbone.View.extend({
        el: '#сodeGeneratorForm',

        events: {
            "input input:text"    : "changed",
            "change input"        : "changed",
            "change select"       : "changed",
            "click .js-copy-code" : "copyCode",
            "submit"              : "submit"
        },

        initialize: function () {
            this.listenTo(this.model, 'sync', this.renderCode);
            this.listenTo(this.model, 'invalid', this.invalid);
            this.listenTo(this.model, 'invalid', this.unrenderCode);
            this.listenTo(this.model, 'request', this.valid);
            _.bindAll(this, 'changed');
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
            } else {
                value = changed.value;
            }

            var obj = {};
            obj[changed.name] = value;
            if (!this.model.save(obj)) {
                this.model.set(obj);
            }
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

        copyCode: function () {
            var el = this.el.querySelector('[name=code]');
            var range = document.createRange();
            range.selectNode(el);
            window.getSelection().addRange(range);
            try {
                var successful = document.execCommand('copy');
                if (successful)
                    Materialize.toast('Код скопирован в буфер обмена', 2000);
            } catch(err) {
                console.error('Не удалось скопировать');
            }
        },

        submit: function (e) {
            e.preventDefault();
            this.model.save();
        }
    });

    App.Views.Example = Backbone.View.extend({
        el: '#example',

        initialize: function () {
            this.listenTo(this.model, 'sync', this.render);
            this.listenTo(this.model, 'invalid', this.unrender);
        },

        render: function () {

            this.unrender();

            if (this.model.get('initPosition') == 'static') {

                if (this.model.get('initType') == 'button')
                    this.$el.html(this.model.getButtonDOM());

                else if (this.model.get('initType') == 'form')
                    this.$el.html(this.model.getFormDOM());

            } else this.$el.html('');

            UM.init(this.model.toJSON());
        },

        unrender: function() {
            if(UM.page)
                UM.page.unrender();

            if(UM.button && UM.button.$el.hasClass('um-btn-start--fixed'))
                UM.button.unrender();
        }

    });

    init();
});