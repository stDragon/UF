/**
 *  Клиент оформивший заявку
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

        // новые поля
        color: '',
        comment : '',
        file: '',
        description: '',
        room : '',
        worktype: '',
        design: '',
        walls: '',
        floorColor: '',
        floorType: '',
        floorChange: '',
        ceilingHeight: '',
        ceilingChange: '',
        position: '',
        addPlace: '',
        kitchenStyle: '',
        upperSection: '',
        lowerSection: '',
        upperSectionColor: '',
        lowerSectionColor: '',
        combineWishes: '',
        diningGroup: '',
        diningGroupLength: '',
        diningGroupWidth: '',
        diningGroupHeight: '',
        chairs: '',
        diningGroupMaterial: '',
        diningGroupStyle: '',
        diningGroupColor: '',
        diningGroupExt: '',
        tabletopMaterial: '',
        tabletopExt: '',
        washingType: '',
        washingExt: '',
        fridge: '',
        inFridge: '',
        fridgeExt: '',
        deepFreeze: '',
        inDeepFreeze: '',
        deepFreezeExt: '',
        dishwasher: '',
        inDishwasher: '',
        dishwasherExt: '',
        washer: '',
        inWasher: '',
        washerExt: '',
        stoveNumber: '',
        inMicrowaveNumber: '',
        freeMicrowaveNumber: '',
        oven: '',
        hob: '',
        stoveStyle: '',
        hoodStyle: '',
        hoodType: '',
        hoodNumber: '',
        hoodExt: '',
        lighting:'',
        lightingExt:'',
        gear :'',
        gearExt :'',

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

        if (typeof options.price !== 'undefined' && options.price.show) {
            this.priceCollection = new UM.Collections.Prices(UM.prices, this.toJSON());

            this.listenTo(this.priceCollection, 'change:active', function() {
                var active = this.priceCollection.getActive();
                if (active) {
                    this.set('price', active.name);
                }
            });
        }

        if (typeof options.color !== 'undefined' && options.color.show) {
            this.colorCollection = new UM.Collections.Colors(UM.colors, this.toJSON());

            this.listenTo(this.colorCollection, 'change:active', function() {
                var active = this.colorCollection.getActive();
                if (active) {
                    this.set('color', active.name);
                }
            });
        }

        if (typeof options.gear !== 'undefined' && options.gear.show) {
            this.gearCollection = new UM.Collections.Gears(UM.gears, this.toJSON());

            this.listenTo(this.gearCollection, 'change:active', function() {
                var active = this.gearCollection.getActive();
                if (active) {
                    this.set('gear', active.name);
                }
            });
        }
        if (typeof options.lighting !== 'undefined' && options.lighting.show) {
            this.lightingCollection = new UM.Collections.Lightings(UM.lightings, this.toJSON());

            this.listenTo(this.lightingCollection, 'change:active', function() {
                var active = this.lightingCollection.getActive();
                if (active) {
                    this.set('lighting', active.name);
                }
            });
        }

        if (typeof options.room !== 'undefined' && options.room.show) {
            this.roomCollection = new UM.Collections.Rooms(UM.rooms, this.toJSON());

            this.listenTo(this.roomCollection, 'change:active', function() {
                var active = this.roomCollection.getActive();
                if (active) {
                    this.set('room', active.name);
                }
            });
        }

        if (typeof options.worktype !== 'undefined' && options.worktype.show) {
            this.worktypeCollection = new UM.Collections.Worktypes(UM.worktypes, this.toJSON());

            this.listenTo(this.worktypeCollection, 'change:active', function() {
                var active = this.worktypeCollection.getActive();
                if (active) {
                    this.set('worktype', active.name);
                }
            });
        }

        if (typeof options.design !== 'undefined' && options.design.show) {
            this.designCollection = new UM.Collections.Designs(UM.designs, this.toJSON());

            this.listenTo(this.designCollection, 'change:active', function() {
                var active = this.designCollection.getActive();
                if (active) {
                    this.set('design', active.name);
                }
            });
        }

        if (typeof options.walls !== 'undefined' && options.walls.show) {
            this.wallCollection = new UM.Collections.Walls(UM.walls, this.toJSON());

            this.listenTo(this.wallCollection, 'change:active', function() {
                var active = this.wallCollection.getActive();
                if (active) {
                    this.set('walls', active.name);
                }
            });
        }
        if (typeof options.floorType !== 'undefined' && options.floorType.show) {
            this.floorTypeCollection = new UM.Collections.FloorTypes(UM.floorTypes, this.toJSON());

            this.listenTo(this.floorTypeCollection, 'change:active', function() {
                var active = this.floorTypeCollection.getActive();
                if (active) {
                    this.set('floorType', active.name);
                }
            });
        }
        if (typeof options.position !== 'undefined' && options.position.show) {
            this.positionCollection = new UM.Collections.Positions(UM.positions, this.toJSON());

            this.listenTo(this.positionCollection, 'change:active', function() {
                var active = this.positionCollection.getActive();
                if (active) {
                    this.set('position', active.name);
                }
            });
        }
        if (typeof options.addPlace !== 'undefined' && options.addPlace.show) {
            this.addPlaceCollection = new UM.Collections.AddPlaces(UM.addPlaces, this.toJSON());

            this.listenTo(this.addPlaceCollection, 'change:active', function() {
                var active = this.addPlaceCollection.getActive();
                if (active) {
                    this.set('addPlace', active.name);
                }
            });
        }
        if (typeof options.kitchenStyle !== 'undefined' && options.kitchenStyle.show) {
            this.kitchenStyleCollection = new UM.Collections.KitchenStyles(UM.kitchenStyles, this.toJSON());

            this.listenTo(this.kitchenStyleCollection, 'change:active', function() {
                var active = this.kitchenStyleCollection.getActive();
                if (active) {
                    this.set('kitchenStyle', active.name);
                }
            });
        }
        if (typeof options.upperSection !== 'undefined' && options.upperSection.show) {
            this.upperSectionCollection = new UM.Collections.UpperSections(UM.upperSections, this.toJSON());

            this.listenTo(this.upperSectionCollection, 'change:active', function() {
                var active = this.upperSectionCollection.getActive();
                if (active) {
                    this.set('upperSection', active.name);
                }
            });
        }
        if (typeof options.lowerSection !== 'undefined' && options.lowerSection.show) {
            this.lowerSectionCollection = new UM.Collections.LowerSections(UM.lowerSections, this.toJSON());

            this.listenTo(this.lowerSectionCollection, 'change:active', function() {
                var active = this.lowerSectionCollection.getActive();
                if (active) {
                    this.set('lowerSection', active.name);
                }
            });
        }
        if (typeof options.diningGroup !== 'undefined' && options.diningGroup.show) {
            this.diningGroupCollection = new UM.Collections.DiningGroups(UM.diningGroups, this.toJSON());

            this.listenTo(this.diningGroupCollection, 'change:active', function() {
                var active = this.diningGroupCollection.getActive();
                if (active) {
                    this.set('diningGroup', active.name);
                }
            });
        }
        if (typeof options.tabletopMaterial !== 'undefined' && options.tabletopMaterial.show) {
            this.tabletopMaterialCollection = new UM.Collections.TabletopMaterials(UM.tabletopMaterials, this.toJSON());

            this.listenTo(this.tabletopMaterialCollection, 'change:active', function() {
                var active = this.tabletopMaterialCollection.getActive();
                if (active) {
                    this.set('tabletopMaterial', active.name);
                }
            });
        }
        if (typeof options.washingType !== 'undefined' && options.washingType.show) {
            this.washingTypeCollection = new UM.Collections.WashingTypes(UM.washingTypes, this.toJSON());

            this.listenTo(this.washingTypeCollection, 'change:active', function() {
                var active = this.washingTypeCollection.getActive();
                if (active) {
                    this.set('washingType', active.name);
                }
            });
        }
        if (typeof options.stoveStyle !== 'undefined' && options.stoveStyle.show) {
            this.stoveStyleCollection = new UM.Collections.StoveStyles(UM.stoveStyles, this.toJSON());

            this.listenTo(this.stoveStyleCollection, 'change:active', function() {
                var active = this.stoveStyleCollection.getActive();
                if (active) {
                    this.set('stoveStyle', active.name);
                }
            });
        }
        if (typeof options.stoveStyle !== 'undefined' && options.stoveStyle.show) {
            this.stoveStyleCollection = new UM.Collections.StoveStyles(UM.stoveStyles, this.toJSON());

            this.listenTo(this.stoveStyleCollection, 'change:active', function() {
                var active = this.stoveStyleCollection.getActive();
                if (active) {
                    this.set('stoveStyle', active.name);
                }
            });
        }
        if (typeof options.hoodStyle !== 'undefined' && options.hoodStyle.show) {
            this.hoodStyleCollection = new UM.Collections.HoodStyles(UM.hoodStyles, this.toJSON());

            this.listenTo(this.hoodStyleCollection, 'change:active', function() {
                var active = this.hoodStyleCollection.getActive();
                if (active) {
                    this.set('hoodStyle', active.name);
                }
            });
        }
        if (typeof options.hoodType !== 'undefined' && options.hoodType.show) {
            this.hoodTypeCollection = new UM.Collections.HoodTypes(UM.hoodTypes, this.toJSON());

            this.listenTo(this.hoodTypeCollection, 'change:active', function() {
                var active = this.hoodTypeCollection.getActive();
                if (active) {
                    this.set('hoodType', active.name);
                }
            });
        }

        this.on('change', function () {
            this.validate(this.changed);
        }, this);

        if (UM.conf.server.type != 'prod')
            this.on('change', this.log, this);
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