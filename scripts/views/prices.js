/**
 *  Желаемая стоимость
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-price-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.Price({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});