var express      = require('express'),
    https        = require('https'),
    http         = require('http'),
    fs           = require('fs'),
    errorhandler = require('errorhandler'),
    bodyParser   = require('body-parser');

var options = {};

fs.readFile('../ssl/certificate.key', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);
    options.key = data;
});
fs.readFile('../ssl/certificate.crt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);
    options.crt = data;
});

/**
 * @todo временные массивы, удалить после появления БД
 * */
var cities = [
    {
        name: 'Саратов',
        mr3id: '1',
        showShop: true
    },
    {
        name: 'Москва',
        mr3id: '2',
        showShop: true
    },
    {
        name: 'Питер',
        mr3id: '3',
        showShop: true
    },
    {
        name: 'Самара',
        mr3id: '4'
    },
    {
        name: 'Новгород',
        mr3id: '5'
    },
    {
        name: 'Тула',
        mr3id: '6'
    },
    {
        name: 'Энгельс',
        mr3id: '7',
        showShop: true
    },
    {
        name: 'Омск',
        mr3id: '8'
    },
    {
        name: 'Томск',
        mr3id: '9'
    },
    {
        name: 'Тверь',
        mr3id: '10'
    }
];

var shops = [
    {
        name: 'Кухонная студия "Мария"',
        mr3id: '11',
        brand: 'Мария',
        dealer: '',
        status: 'Продает',
        city: 'Энгельс',
        address: 'ул. Степная, д.11',
        administrator: 'Петр I',
        priceZone: '',
        lon: '51.481297',
        lat: '46.12762'
    },
    {
        name: 'Кухонная студия "Мария"',
        mr3id: '11',
        brand: 'Мария',
        dealer: '',
        status: 'Закрыт',
        city: 'Саратов',
        address: 'Вольский тракт, д. 2',
        administrator: 'Вася Николаев',
        priceZone: '',
        lon: '51.621449',
        lat: '45.972443'
    },
    {
        name: 'Кухонная студия "Мария"',
        mr3id: '15',
        brand: 'Мария',
        dealer: '',
        status: 'Продает',
        city: 'Саратов',
        address: 'ул. Московская, д. 129/133',
        administrator: 'Олик Солдатов',
        priceZone: '',
        lon: '51.537118',
        lat: '46.019346'
    },
    {
        name: 'Кухонная студия "Мария"',
        mr3id: '11',
        brand: 'Мария',
        dealer: '',
        status: 'Продает',
        city: 'Питер',
        address: 'ул. Саратовская, д. 129/133',
        administrator: 'Кролик Киевский',
        priceZone: ''
    }
];

var users = [];
var configs = [];

var app = module.exports.app = exports.app = express();

app.set('port', process.env.PORT || 80);

var jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    var serverName = '*';
    if(req.headers.origin) {
        serverName = req.headers.origin;
    }

    //res.header("Content-Type", "application/json; charset=utf-8");
    res.header("Access-Control-Allow-Origin", serverName);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(__dirname + '/public'));
//app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

app.get('/module/', function(req, res) {
    res.render('index.html');
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

var server = https.createServer(options);

if (options.crt && options.key){
    // Create an HTTPS service identical to the HTTP service.
    https.createServer(options, app).listen(app.get('port'));
} else {
    // Create an HTTP service.
    http.createServer(app).listen(app.get('port'));
}


//app.listen(app.get('port'), function () {
//    console.log(new Date().toISOString() + ': server started on port ' + app.get('port') +'!');
//});