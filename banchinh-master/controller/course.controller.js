const CourseModel = require('../models/course')
const AccountModel = require('../models/account')
const { data, param, css } = require('jquery')
var jwt =require('jsonwebtoken')
var bcrypt = require('bcrypt');

var fileModel = require('../models/file')

class CourseController {
    
    create(req,res){
        res.render('./course/create')
    }

    detail(req,res){
        let slug = req.params.slug;
        let java = "java"
        CourseModel.find({
            slug : slug
        })
        .then(data=>{
            console.log(data)
            res.render('./course/detail',{course:data})
        })
        
    }

    allcourse(req,res ){
        CourseModel.find({

        })
        .then(data=>{
            res.render('./course/course',{course: data})
        })
        .catch(err=>{
            res.json("loi sever")
        })
    }


    search(req,res){
        var coursename = req.body.coursename;
        var topic = req.body.topic;
        CourseModel.find({
            coursename : coursename,   
        })
        .then(data=>{
            res.render('./course/course',{course:data})
        })
    }

    create(req,res,next){
        res.render('./course/create')
    }

    update(req,res){
        CourseModel.findById(req.params.id)
        .then(data=>
            res.render('./course/update',{course:data})
        )
    }

    docreate(req,res){
        // var coursename = req.body.coursename;
        // var topic = req.body.topic;
        // var slug = req.body.slug
        // CourseModel.findOne({
        //     coursename : coursename,
        //     topic : topic
        // })
        // .then(data=>{
        //     if(data){
        //         res.json("da ton tai")
        //     }
        //     else{
        //         return CourseModel.create({
        //             coursename : coursename,
        //             topic : topic,
        //             slug : coursename
        //         })
        //     }
        // })
        // .then(data=>{
        //     res.redirect('/course/allcourse')
        // })
        // .catch(err=>{})
        var coursenme = req.body.coursename

        var newCourse = CourseModel({
            coursename : coursenme,
            topic : req.body.topic,
            slug: coursenme,
            student: []
        })
        newCourse.save(function(err){
            if(err){
                console.log(err)
            }else{
                res.redirect('/course/allcourse')
            }
        })
    }

    doupdate(req,res){
        // var id1 = req.params.id
        CourseModel.updateOne({
            _id : req.params.id
        }, req.body)
        .then(()=>{
            res.redirect('/course/allcourse')
        })
    }

    delete(req,res){
        CourseModel.deleteOne({
            _id :  req.params.id
        })
        .then(()=>{
            res.redirect('/course/allcourse')
        })
    }

////////////

addStudent(req,res){
//     CourseModel.find(function(err,data){
//         res.render('./student/course_student',{course:data})    
// })
res.render('./student/course_student',{course:data})    

}
// dotimhocsinh(req,res){
//     AccountModel.find({
//         email : req.body.email,   
//     })
//     .then(data=>{
//         res.render('timhocsinh',{account:data})
        
//     })
// }

doAddStudent(req,res){
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        let slug = req.body.slug;
        
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(password, salt);
                let newStudent = AccountModel({
                    username,
                    password :hash,
                    email,
                    slug  
                })
                newStudent.save(function(err,data){
                    if(err){
                        console.log(err)
                    }else{
                        res.render('./student/course_student')
                    }
                })

}

allstudent(req,res){
    let slug = req.params.slug
  AccountModel.find({
      slug: slug
  }).then(data=>{
  res.render('./student/allstudent',{account: data})

  })
}
           
                //sơn test|
                viewmanagine(req,res){
                     let slug = req.params.slug
                    AccountModel.find({slug:slug},(err,data)=>{
                if(err){
                    console.log(err)
                }
                else if(data.length>0){
                    res.render('./course/baocuahocsinh',{account:data})
 

                }
                else{
                    res.render('./course/baocuahocsinh',{account:data})
                }
            })
                }
        
                danhgiabaibao(req,res){
                    let email = req.params.email
                    fileModel.find({studentemail:email},(err,data)=>{
                if(err){
                    console.log(err)
                }
                else if(data.length>0){
                    res.render('course/danhgia',{data:data})
                    console.log(data)

                }
                else{
                    res.render('course/danhgia',{data:data})
                }
            })
                }

                dodanhgiabaibao(req,res){
                    let id = req.params.id
                    let status = req.body.status
                    let comment = req.body.comment

                    fileModel.updateOne(
                    { _id: id },   // Query parameter
                    {                     // Replacement document
                        status: status,
                        comment: comment
                    })
                    .then(data=>{
                        res.redirect('/course/allcourse')
                    })
                    .catch(err=>{
                        res.json("loi sever")
                    })
                }
}
module.exports = new CourseController;