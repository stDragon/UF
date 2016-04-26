module.exports = Backbone.View.extend({

    events: {
        'click': 'active'
    },

    tagName: "li",
    template: _.template('<span><%= name %>, <%= address %></span>'),

    initialize: function () {
        this.render();
        this.model.on('change', this.render, this);
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

    active: function () {
        if (this.model.get('active'))
            UM.vent.trigger('shopList:hide', this.options.configId);
        else {
            this.model.set('active', true);

            var shopName = this.model.get('name') + ', ' + this.model.get('address');

            UM.vent.trigger('user:setShop', shopName);
        }

    }
});