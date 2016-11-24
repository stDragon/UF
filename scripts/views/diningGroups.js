/**
 *  Верхние секции
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-upperSection-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.UpperSection({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});