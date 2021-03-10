var express = require('express');
var indexrouter = express.Router();
let {getUserById} = require('../middleware/index')
var jwt = require("jsonwebtoken")
var AccountModel = require('../models/account')

indexrouter.get('/login' ,(req,res,next)=>{
//         let dealine = '2021-3-1';
// let ts = Date.now();
// let date_ob = new Date(ts);
// let date = date_ob.getDate();
// let month = date_ob.getMonth() + 1;
// let year = date_ob.getFullYear();
// dl = year + "-" + month + "-" + date;
// console.log("abc:",dl)
// // prints date & time in YYYY-MM-DD format
// console.log(year + "-" + month + "-" + date);
// if(dl < dealine  ){
//     res.render('login.hbs')
// }else{
//     console.log("dahethannopbai")
// }
    res.render('login.hbs')
})

//????????????????????
indexrouter.get('/home',async function (req,res){
    try {
        var token = req.cookies.token || req.body.token
        let decodeAccount = jwt.verify(token,'minh')
        let user = await getUserById(decodeAccount._id)
        if(user.role === "admin"){
            return res.render("home/homeAdmin")
        }
        if(user.role === "student"){
            return res.render("home/homeStudent")
        }
        if(user.role === "teacher"){
            return res.render("home/homeTeacher")
        }
        
    } catch (error) {
        res.status(500).json({
            message : "hay dang nhap",
            status: 500,
            error : true
        },
        )
    }
})




indexrouter.post('/set' ,(req,res,next)=>{
    let date = req.body.date;
    let time = req.body.time;
    let deadline = date + " " + time;
    AccountModel.findOneAndUpdate({role: "admin"},{deadline:deadline})
    .then(data=>{
        res.json(data)
    })
    
})

module.exports = indexrouter
