/**
 *  Кнопка инициализации универсального модуля
 *  */

module.exports = Backbone.View.extend({
    events: {
        'click': 'clicked'
    },

    clicked: function () {
        UM.helpers.vent.trigger('layout:show', this.model.id);
    }
});