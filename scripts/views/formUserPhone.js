/**
 *  Форма подтверждения телефона
 *  */

module.exports = UM.Views.Form.extend({

    tagName: 'form',
    className: 'um-form',
    template: 'formPhoneAuth',

    initialize: function (options) {
        this.options = options;
        this.render();
        this.listenTo(this.model, 'change', this.setValue);
        this.listenTo(this.model, 'invalid', this.invalid);
        this.listenTo(this.model, 'request', function () {
            UM.vent.trigger('layout:showLoader', this.model.get('configId'));
            this.valid();
            this.disabledSubmit();
        });
        this.listenTo(this.model, 'sync', function () {
            UM.vent.trigger('layout:hideLoader', this.model.get('configId'));
            this.confirm();
        });
        this.listenTo(this.model, 'error', function (obj, name, callback) {
            UM.vent.trigger('layout:hideLoader', this.model.get('configId'));
            this.enabledSubmit();
            this.error(obj, name, callback);
        }, this);
    },

    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function (template) {
            var html = _.template(template, that.model.toJSON());
            that.$el.html(html);
        });
        return this;
    },

    confirm: function () {
        if (this.model.get('confirm')) {
            UM.vent.trigger('layout:showConfirm', this.model.get('configId'));
        } else {
            this.enabledSubmit();
            this.error(this.model);
            console.warn("Сервер прислал некоректное значение confirm:'" + this.model.get('confirm'));
        }
    },

    error: function (obj, name, callback) {
        var errors = [{
            text: "Не верный код",
            attr: 'code'
        }];
        this.model.set('code', '');
        this.invalid(this.model, errors);
    }
});