module.exports = function(app){
    var https        = require('https'),
        http         = require('http'),
        fs           = require('fs');
    var options = {
        key: fs.readFileSync('../ssl/certificate.key'),
        cert: fs.readFileSync('../ssl/certificate.crt')
    };

    app.set('port', process.env.PORT || 80);
    app.set('portSSL', process.env.PORTSSL || 443);

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

    var httpServer = http.createServer(app);
    var httpsServer = https.createServer(options, app);

    httpServer.listen(app.get('port'), function () {
        console.log(new Date().toISOString() + ': server started on port ' + app.get('port') +'!');
    });
    httpsServer.listen(app.get('portSSL'), function () {
        console.log(new Date().toISOString() + ': server started on port ' + app.get('portSSL') +'!');
    });

    return app;
};