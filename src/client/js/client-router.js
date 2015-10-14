var React  = require('react');
var createBrowserHistory = require('history/lib/createBrowserHistory');
//import { Router, Route, IndexRoute } from 'react-router'

var routes = require('../../app/routes/reactRoutes.jsx');

React.render(routes, document.body);