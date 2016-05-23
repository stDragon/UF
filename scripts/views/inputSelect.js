/**
 *  Список
 *  */

module.exports = Backbone.View.extend({

    tagName: 'ul',
    className: 'um-dropdown-content',
    events: {
        'click li': 'hidden'
    },

    initialize: function () {
        this.render();
        this.collection.on('change', this.hidden, this);
        this.collection.on('sync', this.render, this);
    },

    hidden: function () {
        this.$el.addClass('um-hidden');
    },

    show: function () {
        this.$el.removeClass('um-hidden');
    }
});