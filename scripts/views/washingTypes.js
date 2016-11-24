/**
 *  Типы мойки
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-washingType-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.WashingType({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});