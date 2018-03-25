/**
 *  Форма заявок
 *  */

module.exports = UM.Views.Form.extend({

    events: {
        'focus input': 'showOptionList',
        //'keyup [name="city"]': 'search',
        'keyup [name="phone"]': 'setAttrs',
        'change input': 'setAttrs',
        'change textarea': 'setAttrs',
        'blur': 'preValidation',
        'click .um-icon-add-location': 'showYaMap',
        'change input:checkbox': 'changed',
        'click .um-static-select li': 'chooseValue',
        'click': 'click',
        'input [name="name"]' : 'parseName',
        'click button[name="buttonNext"]': 'toNextStep',
        'click button[name="buttonPrev"]': 'toPrevStep',
        'submit': 'save'
    },

    click: function(e) {
        var $el = $(e.target);
        if($el.hasClass('um-form-control') || $el.hasClass('um-phone-flag') || $el.hasClass('um-field-wrap')) {
            this.showOptionList(e);
            return;
        } else if(!$el.closest('.um-dropdown-content').length) {
            this.hiddenOptionList()
        }
    },

    initialize: function (model, options) {

        this.options = options;

        this.initSelects().render();

        this.model.on('change', this.setValue, this);
        this.model.on('change:personalData', this.preValidation, this);

        //if (this.model.options.shop.show) {
        //    this.createYaMapModal();
        //    this.model.on('change:cityId', this.createSelectShop, this);
        //}
        this.listenTo(this.model, 'request', function () {
            UM.helpers.vent.trigger('layout:showLoader', this.model.get('configId'));
            this.valid();
            this.disabledSubmit();
        });
        this.listenTo(this.model, 'sync', function () {
            UM.helpers.vent.trigger('layout:hideLoader', this.model.get('configId'));
            UM.helpers.vent.trigger('layout:showPhoneForm', this.model.get('configId'));
        });
        this.listenTo(this.model, 'error', function () {
            UM.helpers.vent.trigger('layout:hideLoader', this.model.get('configId'));
            this.enabledSubmit();
        });
        this.listenTo(this.model, 'invalid', this.invalid);
        this.listenTo(this.model, 'valid', this.valid);

        var that = this;
        $(document).on('click', function(e) {
            that.click(e);
        });

        /* toggle hidden blocks on promo pages */
        this.$el.on('click', '.um-wrapper>label, .um-edim-doma-old .um-form-group-wishes>label', function(e) {
            that.concealed(e);
        });
    },

    initSelects: function () {

        this.optionCollectionView = new Backbone.Ribs.Collection();

        _.each(this.model.optionCollection, function(option){
            this.optionCollectionView.add(new UM.Views.InputSelect({collection: option}));
        },this);

        if (this.model.kitchenCollection && _.find(this.options.fields, function (field){return field.name === 'kitchen'})) {
            this.kitchenCollectionView = new UM.Views.Kitchens({collection: this.model.kitchenCollection});
        }

        /*if (this.model.prefCollection && _.find(this.options.fields, function (field){return field.name === 'pref'})) {
            this.prefCollectionView = new UM.Views.InputSelect({collection: this.model.prefCollection});
        }

        if (this.model.productCollection && _.find(this.options.fields, function (field){return field.name === 'product'})) {
            this.productCollectionView = new UM.Views.InputSelect({collection: this.model.productCollection});
        }

        if (this.model.payCollection && _.find(this.options.fields, function (field){return field.name === 'pay'})) {
            this.payCollectionView = new UM.Views.InputSelect({collection: this.model.payCollection});
        }*/

        return this;
    },

    initPhoneMask: function () {
        var selector = this.$el.find('.um-form-group-phone');

        if (selector.length && !this.phoneView) {
            this.phoneView = new UM.Views.PhoneInput({el: selector, form: this.options.fields.phone});
            this.model.phoneCodeCollection = this.phoneView.phoneCodeCollection; //пробрасывается доступ модели к коллекции телефонов, нужно для валидации
        }
    },

    createSelectShop: function () {
        var cityId = this.model.get('cityId');

        this.removeSelectShop();
        /** Из коллекции городов находим город и если у него выведено свойство "showShop", добавляем поле с выбором студий */
        if (cityId && this.model.cityCollection.findWhere({'mr3id': cityId}) && this.model.cityCollection.findWhere({'mr3id': cityId}).get('showShop')) {
            this.addSelectShop();
            if (this.model.options.shop.mapShow) {
                this.createYaMap();
            }
        } else {
            this.removeSelectShop();
            this.removeYaMap();
            this.model.set('shop', '');
        }
    },

    search: function (e) {
        var input = e.target;
        var city = this.model.cityCollection.search(input.value);

        if (city.length) {
            this.cityCollectionView = new UM.Views.Citys({collection: city});
        }
    },

    addSelectShop: function () {
        var $el = this.$el.find('[name=shop]'),
            cityId = this.model.get('cityId');

        this.cityShopCollection = this.model.shopCollection.filterByCity(cityId, {default: true});
        this.shopCollectionView = new UM.Views.Shops({collection: this.cityShopCollection});

        if (this.shopCollectionView.$el.children().length) {
            $el.before(this.shopCollectionView.el);

            $el.prop('disabled', false );
            $el.parents('.um-form-group').removeClass('um-hidden');
        }
    },

    removeSelectShop: function () {
        var $el = this.$el.find('[name=shop]');

        $el.parents('.um-form-group').find('.um-dropdown-content').remove();

        $el.prop('disabled', true );
        $el.parents('.um-form-group').addClass('um-hidden');
    },

    showSelectShop: function () {
        if (this.shopCollectionView)
            this.shopCollectionView.show();
    },

    hideSelectShop: function () {
        if (this.shopCollectionView)
            this.shopCollectionView.hidden();
    },

    render: function () {
        this.options.fields = _.sortBy(this.options.fields, function(opt){ return Number(opt.sort) });
        var that = this;
        UM.helpers.templateManager.get(this.template, function (template) {
            var temp = _.template(template);
            var data = {
                value: that.model.toJSON(),
                options: that.options
            };

            var html = temp(data);
            that.$el.html(html);

            if (that.cityCollectionView) {
                that.addSelectList('city', that.cityCollectionView);
                if(that.model.shopCollection)
                    that.createSelectShop();
            }
            if (that.kitchenCollectionView) {
                that.addSelectList('kitchen', that.kitchenCollectionView);
            }
            if (that.prefCollectionView) {
                that.addSelectList('pref', that.prefCollectionView);
            }
            if (that.productCollectionView) {
                that.addSelectList('product', that.productCollectionView);
            }
            if (that.payCollectionView) {
                that.addSelectList('pay', that.payCollectionView);
            }
            that.initPhoneMask();
            //that.preValidation();

            /* Костыль со скрывающимися комментариями для старого все для дома и питера */
            if (that.$el.closest('.um-edim-doma-old').length || that.$el.closest('.um-piter').length) {
                //that.$el.find('[name="wishes"]').addClass('um-hidden');
            }

            /* Костыль для питера */
            if (that.$el.closest('.um-piter').length) {
                that.$el.find('[name="shop"]').prop('readonly', true);
            }

            /* Костыль для пошаговой формы едим дома */
            if (UM.configsCollection.get(that.model.get('configId')).get('style') === 'um-edim-doma') {
                that.addSteps();
            }

            /* Костыль для промо едим дома */
            if (UM.configsCollection.get(that.model.get('configId')).get('style') === 'um-edim-doma-promo') {
                that.$el.find('.um-form-group-wishes').appendTo(that.$el.find('.um-login'));
            }

            /* Костыль для кридитной формы твой дом */
            if (UM.configsCollection.get(that.model.get('configId')).get('style') === 'um-your-house'
                && UM.configsCollection.get(that.model.get('configId')).get('global.type') === 'credit') {
                that.$el.find('.um-form-group-firstname, .um-form-group-email, .um-form-group-phone ').wrapAll("<div class='um-form-col'></div>");
                that.$el.find('.um-form-group-wishes , .um-form-group-personal-data').wrapAll("<div class='um-form-col'></div>");
            }
        });
        return this;
    },

    addSelectList: function (inputName, collectionView) {
        this.$el.find('[name=' + inputName + ']').before(collectionView.el);
        return this;
    },

    preValidation: function(){
        var personalData =_.find(this.options.fields, function(field) {return field.name === 'personalData'});
        if (typeof personalData !== 'undefined' && personalData.required) {
            if (this.model.get('personalData'))
                this.enabledSubmit();
            else
                this.disabledSubmit();
        }
    },

    /**
     * При объедининеии полей Фамилия и Имя при вводе значения с клавиатуры разделяет значения имени и фамилии
     */
    parseName: function(e) {
        var val = ($(e.target).val()).trim(),
            id = $(e.target).attr('id'),
            i = val.trim().indexOf(' '),
            surname = val.substr(0, i),
            name = val.substr((i + 1), val.length);

        this.$el.find('[name=surname]').val(surname);
        this.$el.find('[name=firstName]').val(name);
        this.setAttrs();
    },

    /**
     * Создание модального окна для Яндекс карты
     */
    createYaMapModal: function () {
        if (!$('#umMap').length) {
            var content = '<div id="umMap"></div>';
            UM.modalMap = new UM.Models.Modal({'content': content});
            UM.modalMapView = new UM.Views.Modal({model: UM.modalMap});
            $('body').append(UM.modalMapView.el);
        }
    },
    /**
     * Создание/обновление Яндекс карты и изменение на нее меток
     */
    createYaMap: function () {
        var $elMap = $('#umMap');

        if (!$elMap.length) return false;

        $elMap.children().remove();

        var mapShopArr = this.model.shopCollection.filterByCityForMap(this.model.get('city')).toJSON();

        var latSum = 0,
            lonSum = 0,
            latAvg = 0,
            lonAvg = 0;

        _.each(mapShopArr, function (obj) {
            latSum += Number(obj.lat);
            lonSum += Number(obj.lon);
        });
        latAvg = latSum / mapShopArr.length;
        lonAvg = lonSum / mapShopArr.length;

        if (mapShopArr.length) {
            UM.map = new ymaps.Map('umMap', {
                center: [lonAvg, latAvg],
                zoom: 10
            });
            UM.mapShopCollection = new Backbone.Collection(mapShopArr);

            var Placemark = Backbone.Ymaps.Placemark.extend({
                placemarkOptions: {},

                initialize: function () {
                    var colors = Object.keys(this.styles),
                        idx = _.random(0, colors.length);

                    this.setStyle(colors[idx]);
                },

                hintContent: 'Выбрать студию',

                balloonContent: function () {
                    return 'Выбрана ' + this.model.get('title');
                },

                iconContent: function () {
                    return this.model.get('mr3id');
                },

                events: {
                    'click': 'selectShop'
                },

                selectShop: function () {
                    UM.helpers.vent.trigger('user:setShop', this.model.get('title'));
                }
            });

            UM.mapShopCollectionView = new Backbone.Ymaps.CollectionView({
                geoItem: Placemark,
                collection: UM.mapShopCollection,
                map: UM.map
            });

            UM.mapShopCollectionView.render();
        } else {
            this.hideYaMap();
        }

    },

    removeYaMap: function () {
        if(UM.map) {
            UM.map.destroy();
            UM.mapShopCollection.reset();
            UM.mapShopCollectionView.destroy();
        }
    },

    showYaMap: function () {
        if (UM.mapShopCollectionView) {
            $('.um-modal').removeClass('um-hidden');
            this.hideSelectShop();
        }
    },

    hideYaMap: function () {
        $('.um-modal').addClass('um-hidden');
    },

    concealed: function (e) {
        var $label = $(e.target),
            $parent = $label.parent(),
            $input = $parent[0].classList.contains('um-wrapper-hidden') ?
                $parent.find('.um-field') : $label.siblings('.um-form-control');

        if ($input.hasClass('um-hidden'))
            $input.removeClass('um-hidden');
        else
            $input.addClass('um-hidden')
    },

    /**
     * @deprecated since version 2.0
     */
    addSteps: function () {
        this.$el.addClass('um-form-step um-form-step-1');
        this.$el.find('.um-form-group-firstname').addClass('um-form-group-step-1');
        this.$el.find('.um-form-group-email').addClass('um-form-group-step-1');
        this.$el.find('.um-form-group-phone').addClass('um-form-group-step-1');
        this.$el.find('.um-form-group-city').addClass('um-form-group-step-2');
        this.$el.find('.um-form-group-shop').addClass('um-form-group-step-2');
        this.$el.find('.um-form-group-wishes').addClass('um-form-group-step-2');
        this.$el.find('.um-form-group-personal-data').addClass('um-form-group-step-2');
        this.$el.find('.um-btn[type="submit"]').addClass('um-btn-step-2');

        this.$el.find('.um-btn[type="submit"]')
            .before('<button type="button" class="um-btn um-btn-primary um-btn-next um-btn-step-1">Дальше</button>' +
                '<button type="button" class="um-btn um-btn-primary um-btn-prev um-btn-step-2">Назад</button>');

        var that = this;
        this.$el.on('click', '.um-btn-next', function (e) {
            /** Предварительная проверка на валидность видемых элементов формы */
            var errors = that.model.validate(that.getVisibleFormControl());
            if (errors)
                that.invalid(that.model, errors);
            else
                that.nextStep();
        });

        this.$el.on('click', '.um-btn-prev', function (e) {
            that.prevStep();
        });
    },

    /**
     * @deprecated since version 2.0
     */
    nextStep: function () {
        this.$el.removeClass('um-form-step-1').addClass('um-form-step-2');
    },

    /**
     * @deprecated since version 2.0
     */
    prevStep: function () {
        this.$el.removeClass('um-form-step-2').addClass('um-form-step-1');
    },

    toNextStep: function () {
        this.setAttrs();
        this.trigger('form:nextStep', this.options);
    },

    toPrevStep: function () {
        this.setAttrs();
        this.trigger('form:prevStep', this.options);
    }
});