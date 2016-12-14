/**
 *  Форма подтверждения телефона
 *  */

module.exports = Backbone.View.extend({

    tagName: 'form',
    className: 'um-form',
    template: 'formPhoneAuth',

    events: {
        'focus #umPhone': 'initMask',
        'submit': 'save'
    },

    initialize: function (model, options) {
        this.options = options;
        this.render().shownPhoneVerification();
        this.listenTo(this.model, 'change', this.setValue);
        this.listenTo(this.model, 'invalid', this.invalid);
        this.listenTo(this.model, 'request', function () {
            UM.vent.trigger('page:showLoader', this.model.get('configId'));
            this.valid();
            this.disabledSubmit();
        });
        this.listenTo(this.model, 'sync', function () {
            UM.vent.trigger('page:hideLoader', this.model.get('configId'));
            this.confirm();
        });
        this.listenTo(this.model, 'error', function (obj, name, callback) {
            UM.vent.trigger('page:hideLoader', this.model.get('configId'));
            this.enabledSubmit();
            this.error(obj, name, callback);
        }, this);
    },

    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function (template) {
            var temp = _.template(template);
            var html = $(temp(that.model.toJSON()));
            that.$el.html(html);
        });
        var configId = (typeof that.options.id !== 'undefined') ? that.options.id : "";
        var msg = "Пользователю показано окно подтверждения телефона. ";
        if (typeof that.options.userId !== 'undefined') {
            msg += 'Id пользователя: ' + that.options.userId;
        }
        new UM.Models.Logger({configId: configId, message: String(msg)});
        return this;
    },

    setValue: function () {
        var attr = this.model.toJSON();
        _.each(attr, function (num, key) {
            this.$el.find('[name=' + key + ']').val(num);
        }, this);
    },

    disabledSubmit: function () {
        this.$el.find('button:submit')[0].disabled = true;
    },

    enabledSubmit: function () {
        this.$el.find('button:submit')[0].disabled = false;
    },

    valid: function () {
        this.$el.find('input')
            .closest('.um-form-group').removeClass('um-has-error')
            .children('.um-tooltip').remove();
    },

    invalid: function (model, errors) {
        this.$el.find('input')
            .closest('.um-form-group').removeClass('um-has-error')
            .children('.um-tooltip').remove();
        _.each(errors, function (error) {
            var $el = this.$el.find('[name=' + error.attr + ']'),
                $group = $el.closest('.um-form-group');

            $group.addClass('um-has-error');
            var tooltip = new UM.Views.Tooltip();
            tooltip.$el.html(error.text);
            $group.append(tooltip.el);
        }, this);
    },


    /**
     * Показан шаг с подтверждением телефона
     * */
    shownPhoneVerification: function (id) {
        console.log("shownPhoneVerification");
        return this;
    },

    save: function (e) {
        e.preventDefault();

        var data = {};
        this.$el.find('.um-form-control').each(function () {
            data[this.name] = (this.name != 'file') ? $(this).val() : $(this)[0].files[0];
        });

        var userId = this.options.userId;
        var configId = (typeof this.options.id !== 'undefined') ? this.options.id : "";
        this.model.save(data, {
            error: function (model, error) {
                UM.ajaxError(error);
                var msg = "Пользователь отправил неверный код подтверждения телефона. ";
                if (typeof userId !== 'undefined') {
                    msg += 'Id пользователя: ' + userId + ', код: ' + data.code;
                }
                new UM.Models.Logger({configId: configId, message: String(msg)});
            },
            success: function(model, response) {
                var msg = "Пользователь отправил верный код подтверждения телефона. ";
                if (typeof userId !== 'undefined') {
                    msg += 'Id пользователя: ' + userId + ', код: ' + data.code;
                }
                new UM.Models.Logger({configId: configId, message: String(msg)});
            }
        });
    },

    confirm: function () {
        if (this.model.get('confirm')) {
            UM.vent.trigger('page:showConfirm', this.model.get('configId'));
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