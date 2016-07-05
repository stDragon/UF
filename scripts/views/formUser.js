/**
 *  Форма заявок
 *  */

module.exports = UM.Views.Form.extend({

    tagName: 'form',
    className: 'um-form',
    template: 'formUser',

    events: {
        'focus input': 'showOptionList',
        'input input': 'setAttrs',
        //'keyup [name="city"]': 'search',
        'blur input': 'setAttr',
        'blur textarea': 'setAttr',
        'blur': 'preValidation',
        'click .um-icon-add-location': 'showYaMap',
        'change input:checkbox': 'changed',
        'submit': 'save',
        'click': 'click'
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

    initialize: function () {

        if (this.model.cityCollection) {
            this.cityCollectionView = new UM.Views.Citys({collection: this.model.cityCollection});
        }

        if (this.model.kitchenCollection) {
            this.kitchenCollectionView = new UM.Views.Kitchens({collection: this.model.kitchenCollection});
        }

        this.render();

        if (this.model.options.class) this.$el.addClass(this.model.options.class);

        this.model.on('change', this.setValue, this);
        this.model.on('change:personalData', this.preValidation, this);

        if (this.model.options.shop.show) {
            this.createYaMapModal();
            this.model.on('change:cityId', this.createSelectShop, this);
        }
        this.listenTo(this.model, 'request', function () {
            UM.vent.trigger('page:showLoader', this.model.get('configId'));
            this.valid();
            this.disabledSubmit();
        });
        this.listenTo(this.model, 'sync', function () {
            UM.vent.trigger('page:hideLoader', this.model.get('configId'));
            UM.vent.trigger('page:showPhoneForm', this.model.get('configId'));
        });
        this.listenTo(this.model, 'error', function () {
            UM.vent.trigger('page:hideLoader', this.model.get('configId'));
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

    initPhoneMask: function () {
        var selector = this.$el.find('.um-form-group-phone');

        if (selector.length && !this.phoneView) {
            this.phoneView = new UM.Views.PhoneInput({el: selector, form: this});
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
            $el.parent('.um-form-group').removeClass('um-hidden');
        }
    },

    removeSelectShop: function () {
        var $el = this.$el.find('[name=shop]');

        $el.siblings('.um-dropdown-content').remove();

        $el.prop('disabled', true );
        $el.parent('.um-form-group').addClass('um-hidden');
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
        var that = this;
        UM.TemplateManager.get(this.template, function (template) {
            var temp = _.template(template);
            var data = _.extend(that.model.toJSON(), UM.configsCollection.get(that.model.get('configId')).toJSON());
            var html = $(temp(data));
            that.$el.html(html);
            if (that.cityCollectionView) {
                that.addSelectList('city', that.cityCollectionView);
                if(that.model.shopCollection)
                    that.createSelectShop();
            }
            if (that.kitchenCollectionView) {
                that.addSelectList('kitchen', that.kitchenCollectionView);
            }
            that.initPhoneMask();
            that.preValidation();

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
        });
        return this;
    },

    addSelectList: function (inputName, collectionView) {
        this.$el.find('[name=' + inputName + ']').before(collectionView.el);
        return this;
    },

    preValidation: function(){
        if (this.model.options.personalData.required) {
            if (this.model.get('personalData'))
                this.enabledSubmit();
            else
                this.disabledSubmit();
        }
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
                    UM.vent.trigger('user:setShop', this.model.get('title'));
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
        console.log($input);
        if ($input.hasClass('um-hidden'))
            $input.removeClass('um-hidden');
        else
            $input.addClass('um-hidden')
    },

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
            that.nextStep();
        });

        this.$el.on('click', '.um-btn-prev', function (e) {
            that.prevStep();
        });
    },

    nextStep: function () {
        this.$el.removeClass('um-form-step-1').addClass('um-form-step-2');
    },

    prevStep: function () {
        this.$el.removeClass('um-form-step-2').addClass('um-form-step-1');
    }
});