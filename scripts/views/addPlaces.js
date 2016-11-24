/**
 *  Дополнительное рабочее место
 *  */

module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-addPlace-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.AddPlace({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});