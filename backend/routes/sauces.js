const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');

router.get('/', sauceCtrl.viewSauce);
router.get('/:id', sauceCtrl.viewOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/', auth, multer, sauceCtrl.modifySauce);
router.delete('/', auth, multer, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, multer, sauceCtrl.likeSauce);

module.exports = router;