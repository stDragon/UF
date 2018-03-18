/**
 *  Подтверждения регистрации через телефон
 *  */

module.exports = Backbone.Model.extend({
    defaults: {
        phone: '',
        confirm: false,
        code: ''
    },

    urlRoot: function () {
        return UM.dataUrl + '/code/'
    },

    validate: function (attrs, options) {
        var errors = [];
        if (!attrs.code) {
            errors.push({
                text: "Поле не может быть пустым",
                attr: 'code'
            });
        }

        if (errors.length) return errors;
    }
});