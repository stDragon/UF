module.exports = Backbone.Model.extend({
    defaults: {
        isoCode: '',
        name: '',
        code: '',
        mask: '',
        active: false
    },

    active: function () {
        if (!this.get('active')) {
            if (this.collection && !this.collection.options.multiple)
                this.collection.unsetActive();

            this.set('active', true);
            this.trigger('active');
        }
    }
});