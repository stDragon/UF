/**
 *  Окно "заказ принят на обработку"
 *  */
module.exports = Backbone.View.extend({

    className: 'um-order-confirm',
    template: 'confirm',

    initialize: function (model, options) {
        this.options = options;
        this.render();
    },

    render: function () {
        var that = this;
        UM.helpers.templateManager.get(this.template, function (template) {
            var html = $(template);
            that.$el.html(html);
        });

        var configId = (typeof that.options.id !== 'undefined') ? that.options.id : "";
        var msg = "Пользователю показано окно с сообщением о принятой заявке. ";
        if (typeof that.options.userId !== 'undefined') {
            msg += 'Id пользователя: ' + that.options.userId;
        }
        new UM.Models.Logger({configId: configId, message: String(msg)});

        return this;
    }
});