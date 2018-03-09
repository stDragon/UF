/**
 *  Клиент, оформивший заявку
 *  */

module.exports = Backbone.Model.extend({
    defaults: {
        surname: '',
        firstName: '',
        email: '',
        phone: '',
        adphone:'',
        city: '',
        shop: '',
        pref: '',
        product: '',
        price: '',
        pay: '',
        term: '',
        wishes: '',
        personalData: true,
        // google analytics
        ga : "",
        utm : ""
    },

    urlRoot: function () {
        return UM.serverUrl + '/client/'
    },

    initialize: function (model, options) {
        UM.forms[this.get('configId')] = this;
        var that = this;

        this.set('href',JSON.stringify(window.location.href));

        if (options) {
            this.options = options;
            this.set('personalData', options.personalData.checked);
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

            /**
             * @todo Надо сделать проверку при использованиее нескольких форм на одной странице
             * */
            UM.vent.on('user:setShop', function(shop) {
                this.set('shop', shop.get('mr3id'));
                this.set('shopId', shop.get('name'));
                this.shopCollection.setActive(shop.get('mr3id'));
            }, this);
        }

        if (typeof options.kitchen !== 'undefined' && options.kitchen.show) {
            this.kitchenCollection = new UM.Collections.Kitchens([], this.toJSON());
            this.kitchenCollection.fetch().then(function(){
                if (model.kitchenId) {
                    that.kitchenCollection.setActive(model.kitchenId);
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

        var collections = {
            'price': UM.Collections.Prices,
            'color': UM.Collections.Colors,
            'gear': UM.Collections.Gears,
            'lighting': UM.Collections.Lightings,
            'room': UM.Collections.Rooms,
            'worktype': UM.Collections.Worktypes,
            'design': UM.Collections.Designs,
            'walls': UM.Collections.Walls,
            'floorType': UM.Collections.FloorTypes,
            'position': UM.Collections.Positions,
            'addPlace': UM.Collections.AddPlaces,
            'kitchenStyle': UM.Collections.KitchenStyles,
            'upperSection': UM.Collections.UpperSections,
            'lowerSection': UM.Collections.LowerSections,
            'diningGroup': UM.Collections.DiningGroups,
            'tabletopMaterial': UM.Collections.TabletopMaterials,
            'washingType': UM.Collections.WashingTypes,
            'stoveStyle': UM.Collections.StoveStyles,
            'hoodStyle': UM.Collections.HoodStyles,
            'hoodType': UM.Collections.HoodTypes
        };
        
        _.each(collections, function (value, key) {
            this.initCollection(value, key);
        }, this);

        this.on('change', function () {
            this.validate(this.changed);
        }, this);

        if (UM.conf.server.type != 'prod')
            this.on('change', this.log, this);
    },

    initCollection: function (collection, name) {
        if (typeof this.options[name] !== 'undefined' && this.options[name].show) {
            this.collections[name] = new collection(UM.data[name], this.toJSON());

            this.listenTo(this.collections[name], 'change:active', function() {
                var active = this.collections[name].getActive();
                if (active) {
                    this.set(name, active.name);
                }
            });
        }

        return this;
    },

    /** @TODO временно отключена часть ошибок. используется браузерный валидатор */
    validate: function (attrs) {
        var emailFilter = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
            //lettersFilter = /^[а-яА-ЯёЁa-zA-Z]{1,20}$/;
        var phonePattern = {
            'RU': /\+7-\d{3}\-\d{3}\-\d{2}\-\d{2}/,
            'BY': /\+37-5\d{2}\-\d{3}\-\d{2}\-\d{2}/,
            'UA': /\+38-0\d{2}\-\d{3}\-\d{2}\-\d{2}/,
            'KZ': /\+7-7\d{2}\-\d{3}\-\d{2}\-\d{2}/,
            'KG': /\+99-6\d{2}\-\d{3}\-\d{2}\-\d{2}/
        };
        var phonePatternNum = {
            'RU': /7\d{10}/,
            'BY': /375\d{9}/,
            'UA': /380\d{9}/,
            'KZ': /77\d{9}/,
            'KG': /996\d{9}/
        };
        var phoneFilter = new RegExp(phonePattern[this.options.phone.pattern]),
            phoneFilterNum = new RegExp(phonePatternNum[this.options.phone.pattern]);

        var errors = [];
        var err;

        _.each(attrs, function(value, key) {
            switch (key) {
                case 'email':
                    if (this.options.email.show) {
                        if (this.options.email.required && !value) {
                            errors.push({
                                text: "Вы не заполнили электронную почту",
                                attr: 'email'
                            });
                        } else if (value && !emailFilter.test(value)) {
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
                        } else if (!phoneFilter.test(value) && !phoneFilterNum.test(value.replace(/[^0-9]/g, ''))) {
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
                        if ((this.options.city.required || this.options.shop.required) && !value) {
                            err = {
                                text: "Вы не выбрали город",
                                attr: 'city'
                            };
                            errors.push(err);
                        } else if(value) {
                            var cities = this.cityCollection.toJSON(),
                                incorrect = false;
                            for( var key in cities) {
                                if(value == cities[key].name) {
                                    this.trigger('valid', 'city');
                                    incorrect = false;
                                    return;
                                }
                                else incorrect = true;
                            }
                            if(incorrect) {
                                err = {
                                    text: "Выберите город из списка",
                                    attr: 'city'
                                };
                                errors.push(err);
                            }
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
                default :
                    var item = _.find(this.options, function(list, predicate){
                        return predicate === key;
                    });
                    if (typeof item !== "undefined" && item.show) {
                        if (item.required && !value) {
                            err = {
                                text: "Не заполнено поле: " + item.placeholder,
                                attr: key
                            };
                            errors.push(err);
                        } else
                            this.trigger('valid', key);
                    }
            }
        }, this);

        if (UM.conf.server.type != 'prod' && errors.length)
            console.warn(errors);

        if (errors.length)
            return errors;
        else return 0;
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
                var model_code = model.get('code').replace("-", "");
                return model_code == inputCode;
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