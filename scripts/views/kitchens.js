/**
 *  Список студий
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-kitchen-list um-hidden',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.Kitchen({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});