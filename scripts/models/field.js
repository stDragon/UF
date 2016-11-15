/**
 *  Поле формы
 *  */
module.exports = Backbone.Ribs.Model.extend({
    defaults: {
        name: 'submit',
        sort: 100,
        type: 'submit',
        label: 'Кнопка отправки',
        show: true,
        text: 'Отправить заявку'
    },

    initialize: function() {
        if (this.get('name') === 'phone') {
            this.phoneCodesCollection = new App.Collections.PhoneCodes({model: App.Models.PhoneCode});

            /** @todo надо перенести данные на сервер */
            this.phoneCodesCollection.set(App.codes);
            this.createPhoneCodes();
            /*
             var that = this;
             this.phoneCodesCollection.fetch().then(function() {
             that.createPhoneCodes();
             });
             */
            }
    },

    createPhoneCodes: function () {
        this.phoneCodesAvailableCollection = new App.Collections.PhoneCodes(this.phoneCodesCollection.toJSON());
        this.phoneCodesNotAvailableCollection = new App.Collections.PhoneCodes(this.phoneCodesCollection.toJSON());
        this.setActivePhone();
    },

    setActivePhone: function () {
        if (this.has('phone')) {
            if (this.has('phone.available')) {
                this.phoneCodesAvailableCollection.setActive($.parseJSON(this.get('phone.available')));
            }
            if (this.has('phone.notAvailable')) {
                this.phoneCodesNotAvailableCollection.setActive($.parseJSON(this.get('phone.notAvailable')));
            }
        }
    }
});