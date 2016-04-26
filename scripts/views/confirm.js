/**
 *  Окно "заказ принят на обработку"
 *  */
module.exports = Backbone.View.extend({

    className: 'um-order-confirm',
    template: 'confirm',

    initialize: function () {
        this.render();
    },

    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function (template) {
            var html = $(template);
            that.$el.html(html);
        });
        return this;
    }
});