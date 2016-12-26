/**
 *  Столовая группа
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-diningGroup-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.DiningGroup({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});