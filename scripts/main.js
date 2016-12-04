var conf = require('../nconf.js');

$(document).ready(function() {
    window.validate_field = function(){}; //отмена встроенного валидатора Materialize
    /** @global */
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

            /**
             * В зависимости от наличия ID создаем новый или загружаем конфиг с сервера,
             * после синхронизации обновляем
             * */
            if (!this.id)
                this.createSteps();
            else
                this.listenToOnce(this, 'sync', this.createSteps);

            //this.on('change:phoneVerification', this.activePhoneField, this);

            if (App.conf.server.type != 'prod')
                this.on('all', function(eventName){this.log(eventName)}, this);
        },

        activePhoneField: function () {
            if(this.get('phoneVerification') && this.steps) {
                this.steps.set('steps.fields.phone.show', true);
                this.steps.set('steps.fields.phone.required', true);
            }
        },

        unactivePhoneField: function () {
            if(!this.get('steps.fields.phone.required')) {
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

        log: function (eventName) {
            console.log('Сработало событие: '+ eventName);
            console.log(this.toJSON());
        },
        /**
         * Создает коллекцию шагов и связывает ее с текущим конфигом
         * @return {App.Models.Config}
         * */
        createSteps: function() {
            var stepCollection;

            if (this.has('steps')) {
                stepCollection = this.get('steps');
            } else {
                stepCollection = this.getTemplateStep(this.get('global.type'));
            }
            this.steps = new App.Collections.Steps(stepCollection);
            this.setSteps();
            this.listenTo(this.steps, 'all', this.setSteps);
            //this.listenTo(this.steps, 'change', this.unactivePhoneField);

            return this;
        },
        /**
         * Создает коллекцию шагов и связывает ее с текущим конфигом
         * @param  {object} steps.
         * @return {App.Models.Config}
         * */
        setSteps: function (steps) {
            if (typeof steps !== 'undefined') {
                this.set('steps', steps);
            } else {
                this.set('steps', this.steps.toJSON());
            }
            return this;
        },
        /**
         * Создает DOM кнопки
         * @todo вынести текст и стили в конфиг
         * @return {string}
         * */
        getButtonDOM: function() {
            return '<button type="button" data-um-id="' + this.id + '" class="um-btn um-btn-contrast ' + this.get('style') + '">Заказать кухню</button>'
        },
        /**
         * @return {string} DOM элемент в котором будет рендарится форма
         * */
        getFormDOM: function() {
            return '<div data-um-id="' + this.id + '"></div>'
        },
        /**
         * @return {string} url конфига, зависит от сервера
         * */
        getScriptHref: function () {
            if (conf.server.url.type == 'dev')
                return '//' + conf.server.url + '/public/js/marya-um.full.js';
            else
                return '//' + conf.server.url + '/public/js/marya-um.js';
        },
        /**
         * @return {string} JS составляющая кода размещения на сайте, содержит полный скрипт
         * */
        getScript: function () {
            return '<script type="text/javascript" src="' + this.getScriptHref() + '"><\/script>' +
                '<script>UM.init(' + JSON.stringify(this.toJSON()) + ');<\/script>';
        },
        /**
         * @return {string} JS составляющая кода размещения на сайте, содержит полный скрипт, содержет только ID конфига
         * */
        getShortScript: function () {
            var data = {id: this.get('id')};
            return '<script type="text/javascript" src="' + this.getScriptHref() + '"><\/script>' +
                '<script>UM.init(' + JSON.stringify(data) + ');<\/script>';
        },
        /**
         * @param  {string} scriptType Тип кода, полный или короткий
         * @return {string} Код для размещения на сайте
         * */
        getCode: function (scriptType) {
            scriptType = scriptType || 'short';
            var code;
            if (scriptType == 'short')
                code = this.getShortScript();
            else
                code = this.getScript();

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
         * @return {object} Конфиг шагов из шаблона
         * */
        getTemplateStep: function (type) {
            return _.find(App.formTemplates, function(model){return model.type === type});
        },
        /** Добавляет шаг
         * @param  {string} type.
         * @return {App.Models.Config}
         * */
        addStep: function (type) {
            var phoneStep = this.steps.find(function(model){return model.get('type') === 'code'});

            var step = this.getTemplateStep(type);

            if(type === 'code' || typeof phoneStep === 'undefined')
                step.step = this.steps.length;
            else {
                step.step = this.steps.length - 1;
                phoneStep.set('step', this.steps.length);
            }

            this.steps.add(step);
            return this;
        },
        /** Удаляет шаг
         * @param  {number} step.
         * */
        removeStep: function (step) {
            this.steps.remove(this.steps.find(function(model){return model.get('step') === step}));
            return this;
        }
    });

    App.Models.PhoneCode = require('./models/phoneCode.js');
    App.Collections.PhoneCodes = require('./collections/phoneCodes.js');

    App.Models.Field =  require('./models/field.js');
    App.Collections.Field = require('./collections/fields.js');

    App.Models.FormTemplate = require('./models/formTemplate.js');
    App.Collections.FormTemplates = require('./collections/formTemplates.js');

    App.Models.Step = require('./models/step.js');
    App.Collections.Steps = require('./collections/steps.js');

    App.Views.SelectOption = require('./views/selectOption.js');
    App.Views.Select = require('./views/select.js');
    App.Views.TabLi = require('./views/tabLi.js');
    App.Views.ConfigGenerator = require('./views/configGenerator.js');
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
    /**
     * Запускает генератор, уже сохраненный или дефолтный
     * @param  {string|number} option.
     * */
    function init(option) {
        App.config = new App.Models.Config(option);
        if(option)
            App.config.fetch().then(function(){
                App.configGeneratorView = new App.Views.ConfigGenerator({model: App.config});
            });
        else {
            App.configGeneratorView = new App.Views.ConfigGenerator({model: App.config});
        }
    }

    var codeID = $('#formCodeGenerator').data('id');

    if(codeID){
        init({id: codeID});
    } else
        init();
});