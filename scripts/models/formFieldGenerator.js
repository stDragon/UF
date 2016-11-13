module.exports = Backbone.Ribs.Model.extend({

    defaults: {
        "model": "client",
        "type":"calculation",
        "fields":{
            submit: {
                name: 'submit',
                sort: 999,
                type: 'submit',
                label: 'Кнопка отправки',
                show: true,
                text: 'Отправить заявку'
            }
        }
    },

    initialize: function() {

        //if (options && options.phoneVerification) {
        //    this.set('fields.phone.show', true);
        //    this.set('fields.phone.required', true);
        //}

        this.newFieldCollection = new App.Collections.Field(App.fields);
        this.fieldCollection = new App.Collections.Field(this.get('fields'));
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

        this.listenTo(this.fieldCollection, 'change', this.setFields);

        if (App.conf.server.type != 'prod')
            this.on('change', this.log, this);
    },

    createPhoneCodes: function () {
        this.phoneCodesAvailableCollection = new App.Collections.PhoneCodes(this.phoneCodesCollection.toJSON());
        this.phoneCodesNotAvailableCollection = new App.Collections.PhoneCodes(this.phoneCodesCollection.toJSON());
        this.setActivePhone();
    },

    setActivePhone: function () {
        if (this.has('fields.phone')) {
            if (this.has('fields.phone.available')) {
                this.phoneCodesAvailableCollection.setActive($.parseJSON(this.get('fields.phone.available')));
            }
            if (this.has('fields.phone.notAvailable')) {
                this.phoneCodesNotAvailableCollection.setActive($.parseJSON(this.get('fields.phone.notAvailable')));
            }
        }
    },

    setFields: function () {
        this.set('fields', this.fieldCollection.toJSON());
    },

    addField: function (field) {
        var newField = this.newFieldCollection.find(function(model){return model.get('name') == field});
        this.fieldCollection.add(newField);
    },

    removeField: function (field) {
        this.unset('fields.'+field);
    }
});