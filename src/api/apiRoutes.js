
import express from 'express';
import bodyParser from 'body-parser';


import AppUsers from './auth/AppUser';

var router = express.Router();

// create application/x-www-form-urlencoded parser
var formParser = bodyParser.urlencoded({ extended: false });


router.get("/appUser/remove", formParser, (req, res) => {


	res.json({url:req.url, body:req.body});
	res.end();

});

router.post("/appUser/save", formParser, (req, res) => {

	console.log("uc", AppUsers);
	var appUserResult = new AppUsers.AppUserCommands.runTest();
	// - TODO: wire up AppUserCommands....
	res.json({url:req.url, body:req.body, appUser:appUserResult});
	res.end();

});


//var apiRoutes = (req, res) => {
//
//
//	res.json({url:req.url, spired:true});
//	res.end();
//}

export default router;
