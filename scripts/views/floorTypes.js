/**
 *  Тип пола
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-floorType-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.FloorType({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});