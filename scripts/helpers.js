module.exports = {
    /**
     *  Helper создания событий
     *  */
    vent: _.extend({}, Backbone.Events),
    /**
     * Логирование ajax ошибок на сервере
     * */
    ajaxError: function (jqXHR) {
        var error = {
            responseText: jqXHR.responseText,
            status: jqXHR.status,
            statusText: jqXHR.statusText
        };
        new UM.Models.Logger({message: JSON.stringify(error)});
    },
    /**
     *  Helper шаблон из статичного DOM элемента по его ID
     *  */
    template: function (id) {
        return _.template($('#' + id).html());
    },
    /**
     *  Ajax подгрузка шаблона
     *  */
    templateManager: {
        templates: {},

        get: function (id, callback) {
            var template = this.templates[id];

            if (template) {
                callback(template);

            } else {
                var that = this;
                $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                    options.crossDomain = {
                        crossDomain: true
                    };
                    options.xhrFields = {
                        withCredentials: true
                    };
                });
                $.ajax({
                    url: conf.server.url + '/module/' + id,
                    success: function (template) {
                        var tmpl = template;
                        that.templates[id] = tmpl;
                        callback(tmpl);
                    }
                });
            }
        }
    }
};