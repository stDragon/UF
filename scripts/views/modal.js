/**
 *  Модальное окно
 *  */

module.exports = Backbone.View.extend({

    className: 'um-modal um-hidden',
    template: 'modalTpl',

    events: {
        'click .um-close': 'hide'
    },

    initialize: function () {
        this.render();
        if (this.model.get('class')) this.$el.addClass(this.model.get('class'));
    },

    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function (template) {
            var temp = _.template(template);
            var html = $(temp(that.model.toJSON()));
            that.$el.html(html);
        });
        return this;
    },

    show: function () {
        this.$el.removeClass('um-hidden');
    },

    hide: function () {
        this.$el.addClass('um-hidden');
    }
});