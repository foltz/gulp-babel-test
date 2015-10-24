
import express from 'express';


var router = express.Router();


var apiRoutes = (req, res) => {

	res.json({test:"val"});
	res.end();
}

export default apiRoutes;
