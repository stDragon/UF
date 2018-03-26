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
        this.render();

        if (this.model.id)
            this.listenToOnce(this.model, 'sync', this.renderFormSteps);
        else
            this.renderFormSteps();

        this.listenTo(this.model, 'sync', this.afterSync);
        this.listenTo(this.model, 'change', this.setValue);
        this.listenTo(this.model, 'invalid', this.invalid);
        this.listenTo(this.model, 'invalid', this.unrenderCode);
        this.listenTo(this.model, 'request', this.valid);

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
        UM.Helpers.TemplateManager.get(this.template, function (template) {
            var data = _.extend(that.model.toJSON());
            var temp = _.template(template, data);
            var html = $(temp(data));
            that.$el.html(html);
            that.initSelects();
        });
        return this;
    },

    afterSync: function () {
        this.renderCode();
        this.showExample();
        this.showMassageSave();
        return this;
    },

    renderStepAddGenerator: function () {
        var phoneVerification = this.model.steps.hasPhoneVerification();
        UM.stepsGeneratorView = new UM.Views.StepAddGenetator({phoneVerification: !!phoneVerification});
        return this;
    },

    renderStepTabs: function () {
        this.stepsTabView = new UM.Views.StepsTabView({collection: this.model.steps});
        $('#steps').html(this.stepsTabView.el);
        this.stepsTabView.$el.tabs();
        return this;
    },

    renderFormSteps: function() {
        this.renderStepAddGenerator()
            .renderStepTabs();
        UM.stepGeneratorView = new UM.Views.StepGeneratorCollection({ collection: this.model.steps });
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
        UM.example = new UM.Views.Example({model: UM.config});
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