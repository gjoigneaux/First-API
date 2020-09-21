const express = require('express');
const router = express.Router();
const bouncer = require('express-bouncer')(1000, 2000, 3);//(Mini attend, max attente, nombre de tentative)
const userCtrl = require('../controllers/user');

//permet de bloquer les tentative de connexion par force brute
bouncer.blocked = function (req, res, next, remaining)
{
	res.send (429, "Too many requests have been made, " +
    "please wait " + remaining / 100 + " seconds");
};

router.post('/signup', userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login);

module.exports = router;