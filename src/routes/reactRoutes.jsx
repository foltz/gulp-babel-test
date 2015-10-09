import React from 'react';
import {DefaultRoute, NotFoundRoute, Route} from 'react-router';

import App from '../components/App/App';
import NoMatch from '../components/App/NoMatch';

import About from '../components/App/Pages/About';
import Users from '../components/App/Pages/Users';
import User from '../components/App/Pages/User';

export default [
	<Route path="/" component={App}>
		<Route path="/about" component={About}/>
		<Route path="users" component={Users}>
			<Route path="/user/:userId" component={User}/>
		</Route>
		<Route path="*" component={NoMatch}/>
	</Route>,
	<Route path="/dashboard/*" component={require('../components/App/App')}>
		{/* ... */}
	</Route>
];