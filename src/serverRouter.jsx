
import React from 'react';
import Router from 'react-router';

import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { match, RoutingContext } from 'react-router'

import reactRoutes from './app/routes/reactRoutes';
import apiRoutes from './api/apiRoutes';


var init = (app, renderAs) => {

	var layout = (name) => {
		switch(renderAs) {
			case "client-only":
			case "server-only":
				return `${name}-${renderAs}`;

			default:
				return name;
		}
	};


	//app.get('/dashboard', function (req, res) {
	//	Router.run(routes, req.url, Handler => {
	//		let content = React.renderToString(<Handler />);
	//		res.render('dashboard', { content: content });
	//	});
	//});


	app.use('/api', apiRoutes);

	app.get('/*', (req, res) => {

		match({ routes:reactRoutes, location: req.url }, (error, redirectLocation, renderProps) => {

			if (error) res.status(500).send(error.message);

			else if (redirectLocation)
				res.redirect(302, redirectLocation.pathname + redirectLocation.search);

			else if (renderProps) {
				res.render(layout("index"), {
					title: 'gulp-babel-test',

					//content:renderToString(<RoutingContext {...renderProps} />)
					content:renderToStaticMarkup(<RoutingContext {...renderProps} />)
				});
				//res.status(200).send(renderToString(<RoutingContext {...renderProps} />));
			}


			else res.status(404).send('Not found');

		});

	});
};

export default {initApp: init};