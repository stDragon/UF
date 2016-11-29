module.exports = Backbone.View.extend({

    events: {
        'click': 'active'
    },

    tagName: "li",
    template: _.template('<span><%= name %></span>'),

    initialize: function () {
        this.render();
        //this.model.on('change', this.render, this);
        this.model.on('remove', this.unrender, this);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;
    },

    unrender: function () {
        this.remove(); // this.$el.remove()
    }
});