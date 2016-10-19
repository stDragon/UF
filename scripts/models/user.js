/**
 *  Клиент оформивший заявку
 *  */

module.exports = Backbone.Model.extend({

    urlRoot: function () {
        return UM.serverUrl + '/client/'
    },

    initialize: function (model, options) {
        UM.forms[this.get('configId')] = this;
        var that = this;

        this.set('href',JSON.stringify(window.location.href));

        if (options) {
            this.options = options;
            //this.set('personalData', options.personalData.checked);
        }

        if (typeof options.city !== 'undefined' && options.city.show) {
            this.cityCollection = new UM.Collections.Citys([], this.toJSON());
            this.cityCollection.fetch().then(function(){
                if (model.cityId) {
                    that.cityCollection.setActive(model.cityId);
                }
            }, UM.ajaxError);

            this.listenTo(this.cityCollection, 'change:active', function() {
                var active = this.cityCollection.getActive();
                if (active) {
                    this.set('cityId', active.mr3id);
                    this.set('city', active.name);
                }
            });
        }

        if (typeof options.shop !== 'undefined' && options.shop.show) {
            var defaultShop = {
                name: 'Все студии',
                city: 'all',
                title: 'Все студии',
                //active: true
            };
            this.shopCollection = new UM.Collections.Shops([defaultShop], this.toJSON());
            this.shopCollection.fetch({remove: false}).then(function(){
                if (model.shopId) {
                    that.shopCollection.setActive(model.shopId);
                }
            }, UM.ajaxError);

            this.listenTo(this, 'change:cityId', function () {
                this.set('shopId', '');
                //this.set('shop', 'Все студии');
            });

            this.listenTo(this.shopCollection, 'change:active', function() {
                var active = this.shopCollection.getActive();
                if (active) {
                    this.set('shopId', active.mr3id);
                }
            });

            this.listenTo(this, 'change:shopId', function() {
                var active = this.shopCollection.getActive();
                if (active) {
                    this.set('shop', active.title);
                }
            });
        }

        if (typeof options.kitchen !== 'undefined' && options.kitchen.show) {
            this.kitchenCollection = new UM.Collections.Kitchens([], this.toJSON());
            this.kitchenCollection.fetch().then(function(){
                if (model.kitchenId) {
                    that.cityCollection.setActive(model.kitchenId);
                }
            }, UM.ajaxError);

            this.listenTo(this.kitchenCollection, 'change:active', function() {
                var active = this.kitchenCollection.getActive();
                if (active) {
                    this.set('kitchenId', active.mr3id);
                    this.set('kitchen', active.name);
                }
            });
        }

        if (typeof options.pref !== 'undefined' && options.pref.show) {
            this.prefCollection = new UM.Collections.Options(UM.pref, this.toJSON());

            this.listenTo(this.prefCollection, 'change:active', function() {
                var active = this.prefCollection.getActive();
                if (active) {
                    this.set('pref', active.name);
                }
            });
        }

        if (typeof options.product !== 'undefined' && options.product.show) {
            this.productCollection = new UM.Collections.Options(UM.product, this.toJSON());

            this.listenTo(this.productCollection, 'change:active', function() {
                var active = this.productCollection.getActive();
                if (active) {
                    this.set('product', active.name);
                }
            });
        }

        if (typeof options.pay !== 'undefined' && options.pay.show) {
            this.payCollection = new UM.Collections.Options(UM.pay, this.toJSON());

            this.listenTo(this.payCollection, 'change:active', function() {
                var active = this.payCollection.getActive();
                if (active) {
                    this.set('pay', active.name);
                }
            });
        }

        this.on('change', function () {
            this.validate(this.changed);
        }, this);

        if (UM.conf.server.type != 'prod')
            this.on('change', this.log, this);
    },

    /** @TODO временны отключены часть ошибок. используется браузерный валидатор */
    validate: function (attrs) {
        var emailFilter = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
            //lettersFilter = /^[а-яА-ЯёЁa-zA-Z]{1,20}$/;
        var phonePattern = {
            'RU': /\+7\s\d{3}\-\d{3}\-\d{2}\-\d{2}/,
            'BY': /\+375\s\d{3}\-\d{2}\-\d{2}\-\d{2}/,
            'UA': /\+380\s\d{3}\-\d{2}\-\d{2}\-\d{2}/,
            'KZ': /\+77\s\d{2}\-\d{3}\-\d{2}\-\d{2}/,
            'KG': /\+996\s\d{3}\-\d{3}\-\d{3}/
        };
        var phoneFilter = new RegExp(phonePattern[this.options.phone.pattern]);

        var errors = [];
        var err;

        _.each(attrs, function(value, key) {
            switch (key) {
                case 'firstName':
                    if (this.options.firstName.show) {
                        if (this.options.firstName.required && !value) {
                            err = {
                                text: "Вы не заполнили имя",
                                attr: 'firstName'
                            };
                            errors.push(err);
                        //} else if (this.options.firstName.required && !lettersFilter.test(value)) {
                        //    err = {
                        //        text: "Имя должно содержать только буквы",
                        //        attr: 'firstName'
                        //    };
                        //    errors.push(err);
                        } else {
                            this.trigger('valid', 'firstName');
                        }
                    }
                    break;
                case 'surname':
                    if (this.options.surname.show) {
                        if (this.options.surname.required && !value) {
                            err = {
                                text: "Вы не заполнили фамилию",
                                attr: 'surname'
                            };
                            errors.push(err);
                        //} else if (this.options.surname.required && !lettersFilter.test(value)) {
                        //    errors.push({
                        //        text: "Фамилия должна содержать только буквы",
                        //        attr: 'surname'
                        //    });
                        } else {
                            this.trigger('valid', 'surname');
                        }
                    }
                    break;
                case 'email':
                    if (this.options.email.show) {
                        if (this.options.email.required && !value) {
                            errors.push({
                                text: "Вы не заполнили электронную почту",
                                attr: 'email'
                            });
                        } else if (this.options.email.required && !emailFilter.test(value)) {
                            errors.push({
                                text: "Почтовый адресс не коректен",
                                attr: 'email'
                            });
                        } else {
                            this.trigger('valid', 'email');
                        }
                    }
                    break;
                case 'phone':
                    if (this.options.phone.show) {
                        if (this.options.phone.required && !value) {
                            err = {
                                text: "Вы не заполнили телефон",
                                attr: 'phone'
                            };
                            errors.push(err);
                        } else if (!this.validatePhoneCode(value)) {
                            err = {
                                text: "Телефонные номера с заданным кодом не поддерживаются",
                                attr: 'phone'
                            };
                            errors.push(err);
                        } else if (!phoneFilter.test(value)) {
                            err = {
                                text: "Телефон не коректен",
                                attr: 'phone'
                            };
                            errors.push(err);
                        } else {
                            this.trigger('valid', 'phone');
                        }
                    }
                    break;
                case 'city':
                    if (this.options.city.show) {
                        if (this.options.city.required && !value) {
                            err = {
                                text: "Вы не выбрали город",
                                attr: 'city'
                            };
                            errors.push(err);
                        } else {
                            this.trigger('valid', 'city');
                        }
                    }
                    break;
                case 'personalData':
                    if (this.options.personalData.show) {
                        if (this.options.personalData.required && value == false) {
                            err = {
                                text: "Чтобы продолжить установите этот флажок",
                                attr: 'personalData'
                            };
                            errors.push(err);
                        } else {
                            this.trigger('valid', 'personalData');
                        }
                    }
                    break;
                /* new fields */
                case 'adphone':
                    if (typeof this.options.adphone !== 'undefined' && this.options.adphone.show) {
                        if (this.options.adphone.required && !value) {
                            err = {
                                text: "Вы не указали дополнительный телефон",
                                attr: 'adphone'
                            };
                            errors.push(err);
                        } else {
                            this.trigger('valid', 'adphone');
                        }
                    }
                    break;
                case 'pref':
                    if (typeof this.options.pref !== 'undefined' && this.options.pref.show) {
                        if (this.options.pref.required && !value) {
                            err = {
                                text: "Вы не указали предпочтительный способ связи",
                                attr: 'pref'
                            };
                            errors.push(err);
                        } else {
                            this.trigger('valid', 'pref');
                        }
                    }
                    break;
                case 'product':
                    if (typeof this.options.product !== 'undefined' && this.options.product.show) {
                        if (this.options.product.required && !value) {
                            err = {
                                text: "Вы не указали товар",
                                attr: 'product'
                            };
                            errors.push(err);
                        } else {
                            this.trigger('valid', 'product');
                        }
                    }
                    break;
                case 'price':
                    if (typeof this.options.price !== 'undefined' && this.options.price.show) {
                        if (this.options.price.required && !value) {
                            err = {
                                text: "Вы не указали стоимость",
                                attr: 'price'
                            };
                            errors.push(err);
                        } else {
                            this.trigger('valid', 'price');
                        }
                    }
                    break;
                case 'pay':
                    if (typeof this.options.pay !== 'undefined' && this.options.pay.show) {
                        if (this.options.pay.required && !value) {
                            err = {
                                text: "Вы не указали величину первого взноса",
                                attr: 'pay'
                            };
                            errors.push(err);
                        } else {
                            this.trigger('valid', 'pay');
                        }
                    }
                    break;
                case 'term':
                    if (typeof this.options.term !== 'undefined' && this.options.term.show) {
                        if (this.options.term.required && !value) {
                            err = {
                                text: "Вы не указали желаемый срок кредита",
                                attr: 'term'
                            };
                            errors.push(err);
                        } else {
                            this.trigger('valid', 'term');
                        }
                    }
                    break;
            }
        }, this);

        if (UM.conf.server.type != 'prod' && errors.length)
            console.warn(errors);

        if (errors.length) return errors;
    },

    log: function () {
        console.log('Изменен: ' + _.keys(this.changedAttributes()));
        console.log(this.toJSON());
    },

    validatePhoneCode: function(val) {

        val = val.replace(/[^0-9]/g, '');

        if(val.charAt(0) == '8') {
            val = val.replace("8", "7");
            this.input.val(val);
        }

        var isFound = false;

        /* поиск введенного кода в коллекции */
        var inputCode;

        for(var i = 3; i > 0; i--) {
            inputCode = val.substr(0, i);

            var model = this.phoneCodeCollection.find(function(model) {
                return model.get('code') == inputCode;
            });

            if (model && model.get('available') !== false) {
                model.active();
                isFound = true;
                break;
            }
        }

        return isFound;
    }
});