/**
 *  Коллекция стен
 *  @param {UM.Models.Config} options конфиг для получении коллекции.
 *  */

module.exports = Backbone.Collection.extend({
    model: UM.Models.HoodStyle,

    initialize: function (models, options) {
        if (options)
            this.options = options;

        /** связываем поле с формой */
        this.form = UM.forms[this.options.configId];

        this.listenTo(this.form, 'change:hoodStyle', this.formChanged);
    },

    url: function () {
        return '/api/hoodStyle/';
    },
    /**
     * Сортирует по названию
     * */
    comparator: function (model) {
        return model.get('name');
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

    setActive: function () {
        var active = this.form.get('city');
        var city = this.find(function(model) {
            return model.get('name') == active;
        });
        if (city)
            city.set('active', true);
    },

    unsetActive: function () {
        this.each(function (model) {
            model.set('active', false);
        }, this);
    },

    search : function(letters) {
        if(letters == "") return this;

        var pattern = new RegExp(letters,"gi");
        var filter = this.filter(function(data) {
            return pattern.test(data.get("name"));
        });

        return new UM.Collections.HoodStyle(filter, this.options) ;
    }
});