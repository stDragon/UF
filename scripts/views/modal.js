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