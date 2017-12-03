/**
 *  Коллекция конфигураций
 *  */

module.exports = Backbone.Ribs.Collection.extend({
    model: UM.Models.Config,

    url: function () {
        return UM.dataUrl + '/conf/'
    }
});
