const CourseModel = require('../models/course')
const AccountModel = require('../models/account')
const { data, param, css } = require('jquery')
var jwt =require('jsonwebtoken')
var bcrypt = require('bcrypt');

var fileModel = require('../models/file')

class guestController {
    baosinhvien(req,res){
        let slug = req.params.slug;
        console.log("slug là :",slug)
        fileModel.find({slug:slug},function(err,result){
            if(err){
                console.log(err) }else{
                res.render('guest/baocuahocsinh',{data:result})
                    // console.log(result)
            }
        })
            
    }
    // if(err){
    //     console.log(err)
    // }
    // else if(data.length>0){
    //     res.render('guest/baocuahocsinh',{data:data})
    //     console.log(data)

    // }
    // else{
    //     res.render('guest/baocuahocsinh',{data:data})
    // }


    // viewmanagine(req,res){
    //     let slug = req.params.slug
    //     fileModel.find({studentemail:slug},(err,data)=>{
    //         if(err){
    //             console.log(err)
    //         }
    //         else if(data.length>0){
    //             res.render('guest/baocuahocsinh',{data:data})
    //             console.log(data)

    //         }
    //         else{
    //             res.render('guest/baocuahocsinh',{data:data})
    //         }
    //     })
    //         }
danhgiabaibao(req,res){
                    let id = req.params.id
                    fileModel.find({_id:id},(err,data)=>{
                if(err){
                    console.log(err)
                }
                else if(data.length>0){
                    res.render('guest/danhgia',{data:data})
                    console.log(data)

                }
                else{
                    res.render('guest/danhgia',{data:data})
                }
            })
                }

//                 dodanhgiabaibao(req,res){
//                     let id = req.params.id
//                     let status = req.body.status
//                     let comment = req.body.comment

//                     fileModel.updateOne(
//                     { _id: id },   // Query parameter
//                     {                     // Replacement document
//                         status: status,
//                         comment: comment
//                     })
//                     .then(data=>{
//                         res.redirect('/course/allcourse')
//                     })
//                     .catch(err=>{
//                         res.json("loi sever")
//                     })
//                 }
}
module.exports = new guestController;