var express      = require('express'),
    https        = require('https'),
    http         = require('http'),
    fs           = require('fs'),
    errorhandler = require('errorhandler'),
    expressHbs = require('express3-handlebars'),
    robots = require('express-robots'),
    bodyParser   = require('body-parser');

var app = module.exports.app = exports.app = express();
    require('./server.js')(app);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');
/**
 * @todo временные массивы, удалить после появления БД
 * */
var tmp = require('./temp');
var logs = tmp.tmpDb.logs,
    cities = tmp.tmpDb.cities,
    shops = tmp.tmpDb.shops,
    users = tmp.tmpDb.users,
    configs = tmp.tmpDb.configs,
    kitchens = tmp.tmpDb.kitchens,
    phoneCodes = tmp.tmpDb.phoneCodes;

var jsonParser = bodyParser.json();

app.all('*', function(req, res, next) {
    var serverName = '*';
    if(req.headers.origin) {
        serverName = req.headers.origin;
    }

    //res.header("Content-Type", "application/json; charset=utf-8");
    res.header("Access-Control-Allow-Origin", serverName);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Cache-Control', 'public, max-age=' + 604800);
    res.setHeader("Expires", new Date(Date.now() + 604800000).toUTCString());
    next();
});

app.use(robots(__dirname + '/robots.txt'));

app.use('/public',express.static(__dirname + '/public'));
//app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

app.get('/module', function(req, res) {
    res.render('index');
});
app.get('/module/:id', function(req, res) {
    //if (!configs[req.params.id])
    //    res.redirect('/module');

    res.render(req.params.id, {layout: false});
});

app.post('/um/umdata/conf/', jsonParser, function(req, res) {
    var data = req.body;
    data.id = Date.now().toString();
    configs[data.id] = data;

    res.status(201).json(data);
});

app.route('/um/umdata/conf/:id')
    .get(jsonParser, function(req, res) {
        res.json(configs[req.params.id]);
    })
    .put(jsonParser, function(req, res) {
        var success = false;
        if(configs[req.params.id]) {
            configs[req.params.id] = req.body;
            success = true;
        }

        //res.json(success ? 200 : 404);
        res.status(200).json(configs[req.params.id]);
    });

app.get('/um/umdata/cities/', function(req, res) {
    res.json(cities);
});

app.get('/um/umdata/cities/:id', function(req, res) {
    res.json(cities);
});

app.get('/um/umdata/shops', function(req, res) {
    res.json(shops);
});

app.get('/um/umdata/shops/:id', function(req, res) {
    res.json(shops);
});

app.get('/um/umdata/kitchens/', function(req, res) {
    res.json(kitchens);
});

app.get('/um/umdata/kitchens/:id', function(req, res) {
    res.json(kitchens);
});

app.get('/api/phoneCodes/', function(req, res) {
    res.json(phoneCodes);
});

app.post('/um/umdata/code/', jsonParser, function(req, res) {
    var data = req.body;
    setTimeout(function(){
        if(data.code == 5555){
            data.confirm = true;
            res.status(202).json(data);
        } else {
            data.confirm = false;
            res.status(401).json(data);
        }
    }, 2000);
});

app.post('/um/umdata/client/', jsonParser, function(req, res) {
    var data = req.body;
    data.id = Date.now().toString();
    users[data.id] = data;

    setTimeout(function(){
        res.status(201).json(data);
    }, 2000);
});

app.get('/um/umclient/add/:id', jsonParser, function(req, res) {
    res.json(users[req.params.id]);
});

app.post('/um/umdata/log/', jsonParser, function(req, res) {
    var data = req.body;
    data.id = Date.now().toString();
    logs[data.id] = data;

    res.status(201).json(data);
});