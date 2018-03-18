/**
 *  Подгружает необходимые стили и скрипты
 *  */

module.exports = Backbone.Ribs.View.extend({
    initialize: function () {
        this.initHead();
        this.initBody();
    },

    getStyle: function (href) {
        return '<link rel="stylesheet" type="text/css" href="' + href + '">';
    },

    getScript: function (href) {
        return '<script src="' + href + '" type="text/javascript">';
    },

    getYaMap: function () {
        var YaMapHref = '//api-maps.yandex.ru/2.1/?lang=ru_RU&mode=debug';
        return $('script[src$="' + YaMapHref + '"]').length ? '' : this.getScript(YaMapHref);
    },

    initHead: function () {
        var $head = $('head'),
            head = '';

        if (!$('link[href$="' + this.model.get('layout.style') + '.css"]').length) {
            var styleHref = UM.conf.server.url + '/public/css/' + this.model.get('layout.style') + '.css';
            head += this.getStyle(styleHref);
        }

        /** @todo перенести в field */
        //if (this.model.get('formConfig').shop.mapShow)
        //    head += this.getYaMap();

        if (head)
            $head.append(head);
    },

    initBody: function () {
        var $body = $('body');

        if (this.model.get('layout.init.type') == 'button') {

            if (this.model.get('layout.init.position') == 'fixed') {
                this.button = new UM.Views.ButtonFixed({model: this.model});
                $body.append(this.button.el);
            } else if (this.model.get('layout.init.position') == 'static')
                this.button = new UM.Views.ButtonStatic({model: this.model});

            UM.buttons[this.model.id] = this.button;

            this.layout = new UM.Views.Layout({model: this.model});
            $body.append(this.layout.el);
            this.layout.hide();

        } else if (this.model.get('layout.init.type') == 'form') {

            if (this.model.get('layout.init.position') == 'fixed') {
                this.layout = new UM.Views.Layout({model: this.model});
                $body.append(this.layout.el);
            } else if (this.model.get('layout.init.position') == 'static') {
                /** @TODO обратная совместимость с вставлением формы по айдишнику*/
                var $el = $('#um-form-init');
                if ($el.length) {
                    this.layout = new UM.Views.Layout({model: this.model});
                    $el.html(this.layout.el);
                }
                else {
                    this.layout = [];
                    var that = this;
                    $('[data-um-id=' + this.model.id + ']').each(function(index){
                        var layout =  new UM.Views.Layout({model: that.model});
                        $(this).html(layout.el);
                        that.layout[index] = layout;
                    });
                }

            }
        }

        UM.layouts[this.model.id] = this.layout;
    }
});