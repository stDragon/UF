var express      = require('express'),
    errorhandler = require('errorhandler'),
    bodyParser   = require('body-parser');

var app = module.exports.app = exports.app = express();

app.set('port', process.env.PORT || 80);

var jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    //res.header("Content-Type", "application/json; charset=utf-8");
    res.header("Access-Control-Allow-Origin", "http://bx.local");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('public'));
//app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

app.get('/', function(req, res) {
    res.render('index.html');
});

app.post('/users', jsonParser, function(req, res) {
    var score = req.body;
    score.id = Date.now().toString();
    setTimeout(function(){
        res.json(score, 201);
    }, 2000);
});

app.listen(app.get('port'), function () {
  console.log(new Date().toISOString() + ': server started on port ' + app.get('port') +'!');
});

app.use(require('connect-livereload')());