module.exports = UM.Views.InputSelect.extend({

    className: 'um-dropdown-content um-code-list',

    render: function () {
        this.collection.each(function (model) {
            var view = new UM.Views.PhoneCode({model: model});
            this.$el.append(view.render().el);
        }, this);

        return this;
    }
});