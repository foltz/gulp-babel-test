var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('*', function(req, res, next) {
	res.render('dashboard', { title: 'Dashboard', content:'this is the content yo!' });
});

module.exports = router;
