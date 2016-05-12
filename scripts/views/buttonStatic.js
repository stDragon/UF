/**
 *  Кнопка связанная со статиным DOM элементом
 *  */

module.exports = UM.Views.Button.extend({
    el: function () {
        return $('[data-um-id=' + this.model.id + ']');
    }
});