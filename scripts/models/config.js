/**
 *  Конфигурирует универсальный модуль
 *  */

module.exports = Backbone.Model.extend({
    defaults: {
        serverUrl: 'http://module.infcentre.ru',
        siteUrl: '',
        formType: 'calculation',
        style: '/public/css/um-material.css',
        initType: 'button',
        initPosition: 'fixed',
        showMap: false,
        showShop: false
    },

    urlRoot: function () {
        return UM.serverUrl + '/conf/'
    },

    initialize: function () {
        this.on('sync', this.checkConfig, this);
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
    }
});
