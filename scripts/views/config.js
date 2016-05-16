/**
 *  Подгружает необходимые стили и скрипты
 *  */

module.exports = Backbone.Ribs.View.extend({
    initialize: function () {
        this.initHead();
        this.initBody();
    },

    getStyle: function () {
        return '<link rel="stylesheet" type="text/css" href="' + UM.conf.server.url + '/public/css/' + this.model.get('style') + '.css">';
    },

    getYaMap: function () {
        return '<script src="//api-maps.yandex.ru/2.1/?lang=ru_RU&mode=debug" type="text/javascript">';
    },

    initHead: function () {
        var $head = $('head'),
            head = '';

        if (this.model.get('style'))
            head += this.getStyle();

        if (this.model.get('formConfig').shop.mapShow)
            head += this.getYaMap();

        if (head)
            $head.append(head);
    },

    initBody: function () {
        var $body = $('body');

        this.page = new UM.Views.Page({model: this.model});

        if (this.model.get('initType') == 'button') {

            if (this.model.get('initPosition') == 'fixed') {
                this.button = new UM.Views.ButtonFixed({model: this.model});
                $body.append(this.button.el);
            } else if (this.model.get('initPosition') == 'static')
                this.button = new UM.Views.ButtonStatic({model: this.model});

            UM.buttons[this.model.id] = this.button;

            $body.append(this.page.el);
            this.page.hide();

        } else if (this.model.get('initType') == 'form') {

            if (this.model.get('initPosition') == 'fixed') {
                $body.append(this.page.el);
            } else if (this.model.get('initPosition') == 'static') {
                /** @TODO обратная совместимость с вставлением формы по айдишнику*/
                var $el = $('#um-form-init');
                if ($el.length)
                    $el.html(this.page.el);
                else {
                    this.page = [];
                    var that = this;
                    $('[data-um-id=' + this.model.id + ']').each(function(index){
                        var page =  new UM.Views.Page({model: that.model});
                        $(this).html(page.el);
                        that.page[index] = page;
                    });
                }

            }
        }

        UM.pages[this.model.id] = this.page;
    }
});