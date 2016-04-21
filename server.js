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