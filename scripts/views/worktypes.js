/**
 *  Желаемая стоимость
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-worktype-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.Worktype({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});