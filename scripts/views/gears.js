/**
 *  Дополнительные механизмы
 *  */

module.exports = UM.Views.CheckboxList.extend({

    className: 'um-checkbox-content um-gear-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.Gear({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});