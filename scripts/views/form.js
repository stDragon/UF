module.exports = Backbone.Ribs.View.extend({
    events: {
        'input input': 'setAttrs',
        'focus .um-dropdown-content + input': 'showOptionList',
        'blur input': 'setAttr',
        'blur textarea': 'setAttr',
        'change input:checkbox': 'changed',
        'submit': 'save'
    },

    initialize: function () {
        this.listenTo(this.model, 'invalid', this.invalid);

        this.listenTo(this.model, 'request', function () {
            UM.vent.trigger('page:showLoader', this.model.get('configId'));
            this.valid();
            this.disabledSubmit();
        });
        this.listenTo(this.model, 'sync', function () {
            UM.vent.trigger('page:hideLoader', this.model.get('configId'));
            UM.vent.trigger('page:showPhoneForm', this.model.get('configId'));
        });
        this.listenTo(this.model, 'error', function () {
            UM.vent.trigger('page:hideLoader', this.model.get('configId'));
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
        this.model.set(obj);
    },

    /** Устанавливает значения полей формы*/
    setValue: function () {
        var attr = this.model.toJSON();
        _.each(attr, function (num, key) {
            this.$el.find('[name=' + key + ']').val(num);
        }, this);
    },
    /**
     * Сохраняет изменения поля в модель.
     */
    setAttr: function (e) {
        var name = $(e.target).attr('name'),
            val = $(e.target).val();
        this.model.set(name, val);
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

        this.model.save(data);
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
        this.$el.find('button:submit')[0].disabled = true;
    },
    /**
     * Кнопка отправки становится активной
     */
    enabledSubmit: function () {
        this.$el.find('button:submit')[0].disabled = false;
    },

    valid: function () {
        this.$el.find('input')
            .closest('.um-form-group').removeClass('um-has-error')
            .children('.um-tooltip').remove();
    },
    /**
     * Вывод ошибок
     * @param  {object} model.
     * @param  {object} errors.
     */
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
    }
});