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

        this.createFields();

        if (UM.conf.server.type != 'prod')
            this.on('all', function(eventName){this.log(eventName)}, this);
    },

    log: function (eventName) {
        console.log('Сработало событие: '+ eventName);
        console.log(this.toJSON());
    },
    /**
     * Создает коллекцию полей и связывает ее с текущим конфигом
     * @return {object}
     * */
    createFields: function () {
        this.newFieldCollection = new UM.Collections.Field(UM.fields);
        this.fieldCollection = new UM.Collections.Field(this.get('fields'));

        this.listenTo(this.fieldCollection, 'all', this.setFields);
        return this;
    },
    /**
     * Зписывает коллекцию полей
     * @return {object}
     * */
    setFields: function () {
        this.set('fields', this.fieldCollection.toJSON());
        return this;
    },
    /**
     * Добавляет поле формы
     * @param  {object} field.
     * @return {object}
     * */
    addField: function (field) {
        var newField = this.newFieldCollection.find(function(model){return model.get('name') == field});
        this.fieldCollection.add(newField);
        return this;
    }
});