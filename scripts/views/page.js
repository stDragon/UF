/**
 *  Основное окно универсального модуля
 *  */

module.exports = Backbone.View.extend({

    tagName: 'article',
    className: 'um',

    events: {
        'click .um-close': 'hide'
    },

    initialize: function () {
        /** В фиксированном окне добваляется соответствующий класс DOM элементу */
        if (this.model.get('initType') == 'button' || this.model.get('initPosition') == 'fixed')
            this.$el.addClass('fixed');

        this.render(this.showStartForm());

        UM.vent.on('page:show', function (id) {
            if (id == this.model.id)
                this.show();
        }, this);

        UM.vent.on('page:showLoader', function (id) {
            if (id == this.model.id)
                this.render(this.showLoader());
        }, this);

        UM.vent.on('page:hideLoader', function (id) {
            if (id == this.model.id)
                this.render(this.hideLoader());
        }, this);

        UM.vent.on('page:showPhoneForm', function (id) {
            if (id == this.model.id) {
                if (this.model.get('phoneVerification') === true)
                    this.render(this.showPhoneForm());
                else
                    this.render(this.showConfirm());
            }
        }, this);

        UM.vent.on('page:showConfirm', function (id) {
            if (id == this.model.id)
                this.render(this.showConfirm());
        }, this);

        this.listenTo(this.model, 'destroy', this.unrender);
    },

    render: function (form) {
        /** В фиксированном окне добваляется кнопка закрытия окна */
        if (this.model.get('initType') == 'button' || this.model.get('initPosition') == 'fixed') {
            var close =
                '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="um-close">' +
                '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>' +
                '<path d="M0 0h24v24H0z" fill="none"/>' +
                '</svg>';
        }
        this.$el.html(form);
        this.$el.prepend(close);
        return this;
    },

    unrender: function () {
        this.remove(); // this.$el.remove()
    },

    show: function () {
        this.$el.removeClass('um-hidden');
    },

    hide: function () {
        this.$el.addClass('um-hidden');
        if (this.model.get('initType') == 'button') {
            UM.vent.trigger('button:show', this.model.id);
        }
    },

    /** Добавление прелоудера для обмена данными с сервером */
    initLoader: function () {
        this.laoder = new UM.Views.Loader();
        this.$el.prepend(this.laoder.el);
    },

    showLoader: function () {
        if (!this.laoder) {
            this.initLoader();
        }
        this.laoder.show();
    },

    hideLoader: function () {
        if (!this.laoder) {
            this.initLoader();
        }
        this.laoder.hide();
    },

    /**
     * Рендер выбранной в конфигураторе формы
     * */
    showStartForm: function () {
        if (this.model.get('formType') == 'calculation') {

            this.form = new UM.Models.User({configId: this.model.id});
            UM.forms[this.model.id] = this.form;
            this.formView = new UM.Views.CalculationForm({model: this.form});

            return this.formView.el;
        } else {
            throw new Error("Тип заявки '" + this.model.get('formType') + "' не поддерживается или не корректен");
        }
    },
    /**
     * Рендер формы подтверждения телефона
     * */
    showPhoneForm: function () {
        var phone = this.form.get('phone');
        this.phone = new UM.Models.Phone({
            user: UM.forms[this.model.id].id,
            phone: phone,
            configId: this.model.id
        });
        this.phoneView = new UM.Views.UserPhoneForm({model: this.phone});
        return this.phoneView.el;
    },
    /**
     * Рендер сообщения об оформлении заявки
     * */
    showConfirm: function () {
        this.confirmView = new UM.Views.Confirm();
        return this.confirmView.el;
    }
});