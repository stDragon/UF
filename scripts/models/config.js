/**
 *  Конфигурирует универсальный модуль
 *  */

module.exports = Backbone.Ribs.Model.extend({
    defaults: {
        serverUrl: UM.serverUrl,
        siteUrl: '',
        formType: '',
        formConfig: '',
        style: 'um-material',
        initType: 'button',
        initPosition: 'fixed',
        phoneVerification: true
    },

    urlRoot: function () {
        return UM.serverUrl + '/conf/'
    },

    initialize: function (model, data) {
        this.data = data || {
                user: {
                    configId : this.id,
                    type : this.get('formType')
                }
            };
        this.data.user.configId = this.id;

        this.on('sync', this.checkConfig, this);
        this.on('sync', this.initForm, this);
    },

    checkConfig: function () {
        try {
            if (!this.get('serverUrl'))
                throw new Error("Не указано имя сервера Мария serverUrl:'" + this.get('serverUrl') + "' проверьте конфигурацию");
            if (!this.get('siteUrl'))
                throw new Error("Не указано имя вашего сайта siteUrl:'" + this.get('siteUrl') + "' проверьте конфигурацию");
            if (!this.get('initType'))
                throw new Error("Не указан тип модуля initType:'" + this.get('initType') + "' проверьте конфигурацию");
            if (!this.get('initPosition'))
                throw new Error("Не указан способ инициализации initPosition:'" + this.get('initPosition') + "' проверьте конфигурацию");
            if (!this.testUrl()) {
                if (UM.conf.server.type == 'prod') {
                    throw new Error('Ваш сайт URL "' + window.location.hostname + '" не соответствует указанному в конфигураторе "' + this.get('siteUrl') +'"');
                } else {
                    console.warn('Ваш сайт URL "' + window.location.hostname + '" не соответствует указанному в конфигураторе "' + this.get('siteUrl') +'"');
                }
            }
            if (UM.conf.server.type != 'prod') {
                if (!this.get('style'))
                    console.warn('Стили отключены');
                if (!this.get('showMap'))
                    console.warn('Карта отключена');
            }

        } catch (err) {
            new UM.Models.Logger({message: String(err)});
            throw new Error(err);
        }

    },

    initForm: function () {
        this.data.user.type = this.get('formType');

        /* Костыль для питера устанавливает аактивным */
        if (this.get('style') === 'um-piter') {
            this.data.user.city = 'Санкт-Петербург';
            this.data.user.cityId = 1394549;
        }

        if (this.get('formType') == 'calculation' || this.get('formType') == 'measurement' || this.get('formType') == 'credit') {
            this.form = new UM.Models.User(this.data.user, this.get('formConfig'));
        } else {
            var msgErr = "Тип заявки '" + this.get('formType') + "' не поддерживается или не корректен";
            new UM.Models.Logger({message: String(msgErr)});
            throw new Error(msgErr);
        }
    },

    testUrl: function() {

        var regexp = new RegExp(String(this.get('siteUrl')), 'i');

        return regexp.test(window.location.hostname) ;
    }
});
