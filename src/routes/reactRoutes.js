var React = require('react')
var {DefaultRoute, NotFoundRoute, Route} = require('react-router')

module.exports = [
	<Route path="/" handler={require('../components/App/App.js')}>
	{/* ... */}
	</Route>
]