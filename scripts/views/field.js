module.exports = Backbone.Ribs.View.extend({
    tagName: 'fieldset',
    template: 'fieldGenerator',

    events: {
        "change input"   : "changed",
        "change select"  : "changed"
    },

    initialize: function () {
        this.render();
        this.listenTo(this.model, 'change', this.setValues);
        this.listenTo(this.model, 'remove', this.unrender);
        _.bindAll(this, 'changed');
    },

    render: function () {
        var that = this;
        App.Helpers.TemplateManager.get(this.template, function (template) {
            var temp = _.template(template);
            var data = that.model.toJSON();
            var html = temp(data);
            that.$el.html(html);
            that.$el.attr('data-field', that.model.get("name"));

            if(that.model.get("name") == "phone") {
                new App.Views.Select({el: that.$el.find('[name="phone.available"]'), collection: that.model.phoneCodesAvailableCollection}, {value: 'isoCode', multiple: true}).render();
                new App.Views.Select({el: that.$el.find('[name="phone.notAvailable"]'), collection: that.model.phoneCodesNotAvailableCollection}, {value: 'isoCode', multiple: true}).render();
            }
        });
        return this;
    },

    /** Устанавливает значения полей формы*/
    setValue: function () {
        var attr = this.model.toJSON();
        _.each(attr, function (num, key) {
            this.$el.find('[name=' + key + ']').val(num);
        }, this);
        return this;
    },

    setValues: function () {
        /** @TODO Костыль из-за вложенного объекта, надо найти нормальное решение*/
        var attr = this.model.toJSON();
        _.each(attr, function (num, key) {
            if (typeof num == 'object') {
                var parentKey = key;
                _.each(num, function (num, key) {
                    var $el = this.$el.find('[name="' + parentKey + '.' + key + '"]');
                    this.setValue($el, num);
                },this);
            } else {
                var $el = this.$el.find('[name="' + key + '"]');
                this.setValue($el, num);
            }

        }, this);
        this.$el.find('select').material_select();
    },

    changed: function(e) {
        var changed = e.currentTarget;
        var value;

        if (changed.type == 'checkbox') {
            value = changed.checked;
        } else if(changed.type == 'select-multiple'){
            value = [];
            _.each(changed, function(option){
                if (option.selected)
                    value.push(option.value);
            });
        } else {
            value = changed.value;
        }

        if (value === 'false') value = false;
        if (value === 'true') value = true;

        if (Array.isArray(value)) {
            value = JSON.stringify(value);
        }

        var obj = {};
        obj[changed.name] = value;

        this.model.set(obj);
    },

    unrender: function () {
        // COMPLETELY UNBIND THE VIEW
        this.undelegateEvents();

        this.$el.removeData().unbind();

        // Remove view from DOM
        this.remove();
        Backbone.View.prototype.remove.call(this);
    }
});