/**
 *  Тултипы для вывода текста ошибок формы
 *  */

module.exports = Backbone.View.extend({

    tagName: 'span',
    className: 'um-tooltip bottom',

    initialize: function (text) {
        this.render(text);
    },

    render: function (text) {
        this.$el.html(text);
        return this;
    }

});