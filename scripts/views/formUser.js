/**
 *  Форма заявок
 *  */

module.exports = UM.Views.Form.extend({

    tagName: 'form',
    className: 'um-form',
    template: 'formUser',

    events: {
        'focus #umPhone': 'initMask',
        'focus input': 'showOptionList',
        'input input': 'setAttrs',
        'keyup [name="city"]': 'search',
        'blur input': 'setAttr',
        'blur textarea': 'setAttr',
        'blur': 'preValidation',
        'click .um-icon-add-location': 'showYaMap',
        'change input:checkbox': 'changed',
        'submit': 'save'
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
    },

    initMask: function () {
        this.$el.find('[name=phone]').inputmask({"mask": "+7(999)999-99-99"});
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
                that.createSelectShop();
            }
            if (that.kitchenCollectionView) {
                that.addSelectList('kitchen', that.kitchenCollectionView);
            }
            that.preValidation();
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
    }
});