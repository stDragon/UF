var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone');

window._ = window._ || _;
window.Backbone = window.Backbone || Backbone;

require('jquery.inputmask');
require('./Backbone.Ymaps.js');

var UM = window.UM || {
        Models: {},
        Collections: {},
        Views: {},
        Router: {},
        option: [],
        pages: [],
        forms: [],
        buttons: [],
        cityCollections: [],
        serverUrl: '//module.infcentre.ru/um/umdate'
    };

window.UM = UM;

UM.Models.Config = require('./models/config.js');
UM.Models.City = require('./models/city.js');
UM.Models.User = require('./models/user.js');
UM.Models.Phone = require('./models/phone.js');
UM.Models.Shop = require('./models/shop.js');
UM.Models.Modal = require('./models/modal.js');

UM.Collections.Configs = require('./collections/configs.js');
UM.Collections.Citys = require('./collections/citys.js');
UM.Collections.Shops = require('./collections/shops.js');

UM.Views.Tooltip = require('./views/tooltip.js');
UM.Views.Loader = require('./views/loader.js');
UM.Views.Modal = require('./views/modal.js');
UM.Views.Config = require('./views/config.js');
UM.Views.Page = require('./views/page.js');
UM.Views.Button = require('./views/button.js');
UM.Views.ButtonStatic = require('./views/buttonStatic.js');
UM.Views.ButtonFixed = require('./views/buttonFixed.js');
UM.Views.CalculationForm = require('./views/calculationForm.js');
UM.Views.UserPhoneForm = require('./views/userPhoneForm.js');
UM.Views.Confirm = require('./views/confirm.js');
UM.Views.City = require('./views/city.js');
UM.Views.Citys = require('./views/citys.js');
UM.Views.Shop = require('./views/shop.js');
UM.Views.Shops = require('./views/shops.js');

/**
 *  Запуск модуля
 *  @param  {string} option - Опции для инициализации модуля.
 *  */
UM.init = function (option) {
    UM.option.push(option);
    //if (option.server == 'dev')
    //    UM.serverUrl = '//localhost';
    //else if (option.server == 'pre-prod')
    //    UM.serverUrl = '//module.infcentre.ru';
    //else
    //    UM.serverUrl = '//module.infcentre.ru';
    /** создаем новую кллекцию конфигураций */
    if (!UM.configsCollection)
        UM.configsCollection = new UM.Collections.Configs([], option);

    var config = new UM.Models.Config(option);
    UM.configsCollection.add(config);

    config.fetch().then(function () {
        new UM.Views.Config({model: config});
    }, config);
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
                url: "//module.infcentre.ru/module/" + id,
                success: function (template) {
                    var tmpl = template;
                    that.templates[id] = tmpl;
                    callback(tmpl);
                }
            });

        }

    }

};