var conf = require('../nconf.js'),
    pjson = require('../package.json');

$(document).ready(function() {
    window.validate_field = function(){}; //отмена встроенного валидатора Materialize
    /** @global */
    window.UM = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {},
        Helpers: {},
        version: pjson.version,
        dataUrl: conf.server.url + conf.server.dataPrefix,
        conf: conf
    };

    UM.fields = require('../fields.js');
    UM.formTemplates = require('../formTemplates.js');

    UM.Models.Config = Backbone.Ribs.Model.extend({
        defaults: {
            global: {
                debug: false,
                type: 'calculation',
                server: UM.conf.server,
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
            return UM.dataUrl + '/conf/'
        },

        initialize: function () {

            /**
             * В зависимости от наличия ID создаем новый или загружаем конфиг с сервера,
             * после синхронизации обновляем
             * */
            if (this.id)
                this.listenToOnce(this, 'sync', this.createSteps);
            else
                this.createSteps();

            //this.on('change:phoneVerification', this.activePhoneField, this);

            if (UM.conf.server.type !== 'prod')
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
         * @return {UM.Models.Config}
         * */
        createSteps: function() {
            var stepCollection;

            if (this.has('steps')) {
                stepCollection = this.get('steps');
            } else {
                stepCollection = this.getTemplateStep(this.get('global.type'));
            }
            this.steps = new UM.Collections.Steps(stepCollection);
            this.setSteps();
            this.listenTo(this.steps, 'all', this.setSteps);
            //this.listenTo(this.steps, 'change', this.unactivePhoneField);

            return this;
        },
        /**
         * Создает коллекцию шагов и связывает ее с текущим конфигом
         * @param  {object} steps.
         * @return {UM.Models.Config}
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
            if (UM.conf.server.type === 'dev')
                return '//' + UM.conf.server.url + '/public/js/uf.js';
            else
                return '//' + UM.conf.server.url + '/public/js/uf.min.js';
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
            if (scriptType === 'short')
                code = this.getShortScript();
            else
                code = this.getScript();

            if (this.get('layout.init.position') === 'fixed') {

                return  code;

            } else if (this.get('layout.init.position') === 'static') {

                if (this.get('layout.init.type') === 'button')
                    return this.getButtonDOM() + code;
                else if(this.get('layout.init.type') === 'form')
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
            return _.find(UM.formTemplates, function(model){return model.type === type});
        },
        /** Добавляет шаг
         * @param  {string} type.
         * @return {UM.Models.Config}
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

    UM.Models.PhoneCode = require('./models/phoneCode.js');
    UM.Collections.PhoneCodes = require('./collections/phoneCodes.js');

    UM.Models.Field =  require('./models/field.js');
    UM.Collections.Field = require('./collections/fields.js');

    UM.Models.FormTemplate = require('./models/formTemplate.js');
    UM.Collections.FormTemplates = require('./collections/formTemplates.js');

    UM.Models.Step = require('./models/step.js');
    UM.Collections.Steps = require('./collections/steps.js');

    UM.Views.SelectOption = require('./views/selectOption.js');
    UM.Views.Select = require('./views/select.js');
    UM.Views.TabLi = require('./views/tabLi.js');
    UM.Views.ConfigGenerator = require('./views/configGenerator.js');
    UM.Views.StepsTabView = require('./views/stepsTabView.js');
    UM.Views.StepAddGenetator = require('./views/stepAddGenerator.js');
    UM.Views.StepGenerator = require('./views/stepGenerator.js');
    UM.Views.StepGeneratorCollection = require('./views/stepGeneratorCollection.js');
    UM.Views.Field = require('./views/field.js');
    UM.Views.Fields = require('./views/fields.js');
    UM.Views.Example = require('./views/example.js');

    /**
     *  Ajax подгрузка шаблона
     *  */
    UM.Helpers.TemplateManager = {
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
                    url: UM.conf.server.url + '/module/' + id,
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
        UM.config = new UM.Models.Config(option);
        if(option)
            UM.config.fetch().then(function(){
                UM.configGeneratorView = new UM.Views.ConfigGenerator({model: UM.config});
            });
        else {
            UM.configGeneratorView = new UM.Views.ConfigGenerator({model: UM.config});
        }
    }

    var codeID = $('#formCodeGenerator').data('id');

    if(codeID){
        init({id: codeID});
    } else
        init();
});