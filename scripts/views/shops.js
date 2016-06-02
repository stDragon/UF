/**
 *  Список студий
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-shop-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.Shop({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});