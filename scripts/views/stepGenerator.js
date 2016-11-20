module.exports = Backbone.Ribs.View.extend({
    tagName: 'form',
    className: 'step-generator',
    template: 'stepGenerator',

    events: {
        "change input"                      : "changed",
        "change select:not(.add-field-list)"  : "changed",
        "click .js-remove"                  : "unrender",
        "click .js-add-field"               : "addField",
        "submit"                            : "submit"
    },

    initialize: function () {
        this.render().setStep();
        this.listenTo(this.model, 'change', this.setValues);
        this.listenTo(this.model, 'change:step', this.setStep);
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
            that.fields = new App.Views.Fields({el: that.$el.find('.field-list'), collection: that.model.fieldCollection});

            new App.Views.Select({el: that.$el.find('.add-field-list'), collection: that.model.newFieldCollection},{template:_.template('<%= label %>'), value: 'name'}).render();
        });
        return this;
    },

    unrender: function () {
        // COMPLETELY UNBIND THE VIEW
        this.undelegateEvents();

        this.$el.removeData().unbind();

        // Remove view from DOM
        this.remove();
        Backbone.View.prototype.remove.call(this);
    },

    addField: function () {
        var field = this.$el.find('select.add-field-list').val();
        this.model.addField(field);
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

    setValue: function ($el, val) {
        if ($el.is(':checkbox'))
            $el.prop("checked", val);
        if ($el.children('option').length){

            $el.children('option').attr('selected', false);

            val = $.parseJSON(val);
            _.each(val, function(n){
                $el.children('option[value="' + n + '"]')[0].selected = true;
            });
        }
        else
            $el.val(val);
    },

    changed: function(e) {
        var changed = e.currentTarget;
        var value;

        if ($(changed).closest('.field-list').length) return;

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

    setStep: function () {
        this.$el.prop('id', 'step' + this.model.get('step'));
        this.$el.find('h3').html('Настройка шага #'+(this.model.get('step') + 1));
    },

    submit: function (e) {
        e.preventDefault();
        App.config.save();
    }
});
