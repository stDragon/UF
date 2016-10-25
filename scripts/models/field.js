/**
 *  Поле формы
 *  */
module.exports = Backbone.Ribs.Model.extend({
    defaults: {
        name: 'submit',
        sort: 100,
        type: 'submit',
        label: 'Кнопка отправки',
        show: true,
        text: 'Отправить заявку'
    }
});