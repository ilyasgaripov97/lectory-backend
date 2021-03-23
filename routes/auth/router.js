const { Router } = require('express');
const authController = require('../controllers/authController')

const router = Router();

router.post('/signup', authController.signupPOST);
router.post('/login', authController.loginPOST);

module.exports = router;