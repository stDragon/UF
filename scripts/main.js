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

    App.codes = require('../codes.js');
    App.fields = require('../fields.js');
    App.formTemplates = require('../formTemplates.js');

    App.Models.PhoneCode = require('./models/phoneCode.js');
    App.Models.Field =  require('./models/field.js');
    App.Models.FormTemplate = require('./models/formTemplate.js');
    App.Collections.PhoneCodes = require('./collections/phoneCodes.js');
    App.Views.SelectOption = require('./views/selectOption.js');
    App.Views.Select = require('./views/select.js');
    App.Views.StepsTabView = require('./views/stepsTabView.js');
    App.Views.StepsGenetatorView = require('./views/stepsGenerator.js');

    App.Collections.FormTemplates = Backbone.Ribs.Model.extend({
        model: App.Models.FormTemplate
    });

    App.Collections.Field = Backbone.Ribs.Collection.extend({
        model: App.Models.Field
    });

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
            });
        else {
            App.formCodeView = new App.Views.CodeGeneratorForm({model: App.config});
        }
    }

    App.Models.Config = Backbone.Ribs.Model.extend({
        defaults: {
            global: {
                debug: false,
                type: 'calculation',
                server: conf.server,
                site: {
                    url:""
                }
            },
            layout: {
                style:"um-default",
                class: "",
                init: {
                    "type":"form",
                    "position":"fixed"
                }
            },
            phoneVerification: false
        },

        urlRoot: function () {
            return App.serverUrl + '/conf/'
        },

        initialize: function () {

            //this.fields = new App.Collections.Field(App.fields);
            /**
             * В зависимости от наличия ID создаем новый или загружаем конфиг с сервера,
             * после синхронизации обновляем
             * */
            if (!this.id)
                this.createFormFieldGenerator();
            else
                this.listenToOnce(this, 'sync', this.createFormFieldGenerator);

            //this.on('change:phoneVerification', this.activePhoneField, this);

            if (App.conf.server.type != 'prod')
                this.on('change', this.log, this);
        },

        activePhoneField: function () {
            if(this.get('phoneVerification') && this.forms) {
                this.forms.set('forms.fields.phone.show', true);
                this.forms.set('forms.fields.phone.required', true);
            }
        },

        unactivePhoneField: function () {
            if(!this.get('forms.fields.phone.required')) {
                this.set('phoneVerification', false);
            }
        },

        validate: function (attrs, options) {
            /** @todo проверить корректность регулярки*/
            var regURL = /^(https?:\/\/)?([\S\.]+)\.(\S{2,6}\.?)(\/[\S\.]*)*\/?$/;

            var errors = [];
            if (!attrs.global.site.url) {
                errors.push({
                    text: 'Вы не заполнили поле "Сайт, на котором будет использоваться модуль',
                    attr: 'global.site.url'
                });
            } else if (!regURL.test(attrs.global.site.url)) {
                errors.push({
                    text: 'Сайт не корректен',
                    attr: 'global.site.url'
                });
            }

            if (errors.length) return errors;
        },

        log: function () {
            console.log(this.toJSON());
        },

        createFormFieldGenerator: function() {
            var formsCollection;

            if (this.has('forms')) {
                formsCollection = this.toJSON().forms
            } else {
                var type = this.get('global.type');
                formsCollection = _.find(App.formTemplates, function(model){return model.type === type});
            }
            this.forms = new App.Collections.FormFieldGenerators(formsCollection);
            this.listenTo(this.forms, 'change', this.setFormConfig);
            this.listenTo(this.forms, 'change', this.unactivePhoneField);
            this.setFormConfig();
        },

        setFormConfig: function () {
            this.set('forms', this.forms.toJSON());
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

            if (this.get('layout.init.position') == 'fixed') {

                return  code;

            } else if (this.get('layout.init.position') == 'static') {

                if (this.get('layout.init.type') == 'button')
                    return this.getButtonDOM() + code;
                else if(this.get('layout.init.type') == 'form')
                    return this.getFormDOM() + code;

            } else {

                throw new Error("Не указано layout.init.type '" + this.get('layout.init.type') + "' проверьте конфигурацию");

            }
        }
    });

    App.Models.FormFieldGenerator = Backbone.Ribs.Model.extend({

        defaults: {
            "model": "client",
            "type":"calculation",
            "fields":{
                submit: {
                    name: 'submit',
                    sort: 999,
                    type: 'submit',
                    label: 'Кнопка отправки',
                    show: true,
                    text: 'Отправить заявку'
                }
            }
        },

        initialize: function() {

            //if (options && options.phoneVerification) {
            //    this.set('fields.phone.show', true);
            //    this.set('fields.phone.required', true);
            //}

            this.phoneCodesCollection = new App.Collections.PhoneCodes({model: App.Models.PhoneCode});

            var that = this;

            /** @todo надо перенести данные на сервер */
            this.phoneCodesCollection.set(App.codes);
            this.createPhoneCodes();
            /*this.phoneCodesCollection.fetch().then(function() {
                that.createPhoneCodes();
            });*/

            //this.fields = new App

            if (App.conf.server.type != 'prod')
                this.on('change', this.log, this);
        },

        createPhoneCodes: function () {
            this.phoneCodesAvailableCollection = new App.Collections.PhoneCodes(this.phoneCodesCollection.toJSON());
            this.phoneCodesNotAvailableCollection = new App.Collections.PhoneCodes(this.phoneCodesCollection.toJSON());
            this.setActivePhone();
        },

        setActivePhone: function () {
            if (this.has('fields.phone')) {
                if (this.has('fields.phone.available')) {
                    this.phoneCodesAvailableCollection.setActive($.parseJSON(this.get('fields.phone.available')));
                }
                if (this.has('fields.phone.notAvailable')) {
                    this.phoneCodesNotAvailableCollection.setActive($.parseJSON(this.get('fields.phone.notAvailable')));
                }
            }
        }
    });

    App.Collections.FormFieldGenerators = Backbone.Ribs.Collection.extend({
        model: App.Models.FormFieldGenerator,

        hasPhoneVerification: function(){
            this.find(function(model){
                return model.get('type') === 'code';
            })
        }
    });

    App.Views.CodeGeneratorForm = Backbone.Ribs.View.extend({

        el: $('#formCodeGenerator'),
        className: 'form-code-generator',
        template: 'formCodeGeneratorTpl',

        events: {
            "change input"        : "changed",
            "change select"       : "changed",
            "submit"              : "submit"
        },

        initialize: function () {
            this.$el.html(this.render());

            this.listenToOnce(this.model, 'sync', this.renderFormField);
            this.listenTo(this.model, 'sync', this.renderCode);
            this.listenTo(this.model, 'sync', this.showExample);
            this.listenTo(this.model, 'sync', this.showMassageSave);
            this.listenTo(this.model, 'change', this.setValue);
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

        renderStepsGenerator: function () {
            var phoneVerification = this.model.forms.hasPhoneVerification();
            App.stepsGeneratorView = new App.Views.StepsGenetatorView({phoneVerification: !!phoneVerification});
        },

        renderStepsTabs: function () {
            App.stepsTabView = new App.Views.StepsTabView({collection: this.model.forms});
            $('#steps').html(App.stepsTabView.el);
            App.stepsTabView.$el.tabs();
        },

        renderFormField: function() {
            this.renderStepsGenerator();
            this.renderStepsTabs();
            App.formFieldGeneratorView = new App.Views.FormFieldGeneratorCollection({ collection: this.model.forms });
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

        showExample: function(){
            App.example = new App.Views.Example({model: App.config});
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
                var $el = this.$el.find('[name="' + error.attr + '"]');

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
        template: 'formsGenerator',

        events: {
            "change input"        : "changed",
            "change select"       : "changed",
            "submit"              : "submit"
        },

        initialize: function () {
            this.$el.prop('id', 'step' + this.model.get('step'));
            this.render();

            this.listenTo(this.model, 'change', this.setValues);

            _.bindAll(this, 'changed');
        },

        render: function () {
            var that = this;
            App.Helpers.TemplateManager.get(this.template, function (template) {
                var temp = _.template(template);
                var data = that.model.toJSON();
                var html = temp(data);
                that.$el.html(html);
                that.fieldsCollection = new App.Views.Select({el: '[name="fields.phone.available"]', collection: that.model.phoneCodesAvailableCollection}).render();
                that.selectPhoneCodesAvailable = new App.Views.Select({el: '[name="fields.phone.available"]', collection: that.model.phoneCodesAvailableCollection}).render();
                that.selectPhoneCodesNotAvailable = new App.Views.Select({el: '[name="fields.phone.notAvailable"]', collection: that.model.phoneCodesNotAvailableCollection}).render();
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

            if (this.model.get('layout.init.position') == 'static') {

                if (this.model.get('layout.init.type') == 'button')
                    this.$el.html(this.model.getButtonDOM());

                else if (this.model.get('layout.init.type') == 'form')
                    this.$el.html(this.model.getFormDOM());

            } else this.$el.html('');

            UM.init({id: this.model.id});
        },

        unrender: function() {
            if(UM.configsCollection) {
                if(UM.layouts[this.model.id])
                    if (Array.isArray(UM.layouts[this.model.id]))
                        UM.layouts[this.model.id][0].unrender();
                    else
                        UM.layouts[this.model.id].unrender();

                if(UM.buttons[this.model.id] && UM.buttons[this.model.id].$el.hasClass('um-btn-start--fixed'))
                    UM.buttons[this.model.id].unrender();

                UM.configsCollection.reset();
            }
        }

    });

    App.Views.FormFieldGeneratorCollection = Backbone.Ribs.View.extend({
        className: 'form-field-generator-list',

        initialize: function() {
            this.collection.on('add', this.addOne, this);
            this.render();
        },

        render: function() {
            this.collection.each( this.addOne, this );
            return this;
        },

        addOne: function(model) {
            var view = new App.Views.FormFieldGenerator({ model: model });
            this.$el.append(view.el);
        }
    });

    var codeID = $('#formCodeGenerator').data('id');

    if(codeID){
        init({id: codeID});
    } else
        init();
});