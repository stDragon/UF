/**
 *  Конфигурирует универсальный модуль
 *  */

module.exports = Backbone.Ribs.Model.extend({
    defaults: {
        href: '',
        configId : '',
        message: ''
    },

    urlRoot: function () {
        return UM.dataUrl + '/log/'
    },

    initialize: function () {
        this.set('href',JSON.stringify(window.location.href));
        this.save();

        if (UM.conf.server.type != 'prod')
            this.log();
    },

    log: function () {
        console.log(this.toJSON());
    }
});
