module.exports = Backbone.Ribs.View.extend({

    el: $('#addSteps'),
    tagName: 'form',
    className: 'row',
    template: 'formAddSteps',
    model: new Backbone.Model,

    events: {
        'change [name="phoneVerification"]' : "changePhoneVerification",
        'click  [name="addStep"]'           : "addStep"
    },

    initialize: function () {
        this.$el.html(this.render());
    },

    render: function () {
        var that = this;
        App.Helpers.TemplateManager.get(this.template, function (template) {
            var data = _.extend(that.model.toJSON());
            var temp = _.template(template, data);
            var html = $(temp(data));
            that.$el.html(html);
        });
        return this;
    },

    changePhoneVerification: function() {

    },

    addStep: function() {

    }
});