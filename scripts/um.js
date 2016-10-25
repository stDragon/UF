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

UM.Models.Logger = require('./models/logger.js');
UM.Models.Config = require('./models/config.js');
UM.Models.City = require('./models/city.js');
UM.Models.User = require('./models/user.js');
UM.Models.Phone = require('./models/phone.js');
UM.Models.Shop = require('./models/shop.js');
UM.Models.Modal = require('./models/modal.js');
UM.Models.Kitchen = require('./models/kitchen.js');
UM.Models.PhoneCode = require('./models/phoneCode.js');

UM.Collections.Configs = require('./collections/configs.js');
UM.Collections.Citys = require('./collections/citys.js');
UM.Collections.Shops = require('./collections/shops.js');
UM.Collections.Kitchens = require('./collections/kitchens.js');
UM.Collections.PhoneCodeCollection = require('./collections/phoneCodes.js');

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
        /** создаем новую кллекцию конфигураций */
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
    new UM.Models.Logger({message: JSON.stringify(error)});
};