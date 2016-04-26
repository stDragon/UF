/**
 *  Кнопка инициализации универсального модуля
 *  */

module.exports = Backbone.View.extend({
    events: {
        'click': 'clicked'
    },

    clicked: function () {
        UM.vent.trigger('page:show', this.model.id);
    }
});