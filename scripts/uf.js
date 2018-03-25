var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    pjson = require('../package.json'),
    conf = require('../nconf.js');

window.$ = window.$ || $;
window._ = window._ || _;
window.Backbone = window.Backbone || Backbone;

var UM = window.UM || {
        Models: {},
        Collections: {},
        Views: {},
        Router: {},
        version: pjson.version,
        option: [],
        layouts: [],
        forms: [],
        buttons: [],
        dataUrl: conf.server.url + conf.server.dataPrefix,
        conf: conf
    };

UM.Inputmask = require('../public/libs/jquery.inputmask/dist/inputmask/inputmask.js');
require('../public/libs/jquery.inputmask/dist/inputmask/jquery.inputmask.js');
require('../public/libs/jquery.inputmask/dist/inputmask/inputmask.extensions.js');
require('../public/libs/backbone.ribs/backbone.ribs.js');
require('./Backbone.Ymaps.js');

window.UM = UM;

UM.helpers = require('./helpers.js');

UM.Models.Logger = require('./models/logger.js');
UM.Models.Config = require('./models/config.js');
UM.Models.Option = require('./models/option.js');
UM.Models.City = require('./models/city.js');
UM.Models.User = require('./models/user.js');
UM.Models.Phone = require('./models/phone.js');
UM.Models.Shop = require('./models/shop.js');
UM.Models.Modal = require('./models/modal.js');
UM.Models.Kitchen = require('./models/kitchen.js');
UM.Models.PhoneCode = require('./models/phoneCode.js');

UM.Collections.Configs = require('./collections/configs.js');
UM.Collections.Options = require('./collections/options.js');
UM.Collections.Citys = require('./collections/citys.js');
UM.Collections.Shops = require('./collections/shops.js');
UM.Collections.Kitchens = require('./collections/kitchens.js');
UM.Collections.PhoneCodeCollection = require('./collections/phoneCodes.js');

UM.Views.Tooltip = require('./views/tooltip.js');
UM.Views.Loader = require('./views/loader.js');
UM.Views.Modal = require('./views/modal.js');
UM.Views.Config = require('./views/config.js');
UM.Views.Layout = require('./views/layout.js');
UM.Views.Button = require('./views/button.js');
UM.Views.ButtonStatic = require('./views/buttonStatic.js');
UM.Views.ButtonFixed = require('./views/buttonFixed.js');
UM.Views.Form = require('./views/form.js');
UM.Views.InputSelect = require('./views/inputSelect.js');
UM.Views.InputSelectOption = require('./views/inputSelectOption.js');
UM.Views.FormUser = require('./views/formUser.js');
UM.Views.FormUserPhone = require('./views/formUserPhone.js');
UM.Views.Confirm = require('./views/confirm.js');
UM.Views.Shop = require('./views/shop.js');
UM.Views.Shops = require('./views/shops.js');
UM.Views.Kitchen = require('./views/kitchen.js');
UM.Views.Kitchens = require('./views/kitchens.js');
UM.Views.PhoneInput = require('./views/phoneInput.js');
UM.Views.PhoneCode = require('./views/phoneCode.js');
UM.Views.PhoneCodeCollection = require('./views/phoneCodeCollection.js');

/**
 *  Запуск модуля
 *  @param  {string} option - Опции для инициализации модуля.
 *  @param  {string} data - Данные передаваемые в модуль.
 *  */
UM.init = function (option, data) {
    $(document).ready(function(){
        UM.option.push(option);
        /** создаем новую кллекцию конфигураций */
        if (!UM.configsCollection)
            UM.configsCollection = new UM.Collections.Configs([], option);

        var config = new UM.Models.Config(option, data);
        UM.configsCollection.add(config);

        config.fetch().then(function () {
                new UM.Views.Config({model: config});
            }, UM.helpers.ajaxError);
    });
};