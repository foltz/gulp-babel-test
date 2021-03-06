
import React, { Component } from 'react';
import Firebase from 'firebase';

var FB_URL = "https://slacktravel-test.firebaseio.com/items";

class ListItems extends Component {

	constructor(props) {
		super(props);
		this.state = { items: [{".key": 'ddd', text:'test item'}], text: ''};
	}

	render () {

		var _this = this;
		var createItem = function(item, index) {
			return (
				<li key={ index }>{ item.text }
					<span
						onClick={ _this.props.removeItem.bind(null, item['.key']) }
						style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}>
					X
					</span>
				</li>
			);
		};
		return <ul>{ this.props.items.map(createItem) }</ul>;
	}
}

class List extends Component {

	constructor(props) {
		super(props);
		this.state = { items: [{".key": 'ddd', text:'test item'}], text: ''};
	}

	componentWillMount() {
		console.log('List will mount');
	}

	componentDidMount () {
		console.log('List did mount');

		this.firebaseRef = new Firebase(FB_URL);

		this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {

			var items = [];
			dataSnapshot.forEach(function(childSnapshot) {

				var item = childSnapshot.val();
				item['.key'] = childSnapshot.key();
				items.push(item);

			}.bind(this));

			this.setState({ items: items});

		}.bind(this));
	}

	componentWillUnmount () {
		console.log('List will unmount');
		this.firebaseRef.off();
	}

	componentWillReceiveProps(next) {
		console.log('List will receive props');
	}

	onChange (e) {
		console.log(e.target.value);
		this.setState({text: e.target.value});
	}

	removeItem (key) {
		var firebaseRef = new Firebase(FB_URL);
		firebaseRef.child(key).remove();
	}

	handleSubmit (e) {

		e.preventDefault();

		if (this.state.text && this.state.text.trim().length !== 0) {
			this.state.items.push({
				text: this.state.text
			});
			this.setState({ text: ''});
		}
	}

	render () {
		return (
			<div>
				<ListItems items={ this.state.items } removeItem={ this.removeItem } />
				<form onSubmit={ this.handleSubmit }>
					<input onChange={ this.onChange } value={ this.state.text } />
					<button>{ 'Add? #' + (this.state.items.length + 1) }</button>
				</form>
			</div>
		);
	}
}

export default List;
