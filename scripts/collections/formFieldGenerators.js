module.exports = Backbone.Ribs.Collection.extend({
    model: App.Models.FormFieldGenerator,

    initialize: function () {
        this.listenTo(this, 'all',function(){
            this.log();
        }, this)
    },

    hasPhoneVerification: function(){
        this.find(function(model){
            return model.get('type') === 'code';
        });
    },

    log: function () {
        console.log(this.toJSON());
    }
});