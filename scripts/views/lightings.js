/**
 *  Освещение
 *  */

module.exports = UM.Views.CheckboxList.extend({

    className: 'um-checkbox-content um-lighting-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.Lighting({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});