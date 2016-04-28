/**
 *  Клиент оформивший заявку
 *  */

module.exports = Backbone.Model.extend({
    defaults: {
        surname: '',
        firstName: '',
        email: '',
        phone: '',
        city: '',
        shop: '',
        wishes: '',
        personalData: true
    },

    urlRoot: function () {
        return UM.serverUrl + '/umclient/add/'
    },

    validate: function (attrs, options) {
        var emailFilter = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
            lettersFilter = /^[а-яА-ЯёЁa-zA-Z]{1,20}$/,
            phoneFilter = /((8|\+7)-?)?\(?\d{3}\)?-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}/;

        var errors = [];
        if (!attrs.firstName) {
            errors.push({
                text: "Вы не заполнили имя",
                attr: 'firstName'
            });
        } else if (!lettersFilter.test(attrs.firstName)) {
            errors.push({
                text: "Имя должно содержать только буквы",
                attr: 'firstName'
            });
        }
        //if (!attrs.surname) {
        //    errors.push({
        //        text: "Вы не заполнили фамилию",
        //        attr: 'surname'
        //    });
        //} else if (!lettersFilter.test(attrs.surname)) {
        //    errors.push({
        //        text: "Фамилия должна содержать только буквы",
        //        attr: 'surname'
        //    });
        //}
        if (!attrs.email) {
            errors.push({
                text: "Вы не заполнили электронную почту",
                attr: 'email'
            });
        } else if (!emailFilter.test(attrs.email)) {
            errors.push({
                text: "Почтовый адресс не коректен",
                attr: 'email'
            });
        }
        if (!attrs.phone) {
            errors.push({
                text: "Вы не заполнили телефон",
                attr: 'phone'
            });
        } else if (!phoneFilter.test(attrs.phone)) {
            errors.push({
                text: "Телефон не коректен",
                attr: 'phone'
            });
        }
        if (!attrs.city) {
            errors.push({
                text: "Вы не выбрали город",
                attr: 'city'
            })
        }

        if (errors.length) return errors;
    },

    initialize: function () {
        if (this.get('debugger'))
            this.on('change', this.log, this);

        UM.vent.on('user:setCity', this.setCity, this);
        UM.vent.on('user:setShop', this.setShop, this);
    },

    log: function () {
        console.log(this.toJSON());
    },

    setCity: function (name) {
        this.set({
            'city': name,
            'shop': ''
        });
    },

    setShop: function (name) {
        this.set('shop', name);
    }
});