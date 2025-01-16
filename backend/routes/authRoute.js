const express = require('express');
const authController = require('../controller/authController');


const router = express.Router();


router.route('/register').post(authController.SignUp);
router.route('/login').post(authController.Login);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').patch(authController.resetPassword);



router.route('/all').get(authController.ListAllUser);

module.exports = router;
