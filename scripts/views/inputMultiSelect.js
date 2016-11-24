/**
 *  Список
 *  */

module.exports = Backbone.View.extend({

    tagName: 'ul',
    className: 'um-dropdown-content multiple-select-dropdown',
    events: {
        'click li': 'hidden'
    },

    initialize: function () {
        this.render();
        this.collection.on('sync', this.render, this);
    },

    hidden: function () {
        this.$el.closest('.um-form-group').removeClass('um-open-select');
    }
});