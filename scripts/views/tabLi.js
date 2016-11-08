module.exports = Backbone.Ribs.View.extend({

    tagName: 'li',
    className: 'tab col s3',
    template: _.template('<a href="#step<%= step %>">Шаг - <%= step + 1 %></a>'),

    initialize: function () {
        this.render();
        this.model.on('change', this.render, this);
        this.model.on('remove', this.remove, this);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    remove: function () {
        this.$el.remove();
    }
});
