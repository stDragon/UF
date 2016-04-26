/**
 *  Форма заявки на просчет
 *  */

module.exports = Backbone.View.extend({

    tagName: 'form',
    className: 'um-form',
    template: 'formCalculationTpl',

    events: {
        'focus #umPhone': 'initMask',
        'focus #umCity': 'showSelectCity',
        'focus #umShop': 'showSelectShop',
        'focus input:not(#umCity)': 'hideSelectCity',
        'focus input:not(#umShop)': 'hideSelectShop',
        'input input': 'setAttrs',
        'blur input': 'setAttr',
        'blur textarea': 'setAttr',
        'click .um-icon-add-location': 'showYaMap',
        'submit': 'save'
    },

    initialize: function () {
        UM.cityCollection = new UM.Collections.Citys([], this.model.toJSON());
        UM.cityCollection.fetch().then(function () {
            UM.cityCollectionView = new UM.Views.Citys({collection: UM.cityCollection});
        });

        UM.shopCollection = new UM.Collections.Shops([], this.model.toJSON());
        UM.shopCollection.fetch();

        this.render();

        this.model.on('change', this.setValue, this);
        if (UM.configsCollection.get(this.model.get('configId')).get('showShop')) {
            this.createYaMapModal();
            this.model.on('change', this.createSelectShop, this);
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

    showSelectCity: function () {
        var $el = this.$el.find('.um-dropdown-content.um-city-list');

        if (!$el.length)
            this.$el.find('[name=city]').before(UM.cityCollectionView.el);
        else
            UM.cityCollectionView.show();
    },

    hideSelectCity: function () {
        UM.cityCollectionView.hidden();
    },

    createSelectShop: function () {
        if (this.model.hasChanged("city")) {
            var city = this.model.get('city'),
                shop = this.model.get('shop');

            this.removeSelectShop();

            if (city && UM.cityCollection.findWhere({'name': city}).get('showShop')) {
                this.addSelectShop(city);
                if (UM.configsCollection.get(this.model.get('configId')).get('showShop')) {
                    this.createYaMap();
                }
            } else {
                this.removeSelectShop();
                this.removeYaMap();
                this.model.set('shop', '');
            }
        }
    },

    addSelectShop: function (city) {
        var $el = this.$el.find('[name=shop]');

        UM.cityShopCollection = UM.shopCollection.filterByCity(city);
        UM.shopCollectionView = new UM.Views.Shops({collection: UM.cityShopCollection});

        if (UM.shopCollectionView.$el.children().length) {
            $el.before(UM.shopCollectionView.el);

            $el[0].disabled = false;
            $el.parent('.um-form-group').removeClass('um-hidden');
        }
    },

    removeSelectShop: function () {
        var $el = this.$el.find('[name=shop]');

        $el.siblings('.um-dropdown-content').remove();

        $el[0].disabled = true;
        $el.parent('.um-form-group').addClass('um-hidden');
    },

    showSelectShop: function () {
        UM.vent.trigger('shopList:show', this.model.toJSON());
    },

    hideSelectShop: function () {
        UM.vent.trigger('shopList:hide', this.model.toJSON());
    },

    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function (template) {
            var temp = _.template(template);
            var data = _.extend(that.model.toJSON(), UM.configsCollection.get(that.model.get('configId')).toJSON());
            var html = $(temp(data));
            that.$el.html(html);
        });
        return this;
    },
    /** Устанавливает значения полей формы*/
    setValue: function () {
        var attr = this.model.toJSON();
        _.each(attr, function (num, key) {
            this.$el.find('[name=' + key + ']').val(num);
        }, this);
    },
    /**
     * Сохраняет изменения поля в модель.
     */
    setAttr: function (e) {
        var name = $(e.target).attr('name'),
            val = $(e.target).val();
        this.model.set(name, val);
    },
    /**
     * Сохраняет все поля в модель.
     */
    setAttrs: function () {
        var data = {};
        this.$el.find('.um-form-control').each(function () {
            data[this.name] = $(this).val();
        });

        this.model.set(data);
    },
    /**
     * Сохраняет все поля на сервер.
     */
    save: function (e) {
        e.preventDefault();

        var data = {};
        this.$el.find('.um-form-control').each(function () {
            data[this.name] = $(this).val();
        });

        this.model.save(data);
    },
    /**
     * Кнопка отправки становится неактивной
     */
    disabledSubmit: function () {
        this.$el.find('button:submit')[0].disabled = true;
    },
    /**
     * Кнопка отправки становится активной
     */
    enabledSubmit: function () {
        this.$el.find('button:submit')[0].disabled = false;
    },

    valid: function () {
        this.$el.find('input')
            .closest('.um-form-group').removeClass('um-has-error')
            .children('.um-tooltip').remove();
    },
    /**
     * Вывод ошибок
     * @param  {object} model - Диаметр окружности.
     * @param  {object} errors - Диаметр окружности.
     */
    invalid: function (model, errors) {
        this.$el.find('input')
            .closest('.um-form-group').removeClass('um-has-error')
            .children('.um-tooltip').remove();
        _.each(errors, function (error) {
            var $el = this.$el.find('[name=' + error.attr + ']'),
                $group = $el.closest('.um-form-group');

            $group.addClass('um-has-error');
            var tooltip = new UM.Views.Tooltip();
            tooltip.$el.html(error.text);
            $group.append(tooltip.el);
        }, this);
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

        var mapShopArr = UM.shopCollection.filterByCityForMap(this.model.get('city')).toJSON();

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
            UM.vent.trigger('shopList:hide', this.options.configId);
        }
    },

    hideYaMap: function () {
        $('.um-modal').addClass('um-hidden');
    }
});