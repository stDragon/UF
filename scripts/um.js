global.$ = require('jquery');
global._ = require('underscore');
global.Backbone = require('backbone');
conf = require('../nconf.js');
require('backbone.ribs');

var UM = window.UM || {
        Models: {},
        Collections: {},
        Views: {},
        Router: {},
        option: [],
        pages: [],
        forms: [],
        buttons: [],
        serverUrl: conf.server.url + '/um/umdata',
        conf: conf
    };

UM.Inputmask = require('../public/libs/jquery.inputmask/dist/inputmask/inputmask.js');
require('../public/libs/jquery.inputmask/dist/inputmask/jquery.inputmask.js');
require('../public/libs/jquery.inputmask/dist/inputmask/inputmask.extensions.js');
require('./Backbone.Ymaps.js');

window.UM = UM;

UM.prices = require('../prices.js');
UM.colors = require('../colors.js');
UM.rooms = require('../rooms.js');
UM.gears = require('../gear.js');
UM.worktypes = require('../worktype.js');
UM.designs = require('../design.js');
UM.walls = require('../walls.js');
UM.floorTypes = require('../floorType.js');
UM.positions = require('../position.js');
UM.addPlaces = require('../addPlace.js');
UM.kitchenStyles = require('../kitchenStyle.js');
UM.upperSections = require('../upperSection.js');
UM.lowerSections = require('../lowerSection.js');
UM.diningGroups = require('../diningGroup.js');
UM.tabletopMaterials = require('../tabletopMaterial.js');
UM.washingTypes = require('../washingType.js');
UM.stoveStyles = require('../stoveStyle.js');
UM.hoodStyles = require('../hoodStyle.js');
UM.hoodTypes = require('../hoodType.js');
UM.lightings = require('../lighting.js');

UM.Models.Logger = require('./models/logger.js');
UM.Models.Config = require('./models/config.js');
UM.Models.City = require('./models/city.js');
UM.Models.User = require('./models/user.js');
UM.Models.Phone = require('./models/phone.js');
UM.Models.Shop = require('./models/shop.js');
UM.Models.Modal = require('./models/modal.js');
UM.Models.Kitchen = require('./models/kitchen.js');
UM.Models.PhoneCode = require('./models/phoneCode.js');
UM.Models.Price = require('./models/price.js');
UM.Models.Color = require('./models/color.js');
UM.Models.Room = require('./models/room.js');
UM.Models.Gear = require('./models/gear.js');
UM.Models.Worktype = require('./models/worktype.js');
UM.Models.Design = require('./models/design.js');
UM.Models.Wall = require('./models/wall.js');
UM.Models.FloorType = require('./models/floorType.js');
UM.Models.Position = require('./models/position.js');
UM.Models.AddPlace = require('./models/addPlace.js');
UM.Models.KitchenStyle = require('./models/kitchenStyle.js');
UM.Models.UpperSection = require('./models/upperSection.js');
UM.Models.LowerSection = require('./models/lowerSection.js');
UM.Models.DiningGroup = require('./models/diningGroup.js');
UM.Models.TabletopMaterial = require('./models/tabletopMaterial.js');
UM.Models.WashingType = require('./models/washingType.js');
UM.Models.StoveStyle = require('./models/stoveStyle.js');
UM.Models.HoodStyle = require('./models/hoodStyle.js');
UM.Models.HoodType = require('./models/hoodType.js');
UM.Models.Lighting = require('./models/lighting.js');

