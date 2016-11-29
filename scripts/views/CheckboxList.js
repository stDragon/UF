/**
 *  Чекбоксы
 *  */

module.exports = Backbone.View.extend({

    tagName: 'ul',
    className: 'um-checkbox-content',

    initialize: function () {
        this.render();
        this.collection.on('sync', this.render, this);
    }
});