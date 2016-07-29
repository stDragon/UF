/**
 *  Основное окно универсального модуля
 *  */

module.exports = Backbone.Ribs.View.extend({

    tagName: 'article',
    className: 'um',
    template: 'pageTpl',

    events: {
        'click .um-close': 'hide'
    },

    initialize: function () {

        this.$el
            .addClass(this.model.get('style'))
            .addClass('um-' + this.model.get('formType'));

        if (this.model.get('class')) this.$el.addClass(this.model.get('class'));

        /** В фиксированном окне добваляется соответствующий класс DOM элементу */
        if (this.model.get('initType') == 'button' || this.model.get('initPosition') == 'fixed')
            this.$el.addClass('fixed').attr('draggable', true);

        this.render();

        UM.vent.on('page:show', function (id) {
            if (id == this.model.id)
                this.show();
        }, this);

        UM.vent.on('page:showLoader', function (id) {
            if (id == this.model.id)
                this.renderStep(this.showLoader());
        }, this);

        UM.vent.on('page:hideLoader', function (id) {
            if (id == this.model.id)
                this.renderStep(this.hideLoader());
        }, this);

        UM.vent.on('page:showPhoneForm', function (id) {
            if (id == this.model.id) {
                if (this.model.get('phoneVerification') === true)
                    this.renderStep(this.showPhoneForm());
                else
                    this.renderStep(this.showConfirm());
            }
        }, this);

        UM.vent.on('page:showConfirm', function (id) {
            if (id == this.model.id)
                this.renderStep(this.showConfirm());
        }, this);

        this.listenTo(this.model, 'destroy', this.unrender);
    },

    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function (template) {
            var temp = _.template(template);
            var html = $(temp(that.model.toJSON()));
            that.$el.html(html);
            that.$el.children('.um-body').html(that.showStartForm());
            setTimeout(function(){
                UM.vent.trigger('form.added', that.model.id);
            }, 1000);
        });
        return this;
    },

    renderStep: function (form) {
        this.$el.children('.um-body').html(form);
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
        this.$el.children('.um-header').prepend(this.laoder.el);
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
        if (this.model.form) {
            if (this.model.get('formType') == 'calculation'
                || this.model.get('formType') == 'measurement'
                || this.model.get('formType') == 'credit') {

                this.formView = new UM.Views.FormUser({model: this.model.form});

                return this.formView.el;
            } else {
                throw new Error("Тип заявки '" + this.model.get('formType') + "' не поддерживается или не корректен");
            }
        }
    },
    /**
     * Рендер формы подтверждения телефона
     * */
    showPhoneForm: function () {
        var phone = this.model.form.get('phone');
        this.phone = new UM.Models.Phone({
            user: UM.forms[this.model.id].id,
            phone: phone,
            configId: this.model.id
        });
        this.phoneView = new UM.Views.FormUserPhone({model: this.phone});
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