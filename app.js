var express = require('express');

var app = module.exports.app = exports.app = express();

require('./server.js')(app);
require('./router.js')(app);

