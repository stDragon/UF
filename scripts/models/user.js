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
        personalData: true,
        href: window.location.href
    },

    urlRoot: function () {
        return UM.serverUrl + '/client/'
    },

    initialize: function (model, options) {
        if (options) {
            this.options = options;
            this.set('personalData', options.personalData.checked);
        }
        if (UM.conf.server.type != 'prod')
            this.on('change', this.log, this);
    },

    /** @TODO временны отключены часть ошибок. используется браузерный валидатор */
    validate: function (attrs) {
         //emailFilter = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
            //lettersFilter = /^[а-яА-ЯёЁa-zA-Z]{1,20}$/,
        var   phoneFilter = /((8|\+7)-?)?\(?\d{3}\)?-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}/;

        var errors = [];

        if (this.options.firstName.show) {
            if (this.options.firstName.required && !attrs.firstName) {
                errors.push({
                    text: "Вы не заполнили имя",
                    attr: 'firstName'
                });
            }
            //else if (this.options.firstName.required && !lettersFilter.test(attrs.firstName)) {
            //    errors.push({
            //        text: "Имя должно содержать только буквы",
            //        attr: 'firstName'
            //    });
            //}
        }

        if (this.options.surname.show) {
            if (this.options.surname.required && !attrs.surname) {
                errors.push({
                    text: "Вы не заполнили фамилию",
                    attr: 'surname'
                });
            }
            //else if (this.options.surname.required && !lettersFilter.test(attrs.surname)) {
            //    errors.push({
            //        text: "Фамилия должна содержать только буквы",
            //        attr: 'surname'
            //    });
            //}
        }

        /*if (this.options.firstName.email) {
            if (this.options.email.required && !attrs.email) {
                errors.push({
                    text: "Вы не заполнили электронную почту",
                    attr: 'email'
                });
            } else if (this.options.email.required && !emailFilter.test(attrs.email)) {
                errors.push({
                    text: "Почтовый адресс не коректен",
                    attr: 'email'
                });
            }
        }*/

        if (this.options.phone.show) {
            if (this.options.phone.required && !attrs.phone) {
                errors.push({
                    text: "Вы не заполнили телефон",
                    attr: 'phone'
                });
            } else if (this.options.phone.required && !phoneFilter.test(attrs.phone)) {
                errors.push({
                    text: "Телефон не коректен",
                    attr: 'phone'
                });
            }
        }

        if (this.options.city.show) {
            if (this.options.city.required && !attrs.city) {
                errors.push({
                    text: "Вы не выбрали город",
                    attr: 'city'
                })
            }
        }

        if (this.options.personalData.show) {
            if (this.options.personalData.required && attrs.personalData == false) {
                errors.push({
                    text: "Чтобы продолжить установите этот флажок",
                    attr: 'personalData'
                })
            }
        }

        if (UM.conf.server.type != 'prod' && errors.length)
            console.warn(errors);

        if (errors.length) return errors;
    },

    log: function () {
        console.log(this.toJSON());
    }
});