const CourseModel = require('../models/course')
const AccountModel = require('../models/account')
const { data, param, css } = require('jquery')
var jwt =require('jsonwebtoken')
var bcrypt = require('bcrypt');

var fileModel = require('../models/file');
const { findById } = require('../models/course');

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
        CourseModel.find({slug:req.params.slug})
        AccountModel.find({
            slug: req.params.slug,
            'role' :'student'
        })
        .then(data=>{
        res.render('./student/allstudent', {account:data})
        })  
    
}
teacher(req,res){
    
    AccountModel.find({
        slug: req.params.slug,
        role :'teacher'
    })
    .then(data=>{
    res.render('./teacher/teacher_profile', {teacher:data})
    })  

}

           
                //sơn test|
                viewmanagine(req,res){
                     let slug = req.params.slug
                    AccountModel.find({slug:slug,role:"student"},(err,data)=>{
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
                allDocument(req,res){
                    fileModel.find({
                        studentemail : req.params.email
                    }).then(data=>{
                        res.render('./file/allDocument',{file : data})
                    })
                }
        
                danhgiabaibao(req,res){
                    let id = req.params.id
                    fileModel.find({_id:id},(err,data)=>{
                if(err){
                    console.log(err)
                }
                else if(data.length>0){
                    res.render('course/danhgia',{data:data})

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
                    fileModel.findById({_id :id},function(err,data){
                        let studentemail = data.studentemail
                    fileModel.updateOne(
                    { _id: id },   // Query parameter
                    {                     // Replacement document
                        status: status,
                        comment: comment
                    })
                    .then(()=>{
                            res.redirect('/course/allDocument/' + studentemail)
                        })
                    })
         
                }
}
module.exports = new CourseController;