module.exports = Backbone.Ribs.View.extend({
    events: {
        'focus .um-dropdown-content + input': 'showOptionList',
        'change input': 'setAttrs',
        'change textarea': 'setAttrs',
        'change input:checkbox': 'changed',
        'click .um-static-select li': 'chooseValue',
        'input [name="name"]' : 'parseName',
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
        } else if (changed.type == 'file') {
            value = changed[0].files[0];
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
            if(key == "gear" || key == 'lighting') {
                var checked = [];
                this.$el.find('[name=' + key + ']').parent('label').each(function () {
                    if($(this).hasClass('um-checked')) {
                        checked[checked.length] = $(this).text();
                    }
                });
                this.$el.find('[name=' + key + ']').val(checked.join());
            } else if(key != 'file') {
                this.$el.find('[name=' + key + ']').val(num);
            }
        }, this);
    },
    /**
     * Сохраняет изменения поля в модель.
     */
    setAttr: function (e) {
        var name = $(e.target).attr('name'),
            val = (name != 'file') ? $(e.target).val() : $(e.target)[0].files[0];

        this.model.set(name, val);
        this.model.set(name, val, {validate:true});
    },
    /**
     * Сохраняет все поля в модель.
     */
    setAttrs: function () {
        var data = {};
        this.$el.find('.um-form-control').each(function () {
            data[this.name] = (this.name != 'file') ? $(this).val() : $(this)[0].files[0];
        });

        this.model.set(data);
        this.model.set(data, {validate:true});
    },

    /**
     * При объедининеии полей Фамилия и Имя при вводе значения с клавиатуры разделяет значения имени и фамилии
     */
    parseName: function(e) {
        var val = ($(e.target).val()).trim(),
            id = $(e.target).attr('id'),
            i = val.trim().indexOf(' '),
            surname = val.substr(0, i),
            name = val.substr((i + 1), val.length);

        this.$el.find('[name=surname]').val(surname);
        this.$el.find('[name=firstName]').val(name);
        this.setAttrs();
    },

    /**
     * Сохраняет все поля на сервер.
     */
    save: function (e) {
        e.preventDefault();

        var data = {};
        this.$el.find('.um-form-control').each(function () {
            data[this.name] = (this.name != 'file') ? $(this).val() : $(this)[0].files[0];
        });

        if (data['city'] != '' || typeof data['city'] !== 'undefined' && typeof this.model.get('cityId') !== 'undefined') {
            var city = this.model.cityCollection.find(function(city) {return city.get('name') == data['city']});
            data['cityId'] = city.get('mr3id');
        }
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
                .find('.um-tooltip').remove();
        } else {
            this.$el.find('input')
                .closest('.um-form-group').removeClass('um-has-error').addClass('um-has-success')
                .find('.um-tooltip').remove();
        }
        this.enabledSubmit();
    },
    /**
     * Вывод ошибок
     * @param  {object} model.
     * @param  {object} errors.
     */
    invalid: function (model, errors) {
        this.disabledSubmit();
        this.$el.find('input')
            .closest('.um-form-group').removeClass('um-has-error')
            .find('.um-tooltip').remove();
        _.each(errors, function (error) {
            var $el = this.$el.find('[name=' + error.attr + ']'),
                $group = $el.closest('.um-form-group');

            $group.addClass('um-has-error').removeClass('um-has-success');
            if (document.inputEncoding == "UTF-8") {
                var tooltip = new UM.Views.Tooltip();
                tooltip.$el.html(error.text);
                $group.find('.um-form-control').after(tooltip.el);
            }
        }, this);
    },
    /**
     * Формирует видимые данные формы в объект
     * return {object} attr
     */
    getVisibleFormControl: function () {
        var attr = {};
        this.$el.find('.um-form-control:visible').each(function () {
            attr[this.name] = (this.name != 'file') ? $(this).val() : $(this)[0].files[0];
        });
        return attr;
    }
});