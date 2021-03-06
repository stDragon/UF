/**
 *  Нижние секции
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-lowerSection-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.LowerSection({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});