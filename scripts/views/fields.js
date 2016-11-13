module.exports = Backbone.Ribs.View.extend({
    className: 'field-list',

    initialize: function() {
        this.collection.on('add', this.addOne, this);
        this.render();
    },

    render: function() {
        this.collection.each( this.addOne, this );
        return this;
    },

    addOne: function(model) {
        var view = new App.Views.Field({ model: model });
        this.$el.append(view.el);
    }
});
