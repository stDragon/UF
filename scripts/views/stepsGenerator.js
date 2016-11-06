module.exports = Backbone.Ribs.View.extend({

    el: $('#addSteps'),
    tagName: 'form',
    className: 'row',
    template: 'formAddSteps',
    model: new Backbone.Model,

    events: {
        'click [name="addStep"]'           : "addStep",
        'click [name="phoneVerification"]' : "addStep"
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

    addStep: function(e) {
        var el = e.target;
        if (el.disabled) return false;
        if (el.name === 'addStep')
            App.config.addStep('default');
        else if (el.name === 'phoneVerification'){
            App.config.addStep('code');
            el.disabled = true;
        }
    }
});