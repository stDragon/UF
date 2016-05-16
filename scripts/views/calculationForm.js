/**
 *  Форма заявки на просчет
 *  */

module.exports = Backbone.Ribs.View.extend({

    tagName: 'form',
    className: 'um-form',
    template: 'formCalculationTpl',

    events: {
        'focus #umPhone': 'initMask',
        //'focus #umCity': 'showSelectCity',
        //'focus #umShop': 'showSelectShop',
        'focus input:not(#umCity)': 'hideSelectCity',
        'focus input:not(#umShop)': 'hideSelectShop',
        'input input': 'setAttrs',
        'blur input': 'setAttr',
        'blur textarea': 'setAttr',
        'blur': 'preValidation',
        'click .um-icon-add-location': 'showYaMap',
        'change input:checkbox': 'changed',
        'submit': 'save'
    },

    initialize: function () {
        var that = this;
        this.cityCollection = new UM.Collections.Citys([], this.model.toJSON());
        this.cityCollection.fetch().then(function () {
            that.cityCollectionView = new UM.Views.Citys({collection: that.cityCollection});
        });

        this.shopCollection = new UM.Collections.Shops([], this.model.toJSON());
        this.shopCollection.fetch();

        this.render();

        this.model.on('change', this.setValue, this);
        this.model.on('change:personalData', this.preValidation, this);

        if (UM.configsCollection.get(this.model.get('configId')).get('formConfig').shop.show) {
            this.createYaMapModal();
            this.model.on('change:city', this.createSelectShop, this);
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

        this.listenTo(this.cityCollection, 'change:active', function() {
            this.model.set('shop', '');
            var active = this.cityCollection.getActive();
            if (active) this.model.set('city', active);
        });

        this.listenTo(this.shopCollection, 'change:active', function() {
            var active = this.shopCollection.getActive();
            if (active) this.model.set('shop', active);
        });

        this.listenTo(this.model, 'change:city', function () {
            this.model.set('shop', '');
        });
    },

    changed: function(e) {
        var changed = e.currentTarget;

        var value;
        if (changed.type == 'checkbox') {
            value = changed.checked;
            if (changed.checked)
                $(changed).parent('label').addClass('um-checked');
            else
                $(changed).parent('label').removeClass('um-checked');
        } else {
            value = changed.value;
        }

        var obj = {};
        obj[changed.name] = value;
        this.model.set(obj);
    },

    initMask: function () {
        this.$el.find('[name=phone]').inputmask({"mask": "+7(999)999-99-99"});
    },

    showSelectCity: function () {
        var $el = this.$el.find('.um-dropdown-content.um-city-list');

        if (!$el.length)
            this.$el.find('[name=city]').before(this.cityCollectionView.el);
        else
            this.cityCollectionView.show();
    },

    hideSelectCity: function () {
        this.cityCollectionView.hidden();
    },

    createSelectShop: function () {
        var city = this.model.get('city'),
            shop = this.model.get('shop');

        this.removeSelectShop();

        /** Из коллекции городов находим город и если у него выведено свойство "showShop", добавляем поле с выбором студий */
        if (city && this.cityCollection.findWhere({'name': city}) && this.cityCollection.findWhere({'name': city}).get('showShop')) {
            this.addSelectShop(city);
            if (UM.configsCollection.get(this.model.get('configId')).get('formConfig').shop.mapShow) {
                this.createYaMap();
            }
        } else {
            this.removeSelectShop();
            this.removeYaMap();
            this.model.set('shop', '');
        }
    },

    addSelectShop: function (city) {
        var $el = this.$el.find('[name=shop]');

        this.cityShopCollection = this.shopCollection.filterByCity(city);
        this.shopCollectionView = new UM.Views.Shops({collection: this.cityShopCollection});

        if (this.shopCollectionView.$el.children().length) {
            $el.before(this.shopCollectionView.el);

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
            that.preValidation();
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

    preValidation: function(){
        if (this.model.options.personalData.required) {
            if (this.model.get('personalData'))
                this.enabledSubmit();
            else
                this.disabledSubmit();
        }
    },

    valid: function () {
        this.$el.find('input')
            .closest('.um-form-group').removeClass('um-has-error')
            .children('.um-tooltip').remove();
    },
    /**
     * Вывод ошибок
     * @param  {object} model.
     * @param  {object} errors.
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

        var mapShopArr = this.shopCollection.filterByCityForMap(this.model.get('city')).toJSON();

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
            //UM.vent.trigger('shopList:hide', this.options.configId);
        }
    },

    hideYaMap: function () {
        $('.um-modal').addClass('um-hidden');
    }
});