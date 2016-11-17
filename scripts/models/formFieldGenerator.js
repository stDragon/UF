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

        this.listenTo(this.fieldCollection, 'add', this.setFields);
        this.listenTo(this.fieldCollection, 'change', this.setFields);

        if (App.conf.server.type != 'prod')
            this.on('change', this.log, this);
    },

    setFields: function () {
        this.set('fields', this.fieldCollection.toJSON());
    },

    addField: function (field) {
        var newField = this.newFieldCollection.find(function(model){return model.get('name') == field});
        this.fieldCollection.add(newField);
    },

    removeField: function (field) {
        this.unset(field);
    }
});