/**
 *  Основное окно универсального модуля
 *  */

module.exports = Backbone.Ribs.View.extend({

    tagName: 'article',
    className: 'um',
    template: 'layoutTpl',

    events: {
        'click .um-close': 'hide'
    },

    initialize: function () {

        this.formView = [];
        this.$el
            .addClass(this.model.get('layout.style'))
            .addClass('um-' + this.model.get('global.type'));

        if (this.model.has('layout.class')) this.$el.addClass(this.model.get('layout.class'));

        /** В фиксированном окне добваляется соответствующий класс DOM элементу */
        if (this.model.get('layout.init.type') == 'button' || this.model.get('layout.init.position') == 'fixed')
            this.$el.addClass('fixed').attr('draggable', true);

        this.render().createForms().renderStep(this.showForm(0));

        UM.vent.on('layout:show', function (id) {
            if (id == this.model.id)
                this.show();
        }, this);

        UM.vent.on('layout:showLoader', function (id) {
            if (id == this.model.id)
                this.renderStep(this.showLoader());
        }, this);

        UM.vent.on('layout:hideLoader', function (id) {
            if (id == this.model.id)
                this.renderStep(this.hideLoader());
        }, this);

        UM.vent.on('layout:showPhoneForm', function (id) {
            if (id == this.model.id) {
                if (this.model.get('phoneVerification') === true)
                    this.renderStep(this.showPhoneForm());
                else
                    this.renderStep(this.showConfirm());
            }
        }, this);

        UM.vent.on('layout:showConfirm', function (id) {
            if (id == this.model.id)
                this.renderStep(this.showConfirm());
        }, this);

        this.listenTo(this.model, 'destroy', this.unrender);

        this.keyhandler();
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
    /**
     * Добавление прелоудера для обмена данными с сервером
     * */
    initLoader: function () {
        this.laoder = new UM.Views.Loader();
        this.$el.children('.um-header').prepend(this.laoder.el);
    },
    /**
     *  Показывает прелоудер
     *  */
    showLoader: function () {
        if (!this.laoder) {
            this.initLoader();
        }
        this.laoder.show();
        return this;
    },
    /**
     *  Скрывает прелоудер
     *  */
    hideLoader: function () {
        if (!this.laoder) {
            this.initLoader();
        }
        this.laoder.hide();
        return this;
    },
    /**
     *  Выводит информацию о текущем конфигев консоль
     *  */
    showInfoConsole: function() {
        var version = "1.0";
        window.cpd = console.info('Версия универсального модуля - "%s". Сервер хранения данных - "%s". Тип сервера - "%s". ID используемого конфига - "%s"', version, UM.conf.server.url, UM.conf.server.type, this.model.id);
        return this;
    },
    /**
     *  Выводит информацию о текущем конфиге в модальное окно
     *  */
    showInfoModal: function() {
        if (!this.modalInfoView) {
            var version = "1.0";
            var text = '<p>Версия универсального модуля - "'+version+'".</p>' +
                '<p>Сервер хранения данных - "<a href="'+UM.conf.server.url+'">'+UM.conf.server.url+'</a>".</p>' +
                '<p>Тип сервера - "'+UM.conf.server.type+'".</p>' +
                '<p>ID используемого конфига - "'+this.model.id+'"</p>';
            this.modalInfo = new UM.Models.Modal({'content': text, class: 'um-modal-info'});
            this.modalInfoView = new UM.Views.Modal({model: this.modalInfo});
            $('body').append(this.modalInfoView.el);
        }
        this.modalInfoView.show();
        return this;
    },
    /**
     *  Отлавливает сочитания клавиш для вывода информации о модуле
     *  */
    keyhandler: function () {
        var that = this;
        document.onkeydown = function(e){
            e = e || window.event;
            if(e.ctrlKey && e.altKey && e.keyCode == 77){ //ctrl+alt+m
                that.showInfoModal();
                return false;
            } else if(e.ctrlKey && e.keyCode == 77){ //ctrl+m
                that.showInfoConsole();
                return false;
            }
        }
    },
    createForms: function () {
        var that = this;
        _.each(this.model.get('forms'), function(element, index, list){
            if(element.type !== 'code')
                that.formView[index] = new UM.Views.FormUser({model: that.model.form}, element);
        });
        return this;
    },
    /**
     * Рендер формы
     * */
    showForm: function (step) {
        return this.formView[step].el;
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