/**
 *  Коллекция конфигураций
 *  */

module.exports = Backbone.Collection.extend({
    model: UM.Models.Config,

    url: function () {
        return UM.serverUrl + '/conf/'
    }
});
