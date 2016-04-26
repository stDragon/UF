/**
 *  Прелоудер
 *  */

module.exports = Backbone.View.extend({

    className: 'um-load-bar um-hidden',
    template: 'loaderTpl',

    initialize: function () {
        this.render();
    },

    render: function () {
        var that = this;
        UM.TemplateManager.get(this.template, function (template) {
            var html = $(template);
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