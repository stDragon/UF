module.exports = Backbone.Ribs.View.extend({

    tagName: 'form',
    className: 'um-form',
    template: 'form',

    events: {
        'focus .um-dropdown-content + input': 'showOptionList',
        'change input': 'setAttrs',
        'change textarea': 'setAttrs',
        'change input:checkbox': 'changed',
        'click .um-static-select li': 'chooseValue',
        'submit': 'save'
    },

    initialize: function (options) {
        this.listenTo(this.model, 'invalid', this.invalid);
        this.listenTo(this.model, 'valid', this.valid);

        this.listenTo(this.model, 'request', function () {
            UM.helpers.vent.trigger('layout:showLoader', this.model.get('configId'));
            this.valid();
            this.disabledSubmit();
        });
        this.listenTo(this.model, 'sync', function () {
            UM.helpers.vent.trigger('layout:hideLoader', this.model.get('configId'));
            UM.helpers.vent.trigger('layout:showPhoneForm', this.model.get('configId'));
        });
        this.listenTo(this.model, 'error', function () {
            UM.helpers.vent.trigger('layout:hideLoader', this.model.get('configId'));
            this.enabledSubmit();
        });
    },

    changed: function(e) {
        var changed = e.currentTarget;

        var value;
        if (changed.type == 'checkbox') {
            value = changed.checked;
            if (changed.checked)
                $(changed).parent('label').addClass('um-checked');
            else
                $(changed).parent('label').removeClass('um-checked');
        } else {
            value = changed.value;
        }

        var obj = {};
        obj[changed.name] = value;
        /* кажется так делать не надо, но что поделать =) */
        this.model.set(obj);
        this.model.set(obj, {validate:true});
    },

    /** Запись в input выбранного значения статичного списка */
    chooseValue: function(e) {
        var list = $(e.target).parents('ul'),
            val = $(e.target).text(),
            input = list.siblings('input');

        input.val(val);
        list.parents('.um-form-group').removeClass('um-open-select');
        this.setAttrs();
    },

    /** Устанавливает значения полей формы*/
    setValue: function () {
        var attr = this.model.toJSON();
        _.each(attr, function (num, key) {
            this.$el.find('[name=' + key + ']').val(num);
        }, this);
        return this;
    },
    /**
     * Сохраняет изменения поля в модель.
     */
    setAttr: function (e) {
        var name = $(e.target).attr('name'),
            val = $(e.target).val();
        this.model.set(name, val);
        this.model.set(name, val, {validate:true});
    },
    /**
     * Сохраняет все поля в модель.
     */
    setAttrs: function () {
        var data = {};
        this.$el.find('.um-form-control').each(function () {
            data[this.name] = $(this).val();
        });

        this.model.set(data);
        this.model.set(data, {validate:true});
    },

    /**
     * Сохраняет все поля на сервер.
     */
    save: function (e) {
        e.preventDefault();

        var data = {};
        this.$el.find('.um-form-control').each(function () {
            data[this.name] = $(this).val();
        });

        this.model.save(data, {
            error: function (model, error) {
                UM.helpers.ajaxError(error)
            }
        });
    },

    showOptionList: function (e) {
        this.hiddenOptionList();
        $(e.target).closest('.um-form-group').addClass('um-open-select');
    },

    hiddenOptionList: function (e) {
        if (e) {
            $(e.target).closest('.um-form-group').removeClass('um-open-select');
        } else {
            this.$el.find('.um-form-group').removeClass('um-open-select');
        }
    },
    /**
     * Кнопка отправки становится неактивной
     */
    disabledSubmit: function () {
        this.$el.find('button:submit').prop('disabled', true);
    },
    /**
     * Кнопка отправки становится активной
     */
    enabledSubmit: function () {
        this.$el.find('button:submit').prop('disabled', false) ;
    },

    valid: function (attr) {
        if (typeof attr !== 'undefined') {
            var $el = this.$el.find('[name=' + attr + ']'),
                $group = $el.closest('.um-form-group');
            $group
                .removeClass('um-has-error')
                .addClass('um-has-success')
                .find('.um-tooltip').remove();
        } else {
            this.$el.find('input')
                .closest('.um-form-group').removeClass('um-has-error').addClass('um-has-success')
                .find('.um-tooltip').remove();
        }
    },
    /**
     * Вывод ошибок
     * @param  {object} model.
     * @param  {object} errors.
     */
    invalid: function (model, errors) {
        this.$el.find('input')
            .closest('.um-form-group').removeClass('um-has-error')
            .find('.um-tooltip').remove();

        _.each(errors, function (error) {
            var $el = this.$el.find('[name=' + error.attr + ']'),
                $group = $el.closest('.um-form-group');

            $group.addClass('um-has-error').removeClass('um-has-success');
            if (document.inputEncoding == "UTF-8") {
                var tooltip = new UM.Views.Tooltip({text: error.text});
                $group.find('.um-form-control').after(tooltip.el);
            }
        }, this);
    },
    /**
     * Формирует видемые данные формы в объект
     * return {object} attr
     */
    getVisibleFormControl: function () {
        var attr = {};
        this.$el.find('.um-form-control:visible').each(function () {
            attr[this.name] = $(this).val();
        });
        return attr;
    }
});