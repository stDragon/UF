/**
 *  Коллекция студий
 *  @param {UM.Models.Config} options конфиг для получении коллекции.
 *  */
module.exports = Backbone.Collection.extend({
    model: UM.Models.Shop,

    initialize: function (models, options) {
        if (options)
            this.options = options;

        /** связываем поле с формой */
        this.form = UM.forms[this.options.configId];

        this.listenTo(this.form, 'change', this.unsetActive)
    },

    url: function () {
        return UM.serverUrl + '/umdata/shops/' + this.options.configId || ''
    },
    /**
     * Создает новый экземпляр Shops по названию города.
     * @param  {string} city - Диаметр окружности.
     * @return {UM.Collections.Shops} Новый объект Shops.
     */
    filterByCity: function (city) {
        var filtered = this.filter(function (model) {
            return model.get("city") === city;
        });
        return new UM.Collections.Shops(filtered, this.options);
    },
    /**
     * Создает новый экземпляр Shops по названию города содержащих координаты для карты.
     * @param  {string} city - Диаметр окружности.
     * @return {UM.Collections.Shops} Новый объект Shops.
     */
    filterByCityForMap: function (city) {
        var filtered = this.filter(function (model) {
            return model.get("city") === city && model.get("lat") && model.get("lat");
        });
        return new UM.Collections.Shops(filtered, this.options);
    },

    unsetActive: function (form) {
        var active = form.get('city');
        this.each(function (model) {
            if (model.get('name') + ', ' + model.get('address') != active) {
                model.set('active', false);
            }
        }, this);
    }
});