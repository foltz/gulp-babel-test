import React from 'react';
import ReactDOM  from 'react-dom';
import Router from 'react-router';

var createBrowserHistory = require('history/lib/createBrowserHistory');
let browserHistory = createBrowserHistory();

import reactRoutes from './app/routes/reactRoutes.jsx';

console.log('client-app!!!');
ReactDOM.render(<Router history={browserHistory} routes={reactRoutes}/>, document.getElementById("react-app"));
