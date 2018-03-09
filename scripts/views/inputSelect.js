/**
 *  Список
 *  */

module.exports = Backbone.View.extend({

    tagName: 'ul',
    className: 'um-dropdown-content',
    // className: 'um-dropdown-content um-hoodType-list',
    events: {
        'click li': 'hidden'
    },

    initialize: function () {
        this.render();
        this.collection.on('sync', this.render, this);
    },

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.InputSelectOption({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    },

    hidden: function () {
        this.$el.closest('.um-form-group').removeClass('um-open-select');
    }
});