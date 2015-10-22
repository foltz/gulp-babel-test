
import React from 'react';
import Router from 'react-router';

import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { match, RoutingContext } from 'react-router'

import routes from './app/routes/reactRoutes';

var init = (app) => {

	//app.get('/dashboard', function (req, res) {
	//	Router.run(routes, req.url, Handler => {
	//		let content = React.renderToString(<Handler />);
	//		res.render('dashboard', { content: content });
	//	});
	//});

	app.get('/*', (req, res) => {

		match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {

			if (error) res.status(500).send(error.message);

			else if (redirectLocation)
				res.redirect(302, redirectLocation.pathname + redirectLocation.search);

			else if (renderProps) {
				res.render('index', {
					title: 'gulp-babel-test',
					//content: ''
					//content:renderToString(<RoutingContext {...renderProps} />)
					content:renderToStaticMarkup(<RoutingContext {...renderProps} />)
				});
				//res.status(200).send(renderToString(<RoutingContext {...renderProps} />));
			}


			else res.status(404).send('Not found');

		});

	});

	//app.get('/*', function (req, res) {
	//	React.render(<Router routes={routes}/>, el)
	//	Router.run(routes, req.url, Handler => {
	//		let content = React.renderToString(<Handler />);
	//		res.render('index', { content: content });
	//	});
	//});
};

export default {initApp: init};