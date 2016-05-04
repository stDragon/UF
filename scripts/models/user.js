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
        return UM.serverUrl + '/client/'
    },

    /** @TODO временны отключены часть ошибок. используется браузерный валидатор */
    validate: function (attrs, options) {
        var emailFilter = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
            lettersFilter = /^[а-яА-ЯёЁa-zA-Z]{1,20}$/,
            phoneFilter = /((8|\+7)-?)?\(?\d{3}\)?-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}/;

        var errors = [],
            options = UM.configsCollection.get(this.get('configId')).toJSON();

        if (options.formConfig.firstName.show) {
            if (options.formConfig.firstName.required && !attrs.firstName) {
                errors.push({
                    text: "Вы не заполнили имя",
                    attr: 'firstName'
                });
            } else if (options.formConfig.firstName.required && !lettersFilter.test(attrs.firstName)) {
                errors.push({
                    text: "Имя должно содержать только буквы",
                    attr: 'firstName'
                });
            }
        }

        if (options.formConfig.surname.show) {
            if (options.formConfig.surname.required && !attrs.surname) {
                errors.push({
                    text: "Вы не заполнили фамилию",
                    attr: 'surname'
                });
            } else if (options.formConfig.surname.required && !lettersFilter.test(attrs.surname)) {
                errors.push({
                    text: "Фамилия должна содержать только буквы",
                    attr: 'surname'
                });
            }
        }

        /*if (options.formConfig.firstName.email) {
            if (options.formConfig.email.required && !attrs.email) {
                errors.push({
                    text: "Вы не заполнили электронную почту",
                    attr: 'email'
                });
            } else if (options.formConfig.email.required && !emailFilter.test(attrs.email)) {
                errors.push({
                    text: "Почтовый адресс не коректен",
                    attr: 'email'
                });
            }
        }*/

        if (options.formConfig.phone.show) {
            if (options.formConfig.phone.required && !attrs.phone) {
                errors.push({
                    text: "Вы не заполнили телефон",
                    attr: 'phone'
                });
            } else if (options.formConfig.phone.required && !phoneFilter.test(attrs.phone)) {
                errors.push({
                    text: "Телефон не коректен",
                    attr: 'phone'
                });
            }
        }

        if (options.formConfig.city.show) {
            if (options.formConfig.city.required && !attrs.city) {
                errors.push({
                    text: "Вы не выбрали город",
                    attr: 'city'
                })
            }
        }

        if (options.formConfig.personalData.show) {
            if (options.formConfig.personalData.required && attrs.personalData == false) {
                errors.push({
                    text: "Чтобы продолжить установите этот флажок",
                    attr: 'personalData'
                })
            }
        }

        if (options.server == 'dev' && errors.length) console.warn(errors);

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