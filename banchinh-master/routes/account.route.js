var express = require('express');
var router = express.Router();
var {signUpController, loginController,indexAdmin,indexTeacher, indexStudent} = require('../controller/account.controller');
const {checkAuth, isEmail , checkAdmin,checkLogin,checkTeacher} = require('../middleware/index');



router.post('/sign-up', isEmail, signUpController)
router.post('/dologin', checkLogin, loginController)

router.get('/indexAdmin',checkAuth ,checkAdmin, indexAdmin)
router.get('/indexTeacher',checkAuth ,checkTeacher, indexTeacher)
router.get('/indexStudent',checkAuth , indexStudent)

// router.get('/indexGuest',checkAuth,checkGuest , checkGuest,indexGuest)
// router.get('/indexManager',checkAuth, checkManager, checkManager,indexManager)








////
// routes.get('/', accountController.user)
// routes.get('/login', accountController.login)
// //routes.get('/private', accountController.private)

// routes.post('/dologin', accountController.dologin)
// routes.post('/register', accountController.register)

module.exports = router
