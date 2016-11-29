/**
 *  Дополнительные механизмы
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-gear-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.Gear({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});