var express = require('express');
var CourseModel = require('../models/course'); 
var guestRoute = express.Router();
let {checkAuth,checkAdmin } = require('../middleware/index')
const { isEmail } = require('../middleware/index');
const guestController = require('../controller/guest.controller');

guestRoute.use('/uploads', express.static('uploads'));
guestRoute.use('/public', express.static('public'));
// guestRoute.get('/view:slug', guestController.viewmanagine)

guestRoute.get('/danhsachsvien:slug', guestController.baosinhvien)

guestRoute.get('/danhgiabaibao:id', guestController.danhgiabaibao)
// guestRoute.post('/dodanhgiabaibao:id', guestController.dodanhgiabaibao)
module.exports = guestRoute