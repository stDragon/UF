/**
 *  Стиль кухни
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-kitchenStyle-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.KitchenStyle({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});