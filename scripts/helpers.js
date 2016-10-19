module.exports = {
    /**
     *  Ajax подгрузка шаблона
     *  */
    TemplateManager : {
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