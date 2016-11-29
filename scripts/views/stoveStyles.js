/**
 *  Стиль кухонной плиты
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-stoveStyle-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.StoveStyle({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});