UM.Collections.Configs = require('./collections/configs.js');
UM.Collections.Citys = require('./collections/citys.js');
UM.Collections.Shops = require('./collections/shops.js');
UM.Collections.Kitchens = require('./collections/kitchens.js');
UM.Collections.PhoneCodeCollection = require('./collections/phoneCodes.js');
UM.Collections.Prices = require('./collections/prices.js');
UM.Collections.Colors = require('./collections/colors.js');
UM.Collections.Rooms = require('./collections/rooms.js');
UM.Collections.Gears = require('./collections/gears.js');
UM.Collections.Worktypes = require('./collections/worktypes.js');
UM.Collections.Designs = require('./collections/designs.js');
UM.Collections.Walls = require('./collections/walls.js');
UM.Collections.FloorTypes = require('./collections/floorTypes.js');
UM.Collections.Positions = require('./collections/positions.js');
UM.Collections.AddPlaces = require('./collections/addPlaces.js');
UM.Collections.KitchenStyles = require('./collections/kitchenStyles.js');
UM.Collections.UpperSections = require('./collections/upperSections.js');
UM.Collections.LowerSections = require('./collections/lowerSections.js');
UM.Collections.DiningGroups = require('./collections/diningGroups.js');
UM.Collections.TabletopMaterials = require('./collections/tabletopMaterials.js');
UM.Collections.WashingTypes = require('./collections/washingTypes.js');
UM.Collections.StoveStyles = require('./collections/stoveStyles.js');
UM.Collections.HoodTypes = require('./collections/hoodTypes.js');
UM.Collections.HoodStyles = require('./collections/hoodStyles.js');
UM.Collections.Lightings = require('./collections/lightings.js');

UM.Views.Tooltip = require('./views/tooltip.js');
UM.Views.Loader = require('./views/loader.js');
UM.Views.Modal = require('./views/modal.js');
UM.Views.Config = require('./views/config.js');
UM.Views.Page = require('./views/page.js');
UM.Views.Button = require('./views/button.js');
UM.Views.ButtonStatic = require('./views/buttonStatic.js');
UM.Views.ButtonFixed = require('./views/buttonFixed.js');
UM.Views.Form = require('./views/form.js');
UM.Views.InputSelect = require('./views/inputSelect.js');
UM.Views.InputSelectOption = require('./views/inputSelectOption.js');
UM.Views.Checkbox = require('./views/Checkbox.js');
UM.Views.CheckboxList = require('./views/CheckboxList.js');
UM.Views.FormUser = require('./views/formUser.js');
UM.Views.FormUserPhone = require('./views/formUserPhone.js');
UM.Views.Confirm = require('./views/confirm.js');
UM.Views.City = require('./views/city.js');
UM.Views.Citys = require('./views/citys.js');
UM.Views.Shop = require('./views/shop.js');
UM.Views.Shops = require('./views/shops.js');
UM.Views.Kitchen = require('./views/kitchen.js');
UM.Views.Kitchens = require('./views/kitchens.js');
UM.Views.PhoneInput = require('./views/phoneInput.js');
UM.Views.PhoneCode = require('./views/phoneCode.js');
UM.Views.PhoneCodeCollection = require('./views/phoneCodeCollection.js');
UM.Views.Price = require('./views/price.js');
UM.Views.Prices = require('./views/prices.js');
UM.Views.Color = require('./views/color.js');
UM.Views.Colors = require('./views/colors.js');
UM.Views.Room = require('./views/room.js');
UM.Views.Rooms = require('./views/rooms.js');
UM.Views.Gear = require('./views/gear.js');
UM.Views.Gears = require('./views/gears.js');
UM.Views.Worktype = require('./views/worktype.js');
UM.Views.Worktypes = require('./views/worktypes.js');
UM.Views.Design = require('./views/design.js');
UM.Views.Designs = require('./views/designs.js');
UM.Views.Wall = require('./views/wall.js');
UM.Views.Walls = require('./views/walls.js');
UM.Views.FloorType = require('./views/floorType.js');
UM.Views.FloorTypes = require('./views/floorTypes.js');
UM.Views.Position = require('./views/position.js');
UM.Views.Positions = require('./views/positions.js');
UM.Views.AddPlace = require('./views/addPlace.js');
UM.Views.AddPlaces = require('./views/addPlaces.js');
UM.Views.KitchenStyle = require('./views/kitchenStyle.js');
UM.Views.KitchenStyles = require('./views/kitchenStyles.js');
UM.Views.UpperSection = require('./views/upperSection.js');
UM.Views.UpperSections = require('./views/upperSections.js');
UM.Views.LowerSection = require('./views/lowerSection.js');
UM.Views.LowerSections = require('./views/lowerSections.js');
UM.Views.DiningGroup = require('./views/diningGroup.js');
UM.Views.DiningGroups = require('./views/diningGroups.js');
UM.Views.TabletopMaterial = require('./views/tabletopMaterial.js');
UM.Views.TabletopMaterials = require('./views/tabletopMaterials.js');
UM.Views.WashingType = require('./views/washingType.js');
UM.Views.WashingTypes = require('./views/washingTypes.js');
UM.Views.StoveStyle = require('./views/stoveStyle.js');
UM.Views.StoveStyles = require('./views/stoveStyles.js');
UM.Views.HoodStyle = require('./views/hoodStyle.js');
UM.Views.HoodStyles = require('./views/hoodStyles.js');
UM.Views.HoodType = require('./views/hoodType.js');
UM.Views.HoodTypes = require('./views/hoodTypes.js');
UM.Views.Lighting = require('./views/lighting.js');
UM.Views.Lightings = require('./views/lightings.js');

