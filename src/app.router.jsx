
var React = require('react')
var Router = require('react-router')

var routes = require('./routes/reactRoutes');

var init = (app) => {

	app.get('/dashboard', function (req, res) {
		Router.run(routes, req.url, Handler => {
			let content = React.renderToString(<Handler />);
			res.render('dashboard', { content: content });
		});
	});

	app.get('/*', function (req, res) {
		Router.run(routes, req.url, Handler => {
			let content = React.renderToString(<Handler />);
			res.render('index', { content: content });
		});
	});
}
var test = () => "yo";

module.exports =  {initApp: init, testMe: test};