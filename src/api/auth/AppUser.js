//eval('var Slacktravel = (this.Slacktravel || (this.Slacktravel = {}))');
//import Firebase from 'firebase';
var AppUserDoc = (function () {
    function AppUserDoc() {
    }
    return AppUserDoc;
})();
var AppUserForm = (function () {
    function AppUserForm() {
    }
    return AppUserForm;
})();
var AppUserCommands = (function () {
    //fbRepo:Firebase = null;
    function AppUserCommands() {
        //this.fbRepo = new Firebase(url);
    }
    AppUserCommands.prototype.runTest = function () { return "yo baby!"; };
    AppUserCommands.prototype.saveRec = function (form) {
        var cmd = new Command();
        var FB_URL = "https://slacktravel-test.firebaseio.com/AppUsers/";
        var fBase = new Firebase(FB_URL);
        if (form.id) {
            // - check to see if the user exists....
            var userRef = fBase.child(form.id);
            userRef.once('value', function (result) {
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
        }
        else {
            var user = new AppUserDoc();
            user.firstName = form.firstName;
            user.lastName = form.lastName;
            user.email = form.email;
            var userRef = fBase.push();
            userRef.set(user);
        }
        fBase.off();
        return cmd.setSuccess(null);
    };
    return AppUserCommands;
})();
var Command = (function () {
    function Command() {
    }
    Command.prototype.setError = function (msg) {
        this.success = false;
        this.error = msg;
        return this;
    };
    Command.prototype.setSuccess = function (data) {
        this.success = true;
        this.data = data;
        return this;
    };
    return Command;
})();
function AppUsers() {
    return new AppUserCommands();
}
exports.AppUsers = AppUsers;
