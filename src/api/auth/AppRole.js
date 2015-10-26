//import Firebase from 'firebase';
var AppRoleDoc = (function () {
    function AppRoleDoc() {
    }
    return AppRoleDoc;
})();
var AppRoleForm = (function () {
    function AppRoleForm() {
    }
    return AppRoleForm;
})();
var AppRoleCommands = (function () {
    //fbRepo:Firebase = null;
    function AppRoleCommands() {
        //this.fbRepo = new Firebase(url);
    }
    AppRoleCommands.prototype.runTest = function () { return "yo baby!"; };
    AppRoleCommands.prototype.saveRec = function (form) {
        var cmd = new Command();
        var FB_URL = "https://slacktravel-test.firebaseio.com/AppRoles/";
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
            var user = new AppRoleDoc();
            user.firstName = form.firstName;
            user.lastName = form.lastName;
            user.email = form.email;
            var userRef = fBase.push();
            userRef.set(user);
        }
        fBase.off();
        return cmd.setSuccess(null);
    };
    return AppRoleCommands;
})();
exports.AppRoleCommands = AppRoleCommands;
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
function AppRoles() {
    return new AppRoleCommands();
}
exports.AppRoles = AppRoles;
