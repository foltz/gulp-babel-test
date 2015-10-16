import React from 'react';
import ReactDOM  from 'react-dom';
import Router from 'react-router';

var createBrowserHistory = require('history/lib/createBrowserHistory');
let history = createBrowserHistory();

import routes from '../../app/routes/reactRoutes.jsx';

console.log('client-router!!!');
ReactDOM.render(<Router history={history} routes={routes}/>, document.getElementById("react-app"));
