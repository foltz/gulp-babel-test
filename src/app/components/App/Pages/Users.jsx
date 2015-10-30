
import React from 'react';
import Firebase from 'firebase';

class UserApi {

	constructor() {

		var FB_URL = "https://slacktravel-test.firebaseio.com/AppUsers/";
		this.fBase = new Firebase(FB_URL);
	}

	// --------------------------------------------------------------
	// - COMPONENT LIFECYCLE AND COMMUNICATION
	// --------------------------------------------------------------

	mountListView(cb) {

		this.fBase.limitToLast(25).on('value', function(list) {

			var items = [];
			list.forEach(function(rec) {

				var item = rec.val();
				//item['.key'] = rec.key();
				item.id = rec.key();

				items.push(item);

			});

			cb(items);
		});
	}

	unmountListView() { this.fBase.off() }
	


	formView = null;
	selectedUser = {};

	mountFormView(formView) {
		this.formView = formView;
		this.formView.setRec(this.selectedUser);
	}

	unmountFormView(formView) {
		this.formView = null;
	}
	
	selectUser(rec) {
		this.selectedUser = rec;
		if (this.formView)
			this.formView.setRec(this.selectedUser);
	}


	// --------------------------------------------------------------
	// - ACTIONS
	// --------------------------------------------------------------

	//addItem (text) { this.fBase.push({ text: text }) }
	removeUser (id) { this.fBase.child(id).remove() }

	saveUser(form) {
		//this.saveUserLocal(form);
		this.saveUserServer(form);
	}
	saveUserServer (form) {

		$.post("/api/appUser/save", form, (result) => {
			console.log("save user: ", result);
		});
	}

	saveUserLocal (form) {

		if (form.id) {

			// - check to see if the user exists....
			let userRef = this.fBase.child(form.id);

			userRef.once('value', function(result) {

				var user = result.val();
				if (user == null) {
					console.log("No user found");
					return;
				}

				user.firstName = form.firstName;
				user.lastName = form.lastName;
				user.email = form.email;

				userRef.set(user);

			});

		} else {

			let user = {};

			user.firstName = form.firstName;
			user.lastName = form.lastName;
			user.email = form.email;

			let userRef = this.fBase.push();
			userRef.set(user);

		}
	}
}

class UserListView extends React.Component {

	constructor(props) {

		super(props);

		this.api = new UserApi();
		this.state = { text: '', items: [], rec: {}};
	}


	getApi () { return this.api }

	getItems () { return this.state.items }
	setItems(items) { this.setState({items: items})}

	//getText () { return this.state.text }
	//setText(text) { this.setState({text: text})}
	//
	//getRec () { return this.state.rec }
	//setRec(rec) { this.setState({rec: rec})}


	// --------------------------------------------------------------
	// - COMPONENT LIFECYCLE
	// --------------------------------------------------------------

	componentWillMount() {
		console.log('ListView will mount');
	}

	componentDidMount () {
		console.log('ListView did mount');
		this.getApi().mountListView((items) => this.setItems(items));
	}

	componentWillUnmount () {
		console.log('ListView will unmount');
		this.getApi().unmountListView();
	}

	componentWillReceiveProps(next) {
		console.log('ListView will receive props');
	}


	// --------------------------------------------------------------
	// - EVENT HANDLERS
	// --------------------------------------------------------------

	//onChange (fieldName, e) {
	//
	//	var rec = this.getRec();
	//	rec[fieldName] = e.target.value;
	//	this.setRec(rec);
	//
	//	console.log("onChange: ", rec);
	//}
	//
	//onSubmit (e) {
	//
	//	e.preventDefault();
	//
	//	var rec = this.getRec();
	//
	//	this.getApi().saveUser(rec);
	//	this.setRec({});
	//}


	// --------------------------------------------------------------
	// - RENDER
	// --------------------------------------------------------------

	render () {

		var api = this.getApi();
		var items = this.getItems();
		//var text = this.getText();

		//var rec = this.getRec();
		////var setRec = this.setRec.bind(this);
		//
		//function selectUser () {
		//	console.log("select: ", this);
		//	//setRec(this);
		//	api.selectUser(this);
		//}

		function ListItems() {

			var createItem = (item, index) => (

				<li key={ index }>
					<span
						onClick={api.selectUser.bind(api, item)}
						style={{ color: 'blue', marginLeft: '10px', cursor: 'pointer' }}
						>{ item.firstName } { item.lastName } ({item.email})</span>

					<span
						onClick={ api.removeUser.bind(api, item.id) }
						style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}

						>X</span>
				</li>
			);

			return <ul>{ items.map(createItem) }</ul>;
		}

		return (
			<div>

				<ListItems />
				<UserEditView api={api} />

			</div>
		);
	}
}


class UserEditView extends React.Component {

	constructor(props) {

		console.log("User Edit View - render");
		super(props);

		this.api = props.api;
		this.state = {rec:{}}
	}

	getApi () { return this.api }

	getRec () { return this.state.rec }
	setRec(rec) { this.setState({rec: rec})}


	// --------------------------------------------------------------
	// - COMPONENT LIFECYCLE
	// --------------------------------------------------------------

	componentWillMount() {
		console.log('FormView will mount');
	}

	componentDidMount () {
		console.log('FormView did mount');
		this.getApi().mountFormView(this);
	}

	componentWillUnmount () {
		console.log('FormView will unmount');
		this.getApi().unmountFormView();
	}

	componentWillReceiveProps(next) {
		console.log('FormView will receive props');
	}

	// --------------------------------------------------------------
	// - EVENT HANDLERS
	// --------------------------------------------------------------

	onChange (fieldName, e) {

		var rec = this.getRec();
		rec[fieldName] = e.target.value;
		this.setRec(rec);

		console.log("onChange: ", rec);
	}

	onSubmit (e) {

		e.preventDefault();

		var rec = this.getRec();

		this.getApi().saveUser(rec);
		this.setRec({});
	}


	// --------------------------------------------------------------
	// - RENDER
	// --------------------------------------------------------------


	render () {
		
		return (
			<div>
				<h2>Edit User</h2>
				<form onSubmit={ this.onSubmit.bind(this) }>

					<input onChange={this.onChange.bind(this, "firstName")} value={this.state.rec.firstName} /> first <br/>
					<input onChange={this.onChange.bind(this, "lastName")} value={this.state.rec.lastName} /> last <br/>
					<input onChange={this.onChange.bind(this, "email")} value={this.state.rec.email} /> email <br/>
					<input type="submit" value="Save" />
				</form>

			</div>
		);
	}
}
export default UserListView;