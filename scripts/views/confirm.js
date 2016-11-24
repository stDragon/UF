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
        UM.TemplateManager.get(this.template, function (template) {
            var html = $(template);
            that.$el.html(html);
        });

        var msg = "Пользователю показано окно с сообщением о принятой заявке. ";
        if (typeof that.options.id !== 'undefined') {
            msg += 'Форма: ' + that.options.id;
        }
        new UM.Models.Logger({message: String(msg)});

        return this;
    }
});