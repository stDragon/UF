/**
 *  Список городов
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-city-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.City({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});