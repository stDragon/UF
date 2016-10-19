/**
 *  Конфигурирует универсальный модуль
 *  */

module.exports = Backbone.Ribs.Model.extend({
    defaults: {
        "global": {
            "debug": false,
            "type": "calculation",
            "server": {
                "url":UM.serverUrl,
                "type": "prod"
            }
        }
    },

    urlRoot: function () {
        return UM.serverUrl + '/conf/'
    },

    initialize: function (model, data) {
        this.data = data || {
                user: {
                    configId : this.id,
                    type : this.get('global.type')
                }
            };
        this.data.user.configId = this.id;

        this.on('sync', this.checkConfig, this);
        this.on('sync', this.initForm, this);
    },

    checkConfig: function () {
        try {
            if (!this.has('global.server.url'))
                throw new Error("Не указано имя сервера Мария global.server.url:'" + this.get('global.server.url') + "' проверьте конфигурацию");
            if (!this.has('global.site.url'))
                throw new Error("Не указано имя вашего сайта global.site.url:'" + this.get('global.site.url') + "' проверьте конфигурацию");
            if (!this.has('layout.init.type'))
                throw new Error("Не указан тип модуля layout.init.type:'" + this.get('layout.init.type') + "' проверьте конфигурацию");
            if (!this.has('layout.init.position'))
                throw new Error("Не указан способ инициализации layout.init.position:'" + this.get('layout.init.position') + "' проверьте конфигурацию");
            if (!this.testUrl()) {
                if (UM.conf.server.type == 'prod') {
                    throw new Error('Ваш сайт URL "' + window.location.hostname + '" не соответствует указанному в конфигураторе "' + this.get('global.site.url') +'"');
                } else {
                    console.warn('Ваш сайт URL "' + window.location.hostname + '" не соответствует указанному в конфигураторе "' + this.get('global.site.url') +'"');
                }
            }
            if (this.get('global.debug') || this.get('global.server.type') != "prod") {
                if (!this.get('layout.style'))
                    console.warn('Стили отключены');
            }

        } catch (err) {
            new UM.Models.Logger({message: String(err)});
            throw new Error(err);
        }

    },

    initForm: function () {
        this.data.user.type = this.get('global.type');

        /* Костыль для питера устанавливает аактивным */
        if (this.get('layout.style') === 'um-piter') {
            this.data.user.city = 'Санкт-Петербург';
            this.data.user.cityId = 1394549;
        }

        if (UM.formTypes.indexOf(this.get('global.type')) != -1) {
            this.form = new UM.Models.User(this.data.user, this.get('forms'));
        } else {
            var msgErr = "Тип заявки '" + this.get('global.type') + "' не поддерживается или не корректен";
            new UM.Models.Logger({message: String(msgErr)});
            throw new Error(msgErr);
        }
    },

    testUrl: function() {

        var regexp = new RegExp(String(this.get('global.site.url')), 'i');

        return regexp.test(window.location.hostname) ;
    }
});
