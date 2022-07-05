const express = require('express');
const  sendEmailController  = require('../controllers/sendEmailController');

const router = express.Router();

router.post('/', sendEmailController.sendEmailForgotPassword);


module.exports = router;
