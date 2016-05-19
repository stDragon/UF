var conf = require('../nconf.js');

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

    App.formFieldGenerator = [];

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
                //App.example = new App.Views.Example({model: App.config});
            });
        else {
            App.formCodeView = new App.Views.CodeGeneratorForm({model: App.config});
            $('#formCodeGenerator').html(App.formCodeView.el);
            //App.example = new App.Views.Example({model: App.config});
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
            phoneVerification: true
        },

        urlRoot: function () {
            return App.serverUrl + '/conf/'
        },

        initialize: function () {
            if (!this.id)
                this.createFormFieldGenerator();
            else
                this.listenToOnce(this, 'sync', this.createFormFieldGenerator);

            this.on('change:formConfig', this.createFormFieldGenerator, this);

            if (App.conf.server.type != 'prod')
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

        createFormFieldGenerator: function() {
            if (App.formFieldGenerator)
                this.formField = App.formFieldGenerator;
            else {
                App.formFieldGenerator = new App.Models.FormFieldGenerator(this.toJSON().formConfig);
                this.formField = App.formFieldGenerator;
            }
            this.listenTo(this.formField, 'change', this.setFormConfig);
            this.setFormConfig()
        },

        setFormConfig: function () {
            this.set('formConfig', this.formField.toJSON());
        },

        getButtonDOM: function() {
            return '<button type="button" data-um-id="' + this.id + '" class="um-btn um-btn--raised um-btn-red">Заказать кухню</button>'
        },

        getFormDOM: function() {
            return '<div data-um-id="' + this.id + '"></div>'
        },

        getScript: function () {
            return '<script type="text/javascript" src="//' + location.hostname + '/public/js/marya-um.js"><\/script>' +
                '<script>UM.init(' + JSON.stringify(this.toJSON()) + ');<\/script>';
        },

        getShortScript: function () {
            var data = {id: this.get('id')};
            return '<script type="text/javascript" src="//' + location.hostname + '/public/js/marya-um.js"><\/script>' +
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
                required: false
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
                placeholder: 'Ваш номер телефон',
                show: true,
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
                required: false
            },
            personalData: {
                type: 'checkbox',
                label: 'Согласен с обработкой персональных данных',
                show: true,
                required: true,
                checked: true
            },
            wishes: {
                type: 'textarea',
                label: 'Пожелания',
                placeholder: 'Пожелания',
                show: true,
                required: false
            },
            submit: {
                type: 'submit',
                label: 'Кнопка отправки',
                text: 'Отправить заявку'
            }
        },

        initialize: function() {
            if (App.conf.server.type != 'prod')
                this.on('change', this.log, this);
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
            "input input:text"    : "changed",
            "change input"        : "changed",
            "change select"       : "changed",
            "click .js-copy-code" : "copyCode",
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
            switch (this.model.get('formType')) {
                case 'calculation':
                    App.formFieldGeneratorView = new App.Views.FormFieldGenerator({model: this.model.formField});
                    $('#formFieldGenerator').html(App.formFieldGeneratorView.el);
                    break;
            }
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
            "input input:text"    : "changed",
            "change input"        : "changed",
            "change select"       : "changed",
            "submit"              : "submit"
        },

        initialize: function () {
            this.render();

            //this.listenTo(this.model, 'change', this.setValue);
            _.bindAll(this, 'changed');
        },

        render: function () {
            var that = this;
            App.Helpers.TemplateManager.get(this.template, function (template) {
                var temp = _.template(template);
                var data = that.model.toJSON();
                var html = $(temp(data));
                that.$el.html(html);
                if(that.model.id) that.renderCode();
            });
            return this;
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

        changed: function(e) {
            var changed = e.currentTarget;

            var value;
            if (changed.type == 'checkbox') {
                value = changed.checked;
            } else {
                value = changed.value;
            }

            if (value === 'false') value = false;
            if (value === 'true') value = true;

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