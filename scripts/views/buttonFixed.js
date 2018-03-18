/**
 *  Кнопка фиксированная относительно окна браузера
 *  */

module.exports = UM.Views.Button.extend({
    className: 'um-btn um-btn-contrast um-btn-start--fixed',
    tagName: 'button',

    initialize: function () {
        this.render();
        this.$el.addClass(this.model.get('style'));
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
        UM.vent.trigger('layout:show', this.model.id);
        this.hide();
    }
});