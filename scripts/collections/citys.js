/**
 *  Коллекция городов
 *  @param {UM.Models.Config} options конфиг для получении коллекции.
 *  */

module.exports = Backbone.Collection.extend({
    model: UM.Models.City,

    initialize: function (models, options) {
        if (options)
            this.options = options;

        /** связываем поле с формой */
        this.form = UM.forms[this.options.configId];

        this.listenTo(this.form, 'change', this.unsetActive);
    },

    url: function () {
        return UM.serverUrl + '/cities/' + this.options.configId || ''
    },
    /**
     * Сортирует по названию города
     * */
    comparator: function (model) {
        return model.get('name');
    },

    unsetActive: function (form) {
        var active = form.get('city');
        this.each(function (model) {
            if (model.get('name') != active) {
                model.set('active', false);
            }
        }, this);
    }
});