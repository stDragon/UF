module.exports = Backbone.Model.extend({
    defaults: {
        name: '',
        country: '',
        code: '',
        regExp: '',
        mask: ''
    },

    active: function () {
        if (!this.get('active')) {
            if (this.collection)
                this.collection.unsetActive();

            this.set('active', true);
            this.trigger('active');
        }
    }
});