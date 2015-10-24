
import express from 'express';


var router = express.Router();


var apiRoutes = (req, res) => {


	res.json({url:req.url, spired:true});
	res.end();
}

export default apiRoutes;
