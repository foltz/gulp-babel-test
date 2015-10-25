
import express from 'express';


var router = express.Router();


router.get("/appUser/edit", (req, res) => {


	res.json({url:req.url, spired:true});
	res.end();

});

router.get("/appUser/save", (req, res) => {


	res.json({url:req.url, spired:true});
	res.end();

});


//var apiRoutes = (req, res) => {
//
//
//	res.json({url:req.url, spired:true});
//	res.end();
//}

export default router;
