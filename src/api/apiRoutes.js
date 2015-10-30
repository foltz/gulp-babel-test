
import express from 'express';
import bodyParser from 'body-parser';


import {AppUserCommands} from './auth/AppUser';

var router = express.Router();

// create application/x-www-form-urlencoded parser
var formParser = bodyParser.urlencoded({ extended: false });


var appUsers = new AppUserCommands();

router.get("/appUser/remove", formParser, (req, res) => {

	console.log("uc", appUsers);
	var testResult = appUsers.runTest("save test");

	res.json({url:req.url, body:req.body, test:testResult});
	res.end();

});

router.post("/appUser/save", formParser, (req, res) => {

	var save = appUsers.saveRec(req.body);

	// - TODO: wire up AppUserCommands....
	res.json({url:req.url, body:req.body, appUser:save});
	res.end();

});

export default router;
