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

        this.listenTo(this.form, 'change:city', this.unsetActive);
        this.listenTo(this.form, 'change:shop', this.formChanged);
    },

    url: function () {
        return UM.serverUrl + '/shops/' + this.options.configId || ''
    },
    /**
     * Создает новый экземпляр Shops по названию города.
     * @param  {string} cityId - Город который ищем.
     * @param  {object} option - Опции поиска.
     * @return {UM.Collections.Shops} Новый объект Shops.
     */
    filterByCity: function (cityId, option) {
        var filtered = this.filter(function (model) {
            if (option.default == true)
                return model.get("mr3cityid") === cityId || model.get("city") === 'all';

            return model.get("mr3cityid") === cityId;
        }, this);
        return new UM.Collections.Shops(filtered, this.options);
    },
    /**
     * Создает новый экземпляр Shops по названию города содержащих координаты для карты.
     * @param  {string} city - Студия которую ищем.
     * @return {UM.Collections.Shops} Новый объект Shops.
     */
    filterByCityForMap: function (city) {
        var filtered = this.filter(function (model) {
            return model.get("city") === city && model.get("lat") && model.get("lat");
        });
        return new UM.Collections.Shops(filtered, this.options);
    },

    getActive: function () {
        var active = this.find(function(model) {
            return model.get('active') == true;
        });
        if (active) {
            return active.toJSON();
        }
    },

    formChanged: function () {
        this.unsetActive();
        this.setActive();
    },

    setActive: function (active) {
        active = active || this.form.get('shopId');
        var shop = this.find(function(model) {
            return model.get('mr3id') == active;
        });
        if (shop)
            shop.set('active', true);
        return this;
    },

    unsetActive: function () {
        this.each(function (model) {
            model.set('active', false);
        }, this);
    }
});