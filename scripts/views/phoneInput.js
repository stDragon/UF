module.exports = Backbone.View.extend({

    events: {
        'focus input[name=phone]': 'setCode',
        'paste input[name=phone]': 'setCode',
        'input input[name=phone]': 'setCode',
        'keyup input[name=phone]': 'setCode'
    },

    initialize: function (options) {
        this.input = this.$el.find('input');

        if (options.form)
            this.form = options.form;

        var phoneCodeCollection = new UM.Collections.PhoneCodeCollection(
            UM.codes,
            {
                available: this.form.model.options.phone.available,
                notAvailable: this.form.model.options.phone.notAvailable
            }
        );

        this.phoneCodeCollection = new UM.Collections.PhoneCodeCollection(phoneCodeCollection.filterAvailable());
        this.form.model.phoneCodeCollection = this.phoneCodeCollection;
        this.phoneCodeCollectionView = new UM.Views.PhoneCodeCollection({ collection: this.phoneCodeCollection});
        this.$el.prepend(this.phoneCodeCollectionView.el);

        if(this.input.val() == '') {
            this.setMask({clear: true});
        } else {
            this.setCode();
        }

        this.listenTo(this.phoneCodeCollection, 'active', function () {
            this.setMask({clear: true});
        });
    },

    setMask: function (option) {
        var mask = this.phoneCodeCollection.getMask();
        /* От работы через jquery пришлось отказатся из-за некоректной работы inputmask через browserify */
        var im = new UM.Inputmask(mask);
        im.mask(this.input);

        var active = this.phoneCodeCollection.getActive();

        if (option && option.clear === true) {
            this.input.val(active.get('code'));
            this.form.model.options.phone.pattern = active.get('isoCode');
        }

        if (typeof this.form.model.options.phone.showFlag !== 'undefined' && this.form.model.options.phone.showFlag)
            this.setFlag();
    },

    setCode: function () {
        /* убираем ошибку  */
        this.removeError();

        var val = this.input.val().replace(/[^0-9]/g, '');

        if (val == '') {
            return false;
        }

        val = this.convertRuIsoCode(val);

        var isFound = false;

        /* поиск введенного кода в коллекции */
        var inputCode;
        for(var i = 3; i > 0; i--) {
            inputCode = val.substr(0, i);

            var model = this.phoneCodeCollection.find(function(model) {
                return model.get('code') == inputCode;
            });

            if (model && model.get('available') !== false) {
                model.active();
                this.setMask();
                isFound = true;
                break;
            }
        }

        /* вывод ошибки */
        if (!isFound) {
            this.addError();
        }
    },

    setFlag: function () {
        if (this.form.model.options.phone.showFlag) {
            this.$el.find('.um-form-control-wrap').children('.um-phone-flag').remove();

            var active = this.phoneCodeCollection.getActive();

            if (active) {
                this.$el.find('.um-form-control-wrap').prepend(this.flagImg(active));
                this.$el.addClass('um-with-phone-flag');
            } else {
                this.$el.removeClass('um-with-phone-flag');
            }
        }
    },

    flagImg: function (active) {
        return '<img src="' + active.get('img') + '" alt="' + active.get('name') + '" class="um-phone-flag">';
    },

    addError: function () {
        var $group = this.input.closest('.um-form-group');
        $group.addClass('um-has-error');

        if (document.inputEncoding == "UTF-8") { // обход проблемы с кодировкой
            var tooltip = new UM.Views.Tooltip({text: 'Телефонные номера с заданным кодом не поддерживаются'});
            $group.find('.um-form-control').after(tooltip.el);
        }

        console.warn('Телефонные номера с заданным кодом не поддерживаются')
    },

    removeError: function () {
        this.input
            .closest('.um-form-group').removeClass('um-has-error')
            .find('.um-tooltip').remove();
    },

    convertRuIsoCode: function (val) {
        if(val.charAt(0) == '8') {
            val = val.replace("8", "7");
            this.input.val(val);
        }
        return val;
    }
});