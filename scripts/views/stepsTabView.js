module.exports = Backbone.Ribs.View.extend({

    //el: $('#steps'),
    tagName: 'ul',
    className: 'tabs',

    initialize: function() {
        this.collection.on('add', this.addOne, this);
        this.render().initTabs();
    },

    render: function() {
        this.collection.each( this.addOne, this );
        return this;
    },

    addOne: function(model) {
        var view = new App.Views.TabLi({ model: model });
        this.$el.append(view.el);
        this.initTabs();
    },

    initTabs: function() {
        this.$el.tabs();
    }
});