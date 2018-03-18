module.exports = Backbone.Collection.extend({
    model: UM.Models.PhoneCode,

    url: function () {
        return UM.dataUrl + '/phoneCodes/'
    },

    initialize: function(models, options) {

        this.options = options || {};

    },

    filterAvailable: function () {
        var arrAvailable;
        if (this.options.available)
            arrAvailable = JSON.parse(this.options.available);
        else
            arrAvailable = ["RU"];

        return this.filter( function (model) {
            return  _.find(arrAvailable, function (isoCode) {
                return model.get('isoCode') === isoCode;
            });
        });
    },

    filterNotAvailable: function () {
        var arrNotAvailable;
        if (this.options.notAvailable)
            arrNotAvailable = JSON.parse(this.options.notAvailable);

        return this.filter( function (model) {
            return  !_.find(arrNotAvailable, function (isoCode) {
                return model.get('isoCode') === isoCode;
            });
        });
    },


    setActive: function (arrActive) {
        _.each(arrActive, function (active) {
            var model = this.find(function(model){ return model.get('isoCode') == active; });
            model.set('active', true);
        }, this);
    },

    getActive: function () {
        var active = this.find(function(model) {
            return model.get('active') == true;
        });
        if (!active) {
            active = this.find(function(model, predicate) {
                return predicate == 0;
            });
        }
        return active;
    },

    unsetActive: function () {
        this.each(function (model) {
            model.set('active', false);
        }, this);
    },

    getMask: function () {
        var active = this.getActive();
        return '+' + active.get('code').replace(/[0-9]/g, '9') + '' + active.get('mask');
    }
});