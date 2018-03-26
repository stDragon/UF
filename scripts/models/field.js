/**
 *  Поле формы
 *  */
module.exports = Backbone.Ribs.Model.extend({

    initialize: function() {
        if (this.get('name') === 'phone') {
            this.phoneCodesCollection = new UM.Collections.PhoneCodes({
                model: UM.Models.PhoneCode,
                url: function () {
                    return UM.dataUrl + '/phoneCodes'
                }
            });


            this.phoneCodesCollection.on('sync', function () {
                this.createPhoneCodes()
            }, this);
            this.phoneCodesCollection.fetch();
            /*
             var that = this;
             this.phoneCodesCollection.fetch().then(function() {
             that.createPhoneCodes();
             });
             */
        }
    },
    /**
     * Создает коллекцию кодов телефонов
     * @return {object}
     * */
    createPhoneCodes: function () {
        this.phoneCodesAvailableCollection = new UM.Collections.PhoneCodes(this.phoneCodesCollection.toJSON());
        this.phoneCodesNotAvailableCollection = new UM.Collections.PhoneCodes(this.phoneCodesCollection.toJSON());
        this.setActivePhone();
        return this;
    },
    /**
     * Выставляет активный телефон
     * @return {object}
     * */
    setActivePhone: function () {
        if (this.has('phone')) {
            if (this.has('phone.available')) {
                this.phoneCodesAvailableCollection.setActive($.parseJSON(this.get('phone.available')));
            }
            if (this.has('phone.notAvailable')) {
                this.phoneCodesNotAvailableCollection.setActive($.parseJSON(this.get('phone.notAvailable')));
            }
        }
        return this;
    }
});