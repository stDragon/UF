module.exports = Backbone.Ribs.Collection.extend({
    model: UM.Models.Step,

    initialize: function () {
        if (UM.conf.server.type !== 'prod')
            this.on('all', function(eventName){this.log(eventName)}, this);
    },

    hasPhoneVerification: function(){
        this.find(function(model){
            return model.get('type') === 'code';
        });
    },

    log: function (eventName) {
        console.log('Сработало событие: '+ eventName);
        console.log(this.toJSON());
    }
});