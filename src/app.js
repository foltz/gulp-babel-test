var express = require('express');
var path = require('path');

var app = express();

// - view engine setup:

app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'hbs');

app.use('/dashboard', require('./routes/dashboardRoutes'));
app.use('/', require('./routes/publicRoutes'));

module.exports = app;


var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
