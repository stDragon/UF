module.exports = Backbone.Ribs.View.extend({

    //el: $('#steps'),
    tagName: 'ul',
    className: 'tabs',

    initialize: function() {
        this.collection.on('add', this.addOne, this);
        this.collection.on('remove', this.removeOne, this);
        this.collection.on('all', this.initTabs, this);
        this.render();
        this.initTabs();
    },

    render: function() {
        this.collection.each( this.addOne, this );
        return this;
    },

    addOne: function(model) {
        var view = '<li class="tab col s3"><a href="#step'+model.get("step")+'">Шаг - '+(model.get("step")+1)+'</a></li>'
        var view = new App.Views.TabLi({ model: model });
        this.$el.append(view);
    },

    removeOne: function(model) {
        this.$el.find('li').eq(model.get('step')).remove();
    },

    initTabs: function() {
        this.$el.tabs();
    }
});