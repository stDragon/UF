module.exports = function (app) {
    var robots = require('express-robots'),
        express = require('express'),
        // errorhandler = require('errorhandler'),
        conf = require('./nconf.js'),
        bodyParser = require('body-parser'),
        jsonParser = bodyParser.json();

    generateView(app);

    app.all('*', addHeaders);
    app.use(robots(__dirname + '/robots.txt'));
    app.use('/public', express.static(__dirname + '/public'));
//app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

    /**
     * @todo временные массивы, удалить после появления БД
     * */
    var tmp = require('./temp');
    var logs = tmp.tmpDb.logs,
        fields = tmp.tmpDb.fields,
        cities = tmp.tmpDb.cities,
        shops = tmp.tmpDb.shops,
        users = tmp.tmpDb.users,
        configs = tmp.tmpDb.configs,
        kitchens = tmp.tmpDb.kitchens,
        phoneCodes = tmp.tmpDb.phoneCodes;

    /**
     * Единственный url по которому можно обратиться к node на pre-prod и prod
     * Не используется, можно проверить жива ли node
     * @deprecated
     * */
    app.get('/module', function (req, res) {
        res.render('index');
    });
    /**
     * получение шаблонов на pre-prod и prod не используется, т.к. переведено на nginx
     * */
    app.get('/module/:id', function (req, res) {
        res.render(req.params.id, {layout: false});
    });
    /**
     * Только для локального тестирования.
     * На продакшине запросы будут обработаны php сервером
     * Получаем index страницу
     * */
    app.get('/', function (req, res) {
        console.log(123);
        res.render('index', {
            title: 'Получение HTML-кода модуля'
        });
    });
    /**
     * Получаем index страницу с ранее сохраненным конфигом
     * */
    app.get('/:id', function (req, res) {
        if (!configs[req.params.id])
            res.redirect('/module');

        res.render('index', {id: req.params.id});
    });

    app.get(conf.server.dataPrefix + '/fields/', function (req, res) {
        res.json(fields);
    });

    app.get(conf.server.dataPrefix + '/cities/', function (req, res) {
        res.json(cities);
    });

    app.get(conf.server.dataPrefix + '/cities/:id', function (req, res) {
        res.json(cities);
    });

    app.get(conf.server.dataPrefix + '/shops', function (req, res) {
        res.json(shops);
    });

    app.get(conf.server.dataPrefix + '/shops/:id', function (req, res) {
        res.json(shops);
    });

    app.get(conf.server.dataPrefix + '/kitchens/', function (req, res) {
        res.json(kitchens);
    });

    app.get(conf.server.dataPrefix + '/kitchens/:id', function (req, res) {
        res.json(kitchens);
    });

    app.get(conf.server.dataPrefix + '/phoneCodes/', function (req, res) {
        res.json(phoneCodes);
    });

    app.post(conf.server.dataPrefix + '/conf/', jsonParser, function (req, res) {
        var data = req.body;
        data.id = Date.now().toString();
        configs[data.id] = data;

        res.status(201).json(data);
    });

    app.route(conf.server.dataPrefix + '/conf/:id')
        .get(jsonParser, function (req, res) {
            res.json(configs[req.params.id]);
        })
        .put(jsonParser, function (req, res) {
            var success = false;
            if (configs[req.params.id]) {
                configs[req.params.id] = req.body;
                success = true;
            }

            //res.json(success ? 200 : 404);
            res.status(200).json(configs[req.params.id]);
        });

    app.post(conf.server.dataPrefix + '/code/', jsonParser, function (req, res) {
        var data = req.body;
        setTimeout(function () {
            if (data.code == 5555) {
                data.confirm = true;
                res.status(202).json(data);
            } else {
                data.confirm = false;
                res.status(401).json(data);
            }
        }, 2000);
    });

    app.post(conf.server.dataPrefix + '/client/', jsonParser, function (req, res) {
        var data = req.body;
        data.id = Date.now().toString();
        users[data.id] = data;

        setTimeout(function () {
            res.status(201).json(data);
        }, 2000);
    });

    app.get('/client/:id', jsonParser, function (req, res) {
        res.json(users[req.params.id]);
    });

    app.post(conf.server.dataPrefix + '/log/', jsonParser, function (req, res) {
        var data = req.body;
        data.id = Date.now().toString();
        logs[data.id] = data;

        res.status(201).json(data);
    });

    return app;
};

function generateView(app) {
    var expressHbs = require('express3-handlebars');
    app.set('views', __dirname + '/views');
    app.engine('hbs', expressHbs({extname: 'hbs', defaultLayout: 'main.hbs'}));
    app.set('view engine', 'hbs');
    return app;
}

function addHeaders(req, res, next) {
    var serverName = '*';
    if (req.headers.origin) {
        serverName = req.headers.origin;
    }

    //res.header("Content-Type", "application/json; charset=utf-8");
    res.header("Access-Control-Allow-Origin", serverName);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    /**
     *  Кэширование, выключено т.к. кэшируется и заголовок
     *  */
    //res.setHeader('Cache-Control', 'public, max-age=' + 604800);
    //res.setHeader("Expires", new Date(Date.now() + 604800000).toUTCString());
    next();
}