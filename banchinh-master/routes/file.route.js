var express = require('express')
var fileRouter = express.Router()
var fileModel = require('../models/file')
var multer =  require('multer');
var bodyParser = require('body-parser');
let {checkAuth } = require('../middleware/index')

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
    res.render('file/dieukhoan')
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
        studentemail: email
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
            } else {
                console.log('Message sent: ' +  info.response);
            }
        });    
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