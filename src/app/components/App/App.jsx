
import React, { PropTypes, Component } from 'react';
import {Link} from 'react-router';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

class App extends Component {

	static propTypes = {
		children: PropTypes.element, //.isRequired,
		error: PropTypes.object,
	}

	componentWillMount() {
		console.log('App will mount');
	}

	componentDidMount () {
		console.log('App did mount');
	}

	componentWillUnmount() {
		console.log('App will unmount');
	}

	componentWillReceiveProps(next) {
		console.log('App will receive props');
	}

	componentWillUpdate() {
		console.log('App will update');
	}

	componentDidUpdate() {
		console.log('App did update');
	}

	render() { return !this.props.error ?
		(<div>
			<div>
				<Link to="/">Home</Link> &nbsp;
				<Link to="/about">About</Link> &nbsp;
				<Link to="/users">Users</Link> &nbsp;
				<Link to="/users/23">One User</Link> &nbsp;
				<Link to="/todos">Todos</Link> &nbsp;
				<Link to="/list">List</Link> &nbsp;
			</div>
			<Header />
				{this.props.children}
			<Footer />
		</div>)

			: this.props.children;
  }
}

export default App;
