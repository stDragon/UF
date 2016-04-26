/**
 *  Список студий
 *  */

module.exports = Backbone.View.extend({

    tagName: 'ul',
    className: 'um-dropdown-content um-shop-list',

    initialize: function () {
        this.render();
        UM.vent.on('shopList:show', function (options) {
            if (this.collection.options.configId == options.configId)
                this.show();
        }, this);
        UM.vent.on('shopList:hide', function (options) {
            if (this.collection.options.configId == options.configId)
                this.hidden();
        }, this);
        this.collection.on('change', this.hidden, this);
    },

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.Shop({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    },

    hidden: function () {
        this.$el.addClass('um-hidden');
    },

    show: function () {
        this.$el.removeClass('um-hidden');
    }
});