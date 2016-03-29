var express      = require('express'),
    errorhandler = require('errorhandler'),
    bodyParser   = require('body-parser');

var app = module.exports.app = exports.app = express();

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

app.post('/users', jsonParser, function(req, res) {
    var score = req.body;
    score.id = Date.now().toString();
    setTimeout(function(){
        res.json(score, 201);
    }, 2000);
});

app.listen(8888, function () {
  console.log('Example app listening on port 8888!');
});

app.use(require('connect-livereload')());