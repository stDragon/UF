module.exports = function(app){
    var https        = require('https'),
        http         = require('http'),
        fs           = require('fs');

    app.set('port', process.env.PORT || 8080);

    var httpServer = http.createServer(app);

    httpServer.listen(app.get('port'), function () {
        console.log(new Date().toISOString() + ': server started on port ' + app.get('port') +'!');
    });

    var options;

    try {
        options = {
            key: fs.readFileSync('../ssl/certificate.key'),
            cert: fs.readFileSync('../ssl/certificate.crt')
        };
        app.set('portSSL', process.env.PORTSSL || 443);
        var httpsServer = https.createServer(options, app);
        httpsServer.listen(app.get('portSSL'), function () {
            console.log(new Date().toISOString() + ': serverSSL started on port ' + app.get('portSSL') +'!');
        });
    } catch (e) {
        console.error(new Date().toISOString() + ': serverSSL not started!');
    }

    return app;
};