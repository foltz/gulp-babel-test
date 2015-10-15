import React from 'react';
import {DefaultRoute, NotFoundRoute, Route} from 'react-router';

import App from '../components/App/App';
import NoMatch from '../components/App/NoMatch';

import About from '../components/App/Pages/About';
import Users from '../components/App/Pages/Users';
import User from '../components/App/Pages/User';
import Todos from '../components/App/Pages/Todos';
import List from '../components/App/Pages/List';

export default [
	<Route path="/" component={App}>
		<Route path="about" component={About}/>
		<Route path="users" component={Users}>
			<Route path=":userId" component={User}/>
		</Route>
		<Route path="todos" component={Todos}/>
		<Route path="list" component={List}/>
		<Route path="*" component={NoMatch}/>
	</Route>
];