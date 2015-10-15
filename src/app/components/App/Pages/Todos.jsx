
import React, { Component } from 'react';
import Firebase from 'firebase';

var FB_URL = "https://slacktravel-test.firebaseio.com/items";

var TodoList = React.createClass({

  render: function () {

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
});

var Todos = React.createClass({

	//mixins: [ReactFireMixin],

	getInitialState: function () {

		console.log('getInitialState');
		return { items: [], text: ''};
	},

	componentWillMount: function() {

		console.log('componentWillMount');

	},

	componentDidMount: function () {

		console.log('componentDidMount');

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
	},

	componentWillUnmount: function () {

		console.log('componentWillUnmount');
		if (this.firebaseRef)
		{
			this.firebaseRef.off();
			console.log('firebase-off');
		}
	},

	onChange: function (e) {
		//console.log(e.target.value);
		this.setState({text: e.target.value});
	},

	removeItem: function (key) {
		var firebaseRef = new Firebase(FB_URL);
		firebaseRef.child(key).remove();
	},

	handleSubmit: function (e) {

		e.preventDefault();

		if (this.state.text && this.state.text.trim().length !== 0) {
			this.firebaseRef.push({
				text: this.state.text
			});
			this.setState({ text: ''});
		}
	},

	render: function () {
		return (
			<div>
				<TodoList items={ this.state.items } removeItem={ this.removeItem } />
				<form onSubmit={ this.handleSubmit }>
					<input onChange={ this.onChange } value={ this.state.text } />
					<button>{ 'Add #' + (this.state.items.length + 1) }</button>
				</form>
			</div>
		);
	}
});

export default Todos;
