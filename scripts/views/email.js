module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.input = this.$el.find('input');

        if (options.form)
            this.form = options.form;

        var emailMaskCollection = new UM.Collections.EmailMasksCollection(UM.mask, {
            mask: this.form.model.options.email.mask
        });

        this.emailMaskCollection = new UM.Collections.EmailMasksCollection(emailMaskCollection.filterMask());
        if(this.emailMaskCollection.length){
            this.form.model.emailMaskCollection = this.emailMaskCollection;

            this.setMask({clear: true});
        }
    },

    setMask: function () {
        var mask = this.emailMaskCollection.getMask();
        /* От работы через jquery пришлось отказаться из-за некоректной работной работы inputmask через browserify */
        var im = new UM.Inputmask(mask, {definitions: {
            '*': {
                validator: "[0-9A-Za-z!.#$%&'+=^_`~-]",
                cardinality: 1
            }
        }});
        im.mask(this.input);
    }
});