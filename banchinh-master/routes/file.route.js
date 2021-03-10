var express = require('express')
var fileRouter = express.Router()
var fileModel = require('../models/file')
var multer =  require('multer');
var bodyParser = require('body-parser');
let {checkAuth } = require('../middleware/index')
var AccountModel = require('../models/account')
const nodemailer =  require('nodemailer');

// sơn test chuyển word sang pdf npm i docx-pdf
// phải cài cả npm i phantomjs-prebuilt 
var docxConverter = require('docx-pdf');


fileRouter.use(checkAuth)
var path = require('path');


var pathh = path.resolve(__dirname,'public');
fileRouter.use(express.static(pathh));
fileRouter.use(bodyParser.urlencoded({extended:false}));

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/uploads')
    },
    filename:function(req,file,cb){
        var namefile = file.originalname
        cb(null,file.originalname)
    }
})
var upload = multer({storage:storage})




fileRouter.get('/',(req,res)=>{
    let email = req.cookies.email
    fileModel.find({studentemail:email},(err,data)=>{
        if(err){
            console.log(err)
        }
        else if(data.length>0){
            res.render('file/uploadFile',{data:data})
        }
        else{
            res.render('file/uploadFile',{data:{data}})
        }
    })
})

fileRouter.get('/dieukhoan',(req,res)=>{
    AccountModel.findOne({
        role: "admin"
    },function(err, result){
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let hour = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let year = date_ob.getFullYear();
        if(minutes < 10){
            dl = year + "-" + month + "-" + date + " " + hour + ":0" + minutes ;  
        }else{
                dl = year + "-" + month + "-" + date + " " + hour + ":" + minutes ;
        }
        
        if(month < 10){
            dl = year + "-0" + month + "-" + date + " " + hour + ":" + minutes ;
        }else{
            dl = year + "-" + month + "-" + date + " " + hour + ":" + minutes ;
    }
        
        if(dl < result.deadline  ){
            res.render('file/dieukhoan')
        } else{
            res.json("da het han nop bai")
        }
    })    
})


fileRouter.post('/upload',upload.single('filePath'),(req,res)=>{
    var x = 'uploads/'+req.file.originalname;
    
    //lấy địa chỉ thử mục cần chuyển sang pdf
    var x1 = './public/' + x
    

    //cài đặt địa chỉ để lưu file pdf sau khi chuyển  
    var xx = x1.split('.');
    filePath1 = '.' + xx[1] + '.pdf'
    console.log(filePath1)


    //lấy địa chỉ để lưu vào db
    var filePath = x.split('.');
    filePath = filePath[0] + '.pdf'
    
    //lấy địa chỉ để lưu vào db
    var y = req.file.originalname;
    var yy = y.split('.');
    nameFile = yy[0] + '.pdf'
    console.log(nameFile)

   
    fileRouter.use('/uploads', express.static('uploads'));

    var y = req.file.originalname;
    docxConverter(x1,filePath1,function(err,result){
        if(err){
          console.log(err);
        }
        console.log('result'+result);
      });
    let email = req.cookies.email
    var temp = new fileModel({
        filePath:filePath,
        nameFile : nameFile,
        studentemail: email,
        slug: req.cookies.slug
    })
  
    temp.save((err,data)=>{
        if(err){
            console.log(err)
        }
        //tiến hành gửi mail
        var transporter =  nodemailer.createTransport({ // set up mail server
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'nguyenminhsonhandsome@gmail.com', //Tài khoản gmail 
                pass: 'minhson123a' //Mật khẩu tài khoản 
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
            });
        //nội dung mail
        let email = req.cookies.email
        var content = 'Bạn vừa upload 1 bài báo lên hệ thống. Name: ' + x;
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'NQH-Test nodemailer',
            to: 'nguyenminhson09112000@gmail.com',  // gửi vào mail của sơn để test, thay bằng mail học sinh bằng email = req.cookies.email
            subject: 'Test Nodemailer',
            text: content //nội dungdung
            // html: content //Nội dung html mình đã tạo trên kia :))
        }
        //bắt đầu gửi mail
        transporter.sendMail(mainOptions, function(err, info){
            if (err) {
                console.log(err);
            } 
        });
        let slug = req.cookies.slug

        AccountModel.findOne({
            role: "teacher",
            slug: slug
        },function(err, result){

            //tiến hành gửi mail cho MarketingCoordinator 
            var content = email + 'vừa upload 1 bài báo lên hệ thống. Name: ' + x;
            var mainOptions2 = { // thiết lập đối tượng, nội dung gửi mail
            from: 'NQH-Test nodemailer',
            to: result.email,  // địa chỉ gửi mail
            subject: 'bài đăng mới',
            text: content //nội dungdung
        }
            // gửi mail cho MarketingCoordinator 
            transporter.sendMail(mainOptions2, function(err, info){
                if (err) {
                    console.log(err);
                } 
        });
        })
        res.redirect('/file')
    })
})

fileRouter.get('/download/:id',(req,res)=>{
    fileModel.find({_id:req.params.id},(err,data)=>{
         if(err){
             console.log(err)
         }
         else{
             var x= __dirname+'/public/'+data[0].filePath;
             res.download(x)
         }
    })
})

module.exports = fileRouter