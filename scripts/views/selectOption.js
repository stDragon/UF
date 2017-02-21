module.exports = Backbone.View.extend({

    events: {
        'click': 'active'
    },

    tagName: "option",
    template: _.template('<%= name %>'),

    initialize: function () {
        this.render();

        this.model.on('change', this.render, this);
    },

    render: function () {
        if (this.model.get('active'))
            this.$el.attr('selected','selected');

        this.el.value = this.model.get('isoCode');
        this.el.selected = this.model.get('active');
        this.$el.data('icon', this.model.get('img'));

        this.$el.html(this.template(this.model.toJSON()));

        return this;
    },

    active: function () {
        this.model.set('active', !this.model.get('active'));
    }
});