var express      = require('express'),
    https        = require('https'),
    http         = require('http'),
    fs           = require('fs'),
    errorhandler = require('errorhandler'),
    expressHbs = require('express3-handlebars'),
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
var cities = tmp.tmpDb.cities;
var shops = tmp.tmpDb.shops;
var users = tmp.tmpDb.users;
var configs = tmp.tmpDb.configs;

var jsonParser = bodyParser.json();

app.use('/public',express.static(__dirname + '/public'));
//app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

app.get('/module/', function(req, res) {
    res.render('index');
});

app.post('/api/configs', jsonParser, function(req, res) {
    var data = req.body;
    data.id = Date.now().toString();
    configs[data.id] = data;

    res.status(201).json(data);
});

app.get('/api/configs/:id', jsonParser, function(req, res) {
    res.json(configs[req.params.id]);
});

app.put('/api/configs/:id', jsonParser, function(req, res) {
    var success = false;
    if(configs[req.params.id]) {
        configs[req.params.id] = req.body;
        success = true;
    }

    //res.json(success ? 200 : 404);
    res.status(200).json(configs[req.params.id]);
});

app.get('/api/cities', function(req, res) {
    res.json(cities);
});

app.get('/api/cities/:id', function(req, res) {
    res.json(cities);
});

app.get('/api/shops', function(req, res) {
    res.json(shops);
});

app.get('/api/shops/:id', function(req, res) {
    res.json(shops);
});

app.post('/api/phone', jsonParser, function(req, res) {
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

app.post('/api/users', jsonParser, function(req, res) {
    var data = req.body;
    data.id = Date.now().toString();
    users[data.id] = data;

    setTimeout(function(){
        res.status(201).json(data);
    }, 2000);
});

app.get('/api/users/:id', jsonParser, function(req, res) {
    res.json(users[req.params.id]);
});