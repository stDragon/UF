module.exports = Backbone.View.extend({

    events: {
        'click': 'active'
    },

    tagName: "li",
    template: _.template('<span><%= name %></span>'),

    initialize: function () {
        this.render();
        this.model.on('change', this.render, this);
        this.model.on('remove', this.unrender, this);
    },

    render: function () {
        var active = this.model.get('active');

        if (active)
            this.$el.addClass('active');
        else
            this.$el.removeClass('active');

        this.$el.html(this.template(this.model.toJSON()));

        return this;
    },

    unrender: function () {
        this.remove(); // this.$el.remove()
    },

    active: function () {
        if (!this.model.get('active')) {
            this.model.collection.unsetActive();
            this.model.set('active', true);
            this.model.trigger('active');
        }
    }
});