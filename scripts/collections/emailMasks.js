module.exports = Backbone.Collection.extend({
    model: UM.Models.EmailMask,

    url: function () {
        return '/api/emailMask/'
    },

    initialize: function(models, options) {
        this.options = options || {};
    },

    filterMask: function () {
        var arrAvailable;
        if (this.options.mask)
            arrAvailable = this.options.mask;
        else
            arrAvailable = "empty";

        return this.filter( function (model) {
            if(arrAvailable == "empty") return false;
            return model.get('isoCode') === arrAvailable;
        });
    },

    setActive: function (arrActive) {
        var model = this.find(function(model){ return model.get('isoCode') == arrActive; });
        model.set('active', true);
        return model;
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
        return active.get('mask') + active.get('code');
    }
});