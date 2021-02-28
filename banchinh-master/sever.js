const express = require("express");
const app = express();
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
app.set('views','./views');

app.set('view engine','hbs');
app.use(cookieParser())

var AccountRoutes = require('./routes/account.route')
var courseRoute = require('./routes/course.route')
var indexrouter = require('./routes/index.route')
var studentRoute = require('./routes/student.route')

var fileModel =require('./models/file')
var fileRouter = require('./routes/file.route')

var path = require('path');
var pathh = path.resolve(__dirname,'public');
app.use(express.static(pathh));
app.use(bodyParser.urlencoded({extended:false}));


// var path = require('path');
// var duongDanPublic = path.resolve(__dirname,'public')
// app.use(express.static(duongDanPublic));
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

// app.use('/views', express.static(path.join(__dirname,'views')))
app.use('/student', studentRoute);
app.use('/account', AccountRoutes);
app.use('/course',courseRoute);
app.use('/',indexrouter);
app.use('/file',fileRouter)

app.get('/download/:id',(req,res)=>{
  fileModel.find({_id:req.params.id},(err,data)=>{
       if(err){
           console.log(err)
       }
       else{
           var x= __dirname+'/public/'+data[0].filePath;
           
           console.log(x)
           res.download(x)
       }
  })
})
const AccountModel = require('./models/account');

app.get('/hienthi',(req,res)=>{
  let a = AccountModel.find({
    username: "student"
  },(err,data)=>{
       if(err){
           console.log(err)
       }
       else{
        console.log(a)
       }
  })
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// app.get('/', function(req,res){
//   res.render('login')
// })

// app.post('/dologin', function(req,res,next){
//   var username = req.body.username;
//         var password = req.body.password;
    
//         AccountModel.findOne({
//             username : username,
//             password : password
//         })
//         .then(data=>{   
//             var token = jwt.sign({_id : data._id},'minh')
//             if(data){
//                 res.json({
//                     message: 'thanh cong',
//                     token : token
//                 })

//             }else{
//                 return  res.json('that bai')
//             }
//         })
//         .catch(err=>{
//             res.json('loi sever')
//         })
// })
  
// app.get('/private', function(req,res,next){
//   try {
//     var token = req.cookies.token
//     var result = jwt.verify(token,'minh')
//     if(result){
//       next()
//     }
//   } catch (err) {
//     return res.json('hay login')
//   }
// },(req,res,next)=>{
//   res.json('hello')
// })