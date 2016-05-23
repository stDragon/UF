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

    initialize: function (model, options) {
        this.set('href',JSON.stringify(window.location.href));

        if (options) {
            this.options = options;
            this.set('personalData', options.personalData.checked);
        }

        if (typeof options.city !== 'undefined' && options.city.show) {
            this.cityCollection = new UM.Collections.Citys([], this.toJSON());
            this.cityCollection.fetch();

            this.listenTo(this.cityCollection, 'change:active', function() {
                this.set('shop', '');
                this.set('shopId', '');
                var active = this.cityCollection.getActive();
                if (active) {
                    this.set('city', active.name);
                    this.set('cityId', active.mr3id);
                }
            });

            this.listenTo(this, 'change:cityId', function () {
                this.set('shop', '');
            });
        }

        if (typeof options.shop !== 'undefined' && options.shop.show) {
            var defaultShop = {
                name: 'Все студии',
                city: 'all',
                title: 'Все студии'
            };
            this.shopCollection = new UM.Collections.Shops([defaultShop], this.toJSON());
            this.shopCollection.fetch({remove: false});

            this.listenTo(this.shopCollection, 'change:active', function() {
                var active = this.shopCollection.getActive();
                if (active) {
                    this.set('shop', active.title);
                    this.set('shopId', active.mr3id);
                }
            });
        }

        if (typeof options.kitchen !== 'undefined' && options.kitchen.show) {
            this.kitchenCollection = new UM.Collections.Kitchens([], this.toJSON());
            this.kitchenCollection.fetch();

            this.listenTo(this.kitchenCollection, 'change:active', function() {
                var active = this.kitchenCollection.getActive();
                if (active) {
                    this.set('kitchen', active.name);
                    this.set('kitchenId', active.mr3id);
                }
            });
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
        console.log('Изменен: ' + _.keys(this.changedAttributes()));
        console.log(this.toJSON());
    }
});