/**
 *  Кнопка фиксированная относительно окна браузера
 *  */

module.exports = UM.Views.Button.extend({
    className: 'um-btn um-btn--raised um-btn-red um-btn-start--fixed',
    tagName: 'button',

    initialize: function () {
        this.render();
        UM.vent.on('button:show', function (id) {
            if (id == this.model.id)
                this.show();
        }, this);
    },

    render: function () {
        this.$el.html('Заказать кухню');
        return this;
    },

    unrender: function () {
        this.remove(); // this.$el.remove()
    },

    show: function () {
        this.$el.removeClass('um-hidden');
    },

    hide: function () {
        this.$el.addClass('um-hidden');
    },

    clicked: function () {
        UM.vent.trigger('page:show', this.model.id);
        this.hide();
    }
});