/**
 *  Конфигурирует универсальный модуль
 *  */

module.exports = Backbone.Ribs.Model.extend({
    defaults: {
        serverUrl: UM.serverUrl,
        siteUrl: '',
        formType: 'calculation',
        formConfig: '',
        style: 'um-material',
        initType: 'button',
        initPosition: 'fixed',
        phoneVerification: true
    },

    initialize: function (model, data) {
        this.data = data || {
                user: {
                    configId : this.id
                }
            };
        this.data.user.configId = this.id;

        this.on('sync', this.checkConfig, this);
        this.on('sync', this.initForm, this);
    },

    checkConfig: function () {
        if (!this.get('serverUrl'))
            throw new Error("Не указано имя сервера Мария serverUrl:'" + this.get('serverUrl') + "' проверьте конфигурацию");
        if (!this.get('siteUrl'))
            throw new Error("Не указано имя вашего сайта siteUrl:'" + this.get('siteUrl') + "' проверьте конфигурацию");
        if (!this.get('initType'))
            throw new Error("Не указан тип модуля initType:'" + this.get('initType') + "' проверьте конфигурацию");
        if (!this.get('initPosition'))
            throw new Error("Не указан способ инициализации initPosition:'" + this.get('initPosition') + "' проверьте конфигурацию");
        if (!this.get('style'))
            console.warn('Стили отключены');
        if (!this.get('showMap'))
            console.warn('Карта отключина');
    },

    initForm: function () {
        if (this.get('formType') == 'calculation') {
            this.form = new UM.Models.User(this.data.user, this.get('formConfig'));
            UM.forms[this.id] = this.form;
        } else {
            throw new Error("Тип заявки '" + this.get('formType') + "' не поддерживается или не корректен");
        }
    }
});
