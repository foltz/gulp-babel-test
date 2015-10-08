var express = require('express');
var path = require('path');

var app = express();

// - view engine setup:

app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'hbs');

//app.use('/dashboard', require('./routes/dashboardRoutes'));
//app.use('/', require('./routes/publicRoutes'));


var React = require('react')
var Router = require('react-router')

var routes = require('./routes/reactRoutes');

app.get('/*', function (req, res) {
	Router.run(routes, req.url, Handler => {
		let content = React.renderToString(<Handler />);
		res.render('index', { content: content });
	});
});


//app.use('/', require('./routes/reactRoutes'));
//
//app.use(function(req, res, next) {
//	var router = Router.create({location: req.url, routes: routes})
//	router.run(function(Handler, state) {
//		var html = React.renderToString(<Handler/>)
//		return res.render('index', {title:'React', content: html})
//	})
//})




module.exports = app;


var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
