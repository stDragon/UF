/**
 *  Форма подтверждения телефона
 *  */

module.exports = Backbone.View.extend({

    tagName: 'form',
    className: 'um-form',
    template: 'formPhoneAuth',

    events: {
        'focus #umPhone': 'initMask',
        'input input': 'setAttr',
        'submit': 'save'
    },

    initialize: function () {
        this.render();
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

    save: function (e) {
        e.preventDefault();

        var data = {};
        this.$el.find('.um-form-control').each(function () {
            data[this.name] = $(this).val();
        });

        this.model.save(data, {
            error: function (model, error) {
                UM.ajaxError(error)
            }
        });
    },

    confirm: function () {
        if (this.model.get('confirm')) {
            UM.vent.trigger('page:showConfirm', this.model.get('configId'));
        } else {
            this.enabledSubmit();
            throw new Error("Сервер прислал некоректное значение confirm:'" + this.model.get('confirm'));
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