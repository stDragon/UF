module.exports = Backbone.View.extend({

    events: {
        'click': 'active'
    },

    tagName: "option",
    template: _.template('<%= name %>'),

    initialize: function (model, options) {
        if (typeof options !== 'undefined') {
            this.options = options;
            if (typeof options.template !== 'undefined') {
                this.template = options.template;
            }
        }
        this.render();

        this.model.on('change', this.render, this);
    },

    render: function () {

        if (this.model.get('active'))
            this.$el.attr('selected','selected');

        this.el.value = this.model.get(this.options.value);
        this.el.selected = this.model.get('active');
        this.$el.data('icon', this.model.get('img'));

        this.$el.html(this.template(this.model.toJSON()));

        return this;
    },

    active: function () {
        this.model.set('active', !this.model.get('active'));
    }
});