/** @todo Надо определить куда это определить */
UM.codes = [
    {
        isoCode: 'RU',
        name: 'Россия',
        code: '7',
        mask: '999-999-99-99',
        img: UM.conf.server.url + '/public/img/flags/ru.gif',
        active: true
    },
    {
        isoCode: 'BY',
        name: 'Белоруссия',
        code: '375',
        mask: '999-99-99-99',
        img: UM.conf.server.url + '/public/img/flags/by.gif'
    },
    {
        available: false,
        isoCode: 'UA',
        name: 'Украина',
        code: '380',
        mask: '999-99-99-99',
        img: UM.conf.server.url + '/public/img/flags/ua.gif'
    },
    {
        isoCode: 'KZ',
        name: 'Казахстан',
        code: '77',
        mask: '99-999-99-99',
        img: UM.conf.server.url + '/public/img/flags/kz.gif'
    },
    {
        isoCode: 'KG',
        name: 'Киргизия',
        code: '996',
        mask: '999-999-999',
        img: UM.conf.server.url + '/public/img/flags/kg.gif'
    }
];

/**
 *  Запуск модуля
 *  @param  {string} option - Опции для инициализации модуля.
 *  @param  {string} data - Данные передаваемые в модуль.
 *  */
UM.init = function (option, data) {
    $(document).ready(function(){
        UM.option.push(option);
        /** создаем новую коллекцию конфигураций */
        if (!UM.configsCollection)
            UM.configsCollection = new UM.Collections.Configs([], option);

        var config = new UM.Models.Config(option, data);
        UM.configsCollection.add(config);

        config.fetch().then(function () {
            new UM.Views.Config({model: config});
        }, UM.ajaxError);
    });
};

/**
 *  Helper создания событий
 *  */
UM.vent = _.extend({}, Backbone.Events);

/**
 *  Helper шаблон из статичного DOM элемента по его ID
 *  */
UM.template = function (id) {
    return _.template($('#' + id).html());
};

/**
 *  Ajax подгрузка шаблона
 *  */
UM.TemplateManager = {
    templates: {},

    get: function (id, callback) {
        var template = this.templates[id];

        if (template) {
            callback(template);

        } else {

            var that = this;
            $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                options.crossDomain = {
                    crossDomain: true
                };
                options.xhrFields = {
                    withCredentials: true
                };
            });
            $.ajax({
                url: conf.server.url + '/module/' + id,
                success: function (template) {
                    var tmpl = template;
                    that.templates[id] = tmpl;
                    callback(tmpl);
                },
                error: UM.ajaxError
            });

        }

    }

};

UM.ajaxError = function(jqXHR) {
    var error = {
        responseText: jqXHR.responseText,
        status: jqXHR.status,
        statusText: jqXHR.statusText
    };

    new UM.Models.Logger({configId: UM.option[0].id, message: JSON.stringify(error)});
};