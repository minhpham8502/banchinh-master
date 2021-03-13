// let {signUp} = require('../service/auth')
const { JsonWebTokenError } = require('jsonwebtoken');
const AccountModel = require('../models/account');
const CourseModel = require('../models/course')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { data } = require('jquery');
const saltRounds = 10;
// const { model } = require('../models/account');
let indexAdmin = (req,res)=>{
    let email = req.cookies.email
    AccountModel.findOne({email : email})
    .then(data=>{
        console.log(data)
        res.render('./home/homeAdmin',{account:data})

    })
}
let indexTeacher = (req,res)=>{
    let email = req.cookies.email
    AccountModel.findOne({email : email})
    .then(data=>{
        console.log(data)
        res.render('./home/homeTeacher',{account:data})

    })
}
let indexStudent = (req,res)=>{
    let email = req.cookies.email
    AccountModel.findOne({email : email})
    .then(data=>{
        console.log(data)
        res.render('./home/homeStudent',{account:data})

    })
}
// let indexGuest = (req,res)=>{
//     let email = req.cookies.email
//     AccountModel.findOne({email : email})
//     .then(data=>{
//         console.log(data)
//         res.render('./home/homeGuest',{account:data})

//     })
// }
// let indexManager = (req,res)=>{
//     let email = req.cookies.email
//     AccountModel.findOne({email : email})
//     .then(data=>{
//         console.log(data)
//         res.render('./home/homeManager',{account:data})

//     })
// }

let signUpController = async(req,res)=>{
    try {
        // let {username, password, email} = inforUser;
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        
            if(username && password){
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(password, salt);
                AccountModel.create({
                    username,
                    password :hash,
                    email
                });
            }
            let token = jwt.sign({_id: req.body._id},'minh');
            res.cookie("token",token,{maxAge: 60*60*1000});
        return res.status(200).json({
            message : "Sign Up success",
            error : false
        })
    } catch (error) {
        if(error){
            res.status(400).json({
                message : "Sign Up fail",
                error: true
            })
        }
    }
}

let loginController = function(req,res){
    bcrypt.compare(req.body.password, req.user.password, function(err,result){
        if(err){
            return res.status(500).json({
                message : "loi sever",
                status: 500,
                error : true
            })}

        if(result){
            let token = jwt.sign({_id : req.user._id},'minh',{expiresIn :'1d'})
            res.cookie("token",token,{maxAge: 24*60*60*1000});
            let user = req.user 
            // res.status(200).json({
            //     message : "Sign In success",
            //     error : false,
            //     data:{
            //         user : req.user
            //     }
            // })

            res.cookie('email',user.email, { maxAge: 900000, httpOnly: true });
            res.cookie('slug',user.slug, { maxAge: 900000, httpOnly: true });
            
            if(user.role === "admin"){
                res.render("home/homeAdmin",{account:user})
            }
            if(user.role === "student"){
                res.render('./home/homeStudent',{account:user})
            }
            if(user.role === "teacher"){
                res.render('./home/homeTeacher',{account:user})
            }
            if(user.role === "guest"){
                CourseModel.find({
                })
                .then(data=>{
                    res.render('./home/homeGuest',{account:user,course:data})
                })
                .catch(err=>{
                    res.json("loi sever")
                })
            }                        
        }else{
            return res.status(400).json({   
                message : "Sai tk,mk",
                error : true
            })
            
        }
        }
    )


}

// let detail=(req,res)=>{
//     var token = req.cookies.token || req.body.token
//     let decodeAccount = jwt.verify(token,'minh')
//     let user = await getUserById(decodeAccount._id)
//     if(user){
//         res.render('homeAd')
//     }
// }
    



module.exports ={
    signUpController,
    loginController,
    indexAdmin,
    indexTeacher,
    indexStudent
}

