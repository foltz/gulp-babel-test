//import Firebase from 'firebase';


interface IAppRole {

	firstName?:string;
	lastName?:string;
	email?:string;
}

class AppRoleDoc implements IAppRole {
	firstName:string;
	lastName:string;
	email:string;
}
class AppRoleForm {

	id:string;
	firstName:string;
	lastName:string;
	email:string;
}

export class AppRoleCommands {


	//fbRepo:Firebase = null;

	constructor() {
		//this.fbRepo = new Firebase(url);
	}

	runTest() { return "yo baby!"}

	saveRec (form:AppRoleForm) : Command {

		var cmd = new Command();


		var FB_URL = "https://slacktravel-test.firebaseio.com/AppRoles/";
		var fBase = new Firebase(FB_URL);

		if (form.id) {

			// - check to see if the user exists....
			let userRef = fBase.child(form.id);

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

			let user = new AppRoleDoc();

			user.firstName = form.firstName;
			user.lastName = form.lastName;
			user.email = form.email;

			let userRef = fBase.push();
			userRef.set(user);

		}

		fBase.off();

		return cmd.setSuccess(null);
	}
}

class Command {

	public success: boolean;
	public error: string;
	public data: any;

	public setError(msg) {
		this.success = false;
		this.error = msg;
		return this;
	}

	public setSuccess(data) {
		this.success = true;
		this.data = data;
		return this;
	}
}

export function AppRoles () {
	return new AppRoleCommands()
}

