const { Router } = require('express');
const authController = require('../controllers/authController')

const router = Router();

router.post('/signup', authController.signupPOST);
router.post('/login', authController.loginPOST);
router.get('/signup', authController.signupGET);
router.get('/login', authController.loginGET);

module.exports = router;