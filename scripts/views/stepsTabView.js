module.exports = Backbone.Ribs.View.extend({
    tagName: 'ul',
    className: 'tabs',

    initialize: function() {
        this.collection.on('add', this.addOne, this);
        this.render();
        this.$el.tabs();
    },

    render: function() {
        this.collection.each( this.addOne, this );
        return this;
    },

    addOne: function(model) {
        var view = '<li class="tab col s3"><a href="#step'+model.get("step")+'">Шаг - '+(model.get("step")+1)+'</a></li>'
        this.$el.append(view);
    }
});