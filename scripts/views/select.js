module.exports = Backbone.View.extend({

    initialize: function (model, options) {
        this.options = options;

        if (this.options.multiple) {
            this.collection.options.multiple = true;
        }

        this.collection.on('sync', this.render, this);
        this.collection.on('change', this.render, this)
    },

    render: function () {
        this.$el.append('<option disabled>Выберите опцию</option>');
        this.collection.each(function (model) {
            var view = new UM.Views.SelectOption({model: model},this.options);
            this.$el.append(view.render().el);
        }, this);
        this.$el.material_select();

        return this;
    }
});