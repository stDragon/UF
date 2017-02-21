/**
 *  Форма заявок
 *  */

module.exports = UM.Views.Form.extend({

    tagName: 'form',
    className: 'um-form',
    template: 'formUser',

    events: {
        'focus input': 'showOptionList',
        'keyup [name="city"]': 'search',
        'keyup [name="phone"]': 'setAttrs',
        'change input': 'setAttrs',
        'change textarea': 'setAttrs',
        'click .um-icon-add-location': 'showYaMap',
        'change input:checkbox': 'changed',
        'click .um-static-select li': 'chooseValue',
        'submit': 'save',
        'click': 'click',
        'input [name="name"]' : 'parseName'
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
        if (this.model.priceCollection) {
            this.priceCollectionView = new UM.Views.Prices({collection: this.model.priceCollection});
        }
        if (this.model.colorCollection) {
            this.colorCollectionView = new UM.Views.Colors({collection: this.model.colorCollection});
        }
        if (this.model.roomCollection) {
            this.roomCollectionView = new UM.Views.Rooms({collection: this.model.roomCollection});
        }
        if (this.model.gearCollection) {
            this.gearCollectionView = new UM.Views.Gears({collection: this.model.gearCollection});
        }
        if (this.model.lightingCollection) {
            this.lightingCollectionView = new UM.Views.Lightings({collection: this.model.lightingCollection});
        }
        if (this.model.worktypeCollection) {
            this.worktypeCollectionView = new UM.Views.Worktypes({collection: this.model.worktypeCollection});
        }
        if (this.model.designCollection) {
            this.designCollectionView = new UM.Views.Designs({collection: this.model.designCollection});
        }
        if (this.model.wallCollection) {
            this.wallCollectionView = new UM.Views.Walls({collection: this.model.wallCollection});
        }
        if (this.model.floorTypeCollection) {
            this.floorTypeCollectionView = new UM.Views.FloorTypes({collection: this.model.floorTypeCollection});
        }
        if (this.model.positionCollection) {
            this.positionCollectionView = new UM.Views.Positions({collection: this.model.positionCollection});
        }
        if (this.model.addPlaceCollection) {
            this.addPlaceCollectionView = new UM.Views.AddPlaces({collection: this.model.addPlaceCollection});
        }
        if (this.model.kitchenStyleCollection) {
            this.kitchenStyleCollectionView = new UM.Views.KitchenStyles({collection: this.model.kitchenStyleCollection});
        }
        if (this.model.upperSectionCollection) {
            this.upperSectionCollectionView = new UM.Views.UpperSections({collection: this.model.upperSectionCollection});
        }
        if (this.model.lowerSectionCollection) {
            this.lowerSectionCollectionView = new UM.Views.LowerSections({collection: this.model.lowerSectionCollection});
        }
        if (this.model.diningGroupCollection) {
            this.diningGroupCollectionView = new UM.Views.DiningGroups({collection: this.model.diningGroupCollection});
        }
        if (this.model.tabletopMaterialCollection) {
            this.tabletopMaterialCollectionView = new UM.Views.TabletopMaterials({collection: this.model.tabletopMaterialCollection});
        }
        if (this.model.washingTypeCollection) {
            this.washingTypeCollectionView = new UM.Views.WashingTypes({collection: this.model.washingTypeCollection});
        }
        if (this.model.stoveStyleCollection) {
            this.stoveStyleCollectionView = new UM.Views.StoveStyles({collection: this.model.stoveStyleCollection});
        }
        if (this.model.hoodStyleCollection) {
            this.hoodStyleCollectionView = new UM.Views.HoodStyles({collection: this.model.hoodStyleCollection});
        }
        if (this.model.hoodTypeCollection) {
            this.hoodTypeCollectionView = new UM.Views.HoodTypes({collection: this.model.hoodTypeCollection});
        }

        this.render();

        if (this.model.options.class) this.$el.addClass(this.model.options.class);

        this.model.on('change', this.setValue, this);

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

        /*   данные гугл аналитики   */
        var ga = this.getCookie('_ga'),
            utm = this.getCookie('sbjs_current');

        this.model.set('ga', ga);
        this.model.set('utm', utm);
    },

    getCookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },

    initPhoneMask: function () {
        var selector = this.$el.find('.um-form-group-phone');

        if (selector.length && !this.phoneView) {
            this.phoneView = new UM.Views.PhoneInput({el: selector, form: this});
        }
    },

    initEmailMask: function () {
        var selector = this.$el.find('.um-form-group-email');

        if (selector.length && !this.emailView) {
            this.emailView = new UM.Views.EmailInput({el: selector, form: this});
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
            this.addSelectList('city', this.cityCollectionView);
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
        var that = this;
        UM.TemplateManager.get(this.template, function (template) {
            var temp = _.template(template);
            var data = _.extend(that.model.toJSON(), UM.configsCollection.get(that.model.get('configId')).toJSON());
            var html = $(temp(data));
            that.$el.html(html);
            that.$el.prop("enctype", "multipart/form-data");
            that.$el.attr("data-remote", "true");

            if (that.cityCollectionView) {
                that.addSelectList('city', that.cityCollectionView);
                if(that.model.shopCollection)
                    that.createSelectShop();
            }
            if (that.kitchenCollectionView) {
                that.addSelectList('kitchen', that.kitchenCollectionView);
            }
            if (that.priceCollectionView) {
                that.addSelectList('price', that.priceCollectionView);
            }
            if (that.colorCollectionView) {
                that.addSelectList('color', that.colorCollectionView);
            }
            if (that.roomCollectionView) {
                that.addSelectList('room', that.roomCollectionView);
            }
            if (that.gearCollectionView) {
                that.addSelectList('gear', that.gearCollectionView);
            }
            if (that.lightingCollectionView) {
                that.addSelectList('lighting', that.lightingCollectionView);
            }
            if (that.worktypeCollectionView) {
                that.addSelectList('worktype', that.worktypeCollectionView);
            }
            if (that.designCollectionView) {
                that.addSelectList('design', that.designCollectionView);
            }
            if (that.wallCollectionView) {
                that.addSelectList('walls', that.wallCollectionView);
            }
            if (that.floorTypeCollectionView) {
                that.addSelectList('floorType', that.floorTypeCollectionView);
            }
            if (that.positionCollectionView) {
                that.addSelectList('position', that.positionCollectionView);
            }
            if (that.addPlaceCollectionView) {
                that.addSelectList('addPlace', that.addPlaceCollectionView);
            }
            if (that.kitchenStyleCollectionView) {
                that.addSelectList('kitchenStyle', that.kitchenStyleCollectionView);
            }
            if (that.upperSectionCollectionView) {
                that.addSelectList('upperSection', that.upperSectionCollectionView);
            }
            if (that.lowerSectionCollectionView) {
                that.addSelectList('lowerSection', that.lowerSectionCollectionView);
            }
            if (that.diningGroupCollectionView) {
                that.addSelectList('diningGroup', that.diningGroupCollectionView);
            }
            if (that.tabletopMaterialCollectionView) {
                that.addSelectList('tabletopMaterial', that.tabletopMaterialCollectionView);
            }
            if (that.washingTypeCollectionView) {
                that.addSelectList('washingType', that.washingTypeCollectionView);
            }
            if (that.stoveStyleCollectionView) {
                that.addSelectList('stoveStyle', that.stoveStyleCollectionView);
            }
            if (that.hoodStyleCollectionView) {
                that.addSelectList('hoodStyle', that.hoodStyleCollectionView);
            }
            if (that.hoodTypeCollectionView) {
                that.addSelectList('hoodType', that.hoodTypeCollectionView);
            }
            that.initPhoneMask();
            that.initEmailMask();
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

            /* Костыль для кредитной формы твой дом */
            if (UM.configsCollection.get(that.model.get('configId')).get('style') === 'um-your-house'
                && UM.configsCollection.get(that.model.get('configId')).get('formType') === 'credit') {
                that.$el.find('.um-form-group-firstname, .um-form-group-email, .um-form-group-phone ').wrapAll("<div class='um-form-col'></div>");
                that.$el.find('.um-form-group-wishes , .um-form-group-personal-data').wrapAll("<div class='um-form-col'></div>");
            }

            /* костыль оборачивающий сабмит кнопку в стиле для ванн */
            if (UM.configsCollection.get(that.model.get('configId')).get('style') === 'um-bath') {

                that.$el.find('.js-create-order').wrap("<div class='btn-wrap'></div>");
            }
        });
        return this;
    },

    addSelectList: function (inputName, collectionView) {
        if(this.$el.find('ul').is('.um-' + inputName + '-list')) {
            this.$el.find('.um-' + inputName + '-list').remove();
        }
        this.$el.find('[name=' + inputName + ']').before(collectionView.el);
        return this;
    },

    preValidation: function(){
        var validate = this.model.validate(this.model.attributes);
        if(validate == 0)
            this.enabledSubmit();
        else
            this.disabledSubmit();
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

        var mapShopArr = this.model.shopCollection.filterByCityForMap(this.model.get('cityId')).toJSON();

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
                    UM.vent.trigger('user:setShop', this.model);
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
            /** Предварительная проверка на валидность видимых элементов формы */
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

    nextStep: function () {
        this.$el.removeClass('um-form-step-1').addClass('um-form-step-2');
    },

    prevStep: function () {
        this.$el.removeClass('um-form-step-2').addClass('um-form-step-1');
    }
});