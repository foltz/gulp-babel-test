var express = require('express');
var path = require('path');

var app = express();
var appRouter = require('./server-router');

// - view engine setup:

app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'hbs');

app.use('/css', express.static('www/client/css'));
app.use('/js', express.static('www/client/js'));

appRouter.initApp(app);


//app.use('/dashboard', require('./routes/dashboardRoutes'));
//app.use('/', require('./routes/publicRoutes'));

module.exports = app;


var server = app.listen(3000, function () {
	var host = server.address().address || 'localhost';
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});