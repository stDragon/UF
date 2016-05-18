/**
 *  Список студий
 *  */

module.exports = Backbone.View.extend({

    tagName: 'ul',
    className: 'um-dropdown-content um-shop-list',

    events: {
        'click li': 'hidden'
    },

    initialize: function () {
        this.render();

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