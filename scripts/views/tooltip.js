/**
 *  Тултипы для вывода текста ошибок формы
 *  */

module.exports = Backbone.View.extend({

    tagName: 'span',
    className: 'um-tooltip bottom',

    initialize: function (options) {
        this.render(options.text);
    },

    render: function (text) {
        this.$el.html(text);
        return this;
    }

});