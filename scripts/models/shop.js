module.exports = Backbone.Model.extend({
    defaults: {
        name: '',
        mr3id: '',
        brand: '',
        dealer: '',
        status: '',
        city: '',
        address: '',
        administrator: '',
        priceZone: ''
    },

    initialize: function () {
        if (!this.get('title'))
            this.set('title', this.get('name') + ', ' + this.get('address'));
    }
});