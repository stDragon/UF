/**
 *  Окно "заявка уже отправлялась"
 *  */
module.exports = Backbone.View.extend({

    className: 'um-order-warning',
    template: 'warning',

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
        var msg = "Пользователю показано окно с сообщением об ошибке. ";
        if (typeof that.options.userEmail !== 'undefined') {
            msg += 'Email пользователя: ' + that.options.userEmail;
        }
        new UM.Models.Logger({configId: configId, message: String(msg)});

        return this;
    }
});