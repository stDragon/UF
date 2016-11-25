/**
 *  Список
 *  */

module.exports = Backbone.View.extend({

    tagName: 'ul',
    className: 'um-checkbox-content',
    events: {
        'click li': 'hidden'
    },

    initialize: function () {
        this.collection.options.multiple = true;
        this.render();
        this.collection.on('sync', this.render, this);
        this.collection.on('change', this.render, this);
    },

    hidden: function () {
        this.$el.closest('.um-form-group').removeClass('um-open-select');
    }
});