module.exports = Backbone.Collection.extend({
    model: UM.Models.PhoneCode,

    getActive: function () {
        var active = this.find(function(model) {
            return model.get('active') == true;
        });
        if (active) {
            return active.toJSON();
        }
    },

    unsetActive: function () {
        this.each(function (model) {
            model.set('active', false);
        }, this);
    },

    getMask: function () {
        var active = this.getActive();
        return '+' + active.code.replace(/[0-9]/g, '9') + ' ' + active.mask;
    }
});