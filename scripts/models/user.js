/**
 *  Клиент оформивший заявку
 *  */

module.exports = Backbone.Model.extend({

    urlRoot: function () {
        return UM.dataUrl + '/client/'
    },

    initialize: function (model, option) {
        UM.forms[this.get('configId')] = this;

        this.set('href',JSON.stringify(window.location.href));

        this.options = [];
        this.fieldsCollection = new Backbone.Ribs.Collection;
        if (option) {
            this.options.push(option);
            this.initCollections(option);
            this.fieldsCollection.add(option.fields);
        }

        this.on('change', function () {
            this.validate(this.changed);
        }, this);

        if (UM.conf.server.type != 'prod')
            this.on('change', this.log, this);
    },

    addOption: function (option){
        this.options.push(option);
        this.initCollections(option);
    },

    initCollections: function (option) {
        var that = this;
        this.optionCollection = [];
        var collections = _.filter(option.fields, function(field){ return field.collection === true; });

        _.each(collections, function (field) {
            this.optionCollection[field.name] = new UM.Collections.Options([], this.toJSON());
            this.optionCollection[field.name].fetch().then(function(){
                if (that.has('cityId')) {
                    that.optionCollection[field.name].setActive(that.get(field.name+'Id'));
                }
            }, UM.ajaxError);

            this.listenTo(that.optionCollection[field.name], 'change:active', function() {
                var active = that.optionCollection[field.name].getActive();
                if (active) {
                    this.set(field.name+'Id', active.mr3id);
                    this.set(field.name, active.name);
                }
            });

        }, this);

        _.each(option.fields,function (field) {
            switch (field.name) {
                case 'shop':
                    var defaultShop = {
                        //active: true,
                        name: 'Все студии',
                        city: 'all',
                        title: 'Все студии'
                    };
                    this.shopCollection = new UM.Collections.Shops([defaultShop], this.toJSON());
                    this.shopCollection.fetch({remove: false}).then(function(){
                        if (that.has('shopId')) {
                            that.shopCollection.setActive(that.get('shopId'));
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
                    break;
                case 'kitchen':
                    this.kitchenCollection = new UM.Collections.Kitchens([], this.toJSON());
                    this.kitchenCollection.fetch().then(function(){
                        if (that.has('kitchenId')) {
                            that.cityCollection.setActive(that.get('kitchenId'));
                        }
                    }, UM.ajaxError);

                    this.listenTo(this.kitchenCollection, 'change:active', function() {
                        var active = this.kitchenCollection.getActive();
                        if (active) {
                            this.set('kitchenId', active.mr3id);
                            this.set('kitchen', active.name);
                        }
                    });
                    break;
                case 'pref':
                    this.prefCollection = new UM.Collections.Options(UM.pref, this.toJSON());

                    this.listenTo(this.prefCollection, 'change:active', function() {
                        var active = this.prefCollection.getActive();
                        if (active) {
                            this.set('pref', active.name);
                        }
                    });
                    break;
                case 'product':
                    this.productCollection = new UM.Collections.Options(UM.product, this.toJSON());

                    this.listenTo(this.productCollection, 'change:active', function() {
                        var active = this.productCollection.getActive();
                        if (active) {
                            this.set('product', active.name);
                        }
                    });
                    break;
                case 'pay':
                    this.payCollection = new UM.Collections.Options(UM.pay, this.toJSON());

                    this.listenTo(this.payCollection, 'change:active', function() {
                        var active = this.payCollection.getActive();
                        if (active) {
                            this.set('pay', active.name);
                        }
                    });
                    break;
            }
        }, this);
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

        var errors = [];
        var err;

        _.each(attrs, function(value, key) {
            var options = this.fieldsCollection.find(function(model) {return model.get('name') == key; });
            switch (key) {
                case 'firstName':
                    if (options.required && !value) {
                        err = {
                            text: "Вы не заполнили имя",
                            attr: 'firstName'
                        };
                        errors.push(err);
                    //} else if (this.options.fields.firstName.required && !lettersFilter.test(value)) {
                    //    err = {
                    //        text: "Имя должно содержать только буквы",
                    //        attr: 'firstName'
                    //    };
                    //    errors.push(err);
                    } else {
                        this.trigger('valid', 'firstName');
                    }
                    break;
                case 'surname':
                    if (options.required && !value) {
                        err = {
                            text: "Вы не заполнили фамилию",
                            attr: 'surname'
                        };
                        errors.push(err);
                    //} else if (this.options.fields.surname.required && !lettersFilter.test(value)) {
                    //    errors.push({
                    //        text: "Фамилия должна содержать только буквы",
                    //        attr: 'surname'
                    //    });
                    } else {
                        this.trigger('valid', 'surname');
                    }
                    break;
                case 'email':
                    if (options.required && !value) {
                        errors.push({
                            text: "Вы не заполнили электронную почту",
                            attr: 'email'
                        });
                    } else if (options.required && !emailFilter.test(value)) {
                        errors.push({
                            text: "Почтовый адресс не коректен",
                            attr: 'email'
                        });
                    } else {
                        this.trigger('valid', 'email');
                    }
                    break;
                case 'phone':
                    var phoneFilter = new RegExp(phonePattern[options.pattern]);
                    if (options.required && !value) {
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
                    break;
                case 'city':
                    if (options.required && !value) {
                        err = {
                            text: "Вы не выбрали город",
                            attr: 'city'
                        };
                        errors.push(err);
                    } else {
                        this.trigger('valid', 'city');
                    }
                    break;
                case 'personalData':
                    if (options.required && value == false) {
                        err = {
                            text: "Чтобы продолжить установите этот флажок",
                            attr: 'personalData'
                        };
                        errors.push(err);
                    } else {
                        this.trigger('valid', 'personalData');
                    }
                    break;
                case 'adphone':
                    if (options.required && !value) {
                        err = {
                            text: "Вы не указали дополнительный телефон",
                            attr: 'adphone'
                        };
                        errors.push(err);
                    } else {
                        this.trigger('valid', 'adphone');
                    }
                    break;
                case 'pref':
                    if (options.required && !value) {
                        err = {
                            text: "Вы не указали предпочтительный способ связи",
                            attr: 'pref'
                        };
                        errors.push(err);
                    } else {
                        this.trigger('valid', 'pref');
                    }
                    break;
                case 'product':
                    if (options.required && !value) {
                        err = {
                            text: "Вы не указали товар",
                            attr: 'product'
                        };
                        errors.push(err);
                    } else {
                        this.trigger('valid', 'product');
                    }
                    break;
                case 'price':
                    if (options.required && !value) {
                        err = {
                            text: "Вы не указали стоимость",
                            attr: 'price'
                        };
                        errors.push(err);
                    } else {
                        this.trigger('valid', 'price');
                    }
                    break;
                case 'pay':
                    if (options.required && !value) {
                        err = {
                            text: "Вы не указали величину первого взноса",
                            attr: 'pay'
                        };
                        errors.push(err);
                    } else {
                        this.trigger('valid', 'pay');
                    }
                    break;
                case 'term':
                    if (options.required && !value) {
                        err = {
                            text: "Вы не указали желаемый срок кредита",
                            attr: 'term'
                        };
                        errors.push(err);
                    } else {
                        this.trigger('valid', 'term');
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