module.exports = Backbone.Ribs.View.extend({

    el: $('#formCodeGenerator'),
    className: 'form-code-generator',
    template: 'formCodeGeneratorTpl',

    events: {
        "change input"        : "changed",
        "change select"       : "changed",
        "submit"              : "submit"
    },

    initialize: function () {
        this.$el.html(this.render());

        this.listenToOnce(this.model, 'sync', this.renderFormSteps);
        this.listenTo(this.model, 'sync', this.renderCode);
        this.listenTo(this.model, 'sync', this.showExample);
        this.listenTo(this.model, 'sync', this.showMassageSave);
        this.listenTo(this.model, 'change', this.setValue);
        this.listenTo(this.model, 'invalid', this.invalid);
        this.listenTo(this.model, 'invalid', this.unrenderCode);
        this.listenTo(this.model, 'request', this.valid);
        //_.bindAll(this, 'changed');

        var clipboard = new Clipboard('.js-copy-code');

        clipboard.on('success', function(e) {
            console.log(e);
            Materialize.toast('Код скопирован в буфер обмена', 2000);
        });
        clipboard.on('error', function(e) {
            console.log(e);
            console.error('Не удалось скопировать');
        });
    },

    render: function () {
        var that = this;
        App.Helpers.TemplateManager.get(this.template, function (template) {
            var data = _.extend(that.model.toJSON());
            var temp = _.template(template, data);
            var html = $(temp(data));
            that.$el.html(html);
            that.setValue();
            if(that.model.id) that.renderCode();
        });
        return this;
    },

    renderStepsGenerator: function () {
        var phoneVerification = this.model.steps.hasPhoneVerification();
        App.stepsGeneratorView = new App.Views.StepAddGenetator({phoneVerification: !!phoneVerification});
        return this;
    },

    renderStepsTabs: function () {
        App.stepsTabView = new App.Views.StepsTabView({collection: this.model.steps});
        $('#steps').html(App.stepsTabView.el);
        App.stepsTabView.$el.tabs();
        return this;
    },

    renderFormSteps: function() {
        this.renderStepsGenerator()
            .renderStepsTabs();
        App.stepGeneratorView = new App.Views.StepGeneratorCollection({ collection: this.model.steps });
        return this;
    },

    setValue: function () {
        var attr = this.model.toJSON();
        _.each(attr, function (num, key) {
            var $el = this.$el.find('[name=' + key + ']');
            if ($el.is(':checkbox'))
                $el.prop("checked", num);
            else
                $el.val(num);
        }, this);
        this.initSelects();
        return this;
    },

    initSelects: function () {
        this.$el.find('select').material_select();
        return this;
    },

    renderCode: function () {
        if(typeof this.model.id === 'undefined') return this;
        this.$el.find('[name=code]')
            .val(this.model.getCode())
            .addClass('valid');
        return this;
    },

    unrenderCode: function () {
        this.$el.find('[name=code]')
            .val('')
            .removeClass('valid');
    },

    showExample: function(){
        App.example = new App.Views.Example({model: App.config});
    },

    changed: function(e) {
        var changed = e.currentTarget;

        var value;
        if (changed.type == 'checkbox') {
            value = changed.checked;
        } else {
            value = changed.value;
        }

        if (value === 'false') value = false;
        if (value === 'true') value = true;

        var obj = {};
        obj[changed.name] = value;

        this.model.set(obj);
    },

    valid: function () {
        this.$el.find('input')
            .removeClass('invalid')
            .addClass('valid');
    },

    invalid: function (model, errors) {
        this.$el.find('input')
            .removeClass('invalid')
            .removeClass('valid');
        _.each(errors, function (error) {
            var $el = this.$el.find('[name="' + error.attr + '"]');

            $el.removeClass('valid')
                .addClass('invalid');
        }, this);
    },

    showMassageSave: function () {
        Materialize.toast('Изменения сохранены', 2000);
    },

    submit: function (e) {
        e.preventDefault();
        this.model.save();
    }
});