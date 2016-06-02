module.exports = Backbone.View.extend({

    events: {
        'focus input[name=phone]': 'setCode',
        'paste input[name=phone]': 'setCode',
        'input input[name=phone]': 'setCode',
        'keyup input[name=phone]': 'setCode'
    },

    initialize: function () {
        this.input = this.$el.find('input');

        this.phoneCodeCollection = new UM.Collections.PhoneCodeCollection( UM.codes );
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
        /* От работы через jquery пришлось отказатся из-за некоректной работной работы inputmask через browserify */
        var im = new Inputmask(mask);
        im.mask(this.input);

        if (option && option.clear === true)
            this.input.val(this.phoneCodeCollection.getActive().code);

        this.setFlag();
    },

    setCode: function () {
        /* убираем ошибку  */
        this.input
            .closest('.um-form-group').removeClass('um-has-error')
            .children('.um-tooltip').remove();

        var val = this.input.val().replace(/[^0-9]/g, '');

        if (val == '') {
            return false;
        }

        if(val.charAt(0) == '8') {
            val = val.replace("8", "7");
            this.input.val(val);
        }

        var isFound = false;

        /* поиск введенного кода в коллекции */
        for(var i = 3; i > 0; i--) {
            var inputCode = val.substr(0, i);

            var model = this.phoneCodeCollection.find(function(model) {
                return model.get('code') == inputCode;
            });

            if (model) {
                model.active();
                this.setMask();
                isFound = true;
                break;
            }
        }

        /* вывод ошибки  */
        if (!isFound) {

            var $group = this.input.closest('.um-form-group');
            $group.addClass('um-has-error');

            var tooltip = new UM.Views.Tooltip();
            tooltip.$el.html('Телефонные номера с заданным кодом не поддерживаются');
            $group.append(tooltip.el);

            console.warn('Телефонные номера с заданным кодом не поддерживаются')
        }
    },

    setFlag: function () {
        var active = this.phoneCodeCollection.getActive();
        this.$el.children('.um-phone-flag').remove();
        this.$el.append('<img src="' + active.img + '" alt="' + active.country + '" class="um-phone-flag">')
    }
});