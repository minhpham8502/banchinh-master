var express = require('express');
var router = express.Router();
var {signUpController, loginController} = require('../controller/account.controller');
const { isEmail , checkLogin} = require('../middleware/index');



router.post('/sign-up', isEmail, signUpController)
router.post('/dologin', checkLogin, loginController)





////
// routes.get('/', accountController.user)
// routes.get('/login', accountController.login)
// //routes.get('/private', accountController.private)

// routes.post('/dologin', accountController.dologin)
// routes.post('/register', accountController.register)

module.exports = router
