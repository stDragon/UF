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
        this.$el.siblings('input').prop('readonly', true).closest().addClass('um-select');
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