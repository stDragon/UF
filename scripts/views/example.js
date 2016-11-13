module.exports = Backbone.View.extend({
    el: '#example',

    initialize: function () {
        this.listenTo(this.model, 'invalid', this.unrender);
        this.listenTo(this.model, 'error', this.unrender);
        this.listenTo(this.model, 'sync', this.render);
    },

    render: function () {

        this.unrender();

        if (this.model.get('layout.init.position') == 'static') {

            if (this.model.get('layout.init.type') == 'button')
                this.$el.html(this.model.getButtonDOM());

            else if (this.model.get('layout.init.type') == 'form')
                this.$el.html(this.model.getFormDOM());

        } else this.$el.html('');

        UM.init({id: this.model.id});
    },

    unrender: function() {
        if(UM.configsCollection) {
            if(UM.layouts[this.model.id])
                if (Array.isArray(UM.layouts[this.model.id]))
                    UM.layouts[this.model.id][0].unrender();
                else
                    UM.layouts[this.model.id].unrender();

            if(UM.buttons[this.model.id] && UM.buttons[this.model.id].$el.hasClass('um-btn-start--fixed'))
                UM.buttons[this.model.id].unrender();

            UM.configsCollection.reset();
        }
    }

});