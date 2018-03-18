/**
 *  Готовый шаблон
 *  */
module.exports = Backbone.Ribs.Model.extend({
    defaults: {
        "model": "client",
        "type":"calculation",
        "step": 0,
        "fields":{
            submit: {
                name: 'submit',
                sort: 999,
                type: 'submit',
                label: 'Кнопка отправки',
                show: true,
                text: 'Отправить заявку'
            }
        }
    },

    log: function () {
        console.log(this.toJSON());
    }
});