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
            //this.listenTo(this.forms, 'change', this.unactivePhoneField);
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
        },
        /**
         * @param  {string} type.
         * */
        addStep: function (type) {
            var phoneStep = this.forms.find(function(model){return model.get('type') === 'code'});

            var step = _.find(App.formTemplates, function(model){return model.type === type});

            if(type === 'code' || typeof phoneStep === 'undefined')
                step.step = this.forms.length;
            else {
                step.step = this.forms.length - 1;
                phoneStep.set('step', this.forms.length);
            }

            App.config.forms.add(step);
        },
        /**
         * @param  {number} step.
         * */
        removeStep: function (step) {
            this.forms.remove(this.forms.find(function(model){return model.get('step') === step}));
            console.log(this.forms.toJSON());
        }
    });

    App.Models.PhoneCode = require('./models/phoneCode.js');
    App.Collections.PhoneCodes = require('./collections/phoneCodes.js');

    App.Models.Field =  require('./models/field.js');
    App.Collections.Field = require('./collections/fields.js');

    App.Models.FormTemplate = require('./models/formTemplate.js');
    App.Collections.FormTemplates = require('./collections/formTemplates.js');

    App.Models.FormFieldGenerator = require('./models/formFieldGenerator.js');
    App.Collections.FormFieldGenerators = require('./collections/formFieldGenerators.js');

    App.Views.SelectOption = require('./views/selectOption.js');
    App.Views.Select = require('./views/select.js');
    App.Views.TabLi = require('./views/tabLi.js');
    App.Views.CodeGeneratorForm = require('./views/codeGeneratorForm.js');
    App.Views.StepsTabView = require('./views/stepsTabView.js');
    App.Views.StepAddGenetator = require('./views/stepAddGenerator.js');
    App.Views.StepGenerator = require('./views/stepGenerator.js');
    App.Views.StepGeneratorCollection = require('./views/stepGeneratorCollection.js');
    App.Views.Field = require('./views/field.js');
    App.Views.Fields = require('./views/fields.js');
    App.Views.Example = require('./views/example.js');

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

    var codeID = $('#formCodeGenerator').data('id');

    if(codeID){
        init({id: codeID});
    } else
        init();
});