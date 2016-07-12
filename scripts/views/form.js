module.exports = Backbone.Ribs.View.extend({
    events: {
        'input input': 'setAttrs',
        'focus .um-dropdown-content + input': 'showOptionList',
        'blur input': 'setAttr',
        'blur textarea': 'setAttr',
        'change input:checkbox': 'changed',
        'click .um-static-select li': 'chooseValue',
        'input #umName' : 'parseName',
        'submit': 'save'
    },

    initialize: function () {
        this.listenTo(this.model, 'invalid', this.invalid);
        this.listenTo(this.model, 'valid', this.valid);

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
            if(this.name == 'userName') return;
            data[this.name] = $(this).val();
        });

        this.model.set(data);
        this.model.set(data, {validate:true});
    },

    /**
     * При объедининеии полей Фамилия и Имя при вводе значения с клавиатуры разделяет значения имени и фамилии
     */
    parseName: function(e) {
        var val = $(e.target).val(),
            id = $(e.target).attr('id'),
            i = val.trim().indexOf(' '),
            surname = val.substr(0, i),
            name = val.substr((i + 1), val.length);

        $('#umSurname').val(surname);
        $('#umFirstname').val(name);
    },

    /**
     * Сохраняет все поля на сервер.
     */
    save: function (e) {
        e.preventDefault();

        var data = {};
        this.$el.find('.um-form-control').each(function () {
            if(this.name == 'userName') return;
            data[this.name] = $(this).val();
        });

        this.model.save(data, {
            error: function (model, error) {
                UM.ajaxError(error)
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
        this.$el.find('button:submit')[0].disabled = true;
    },
    /**
     * Кнопка отправки становится активной
     */
    enabledSubmit: function () {
        this.$el.find('button:submit')[0].disabled = false;
    },

    valid: function (attr) {
        if (typeof attr !== 'undefined') {
            var $el = this.$el.find('[name=' + attr + ']'),
                $group = $el.closest('.um-form-group');
            $group
                .removeClass('um-has-error')
                .addClass('um-has-success')
                .children('.um-tooltip').remove();
        } else {
            this.$el.find('input')
                .closest('.um-form-group').removeClass('um-has-error').addClass('um-has-success')
                .children('.um-tooltip').remove();
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
            .children('.um-tooltip').remove();
        _.each(errors, function (error) {
            var $el = this.$el.find('[name=' + error.attr + ']'),
                $group = $el.closest('.um-form-group');

            $group.addClass('um-has-error').removeClass('um-has-success');
            var tooltip = new UM.Views.Tooltip();
            tooltip.$el.html(error.text);
            $group.append(tooltip.el);
        }, this);
    }
});