/**
 *  Расположение кухонного гарнитура
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-position-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.Position({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});