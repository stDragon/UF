/**
 *  Материал столешницы
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-tabletopMaterial-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.TabletopMaterial({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});