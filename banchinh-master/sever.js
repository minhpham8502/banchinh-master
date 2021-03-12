const express = require("express");
// const app = express();
const app = express();

var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
var path = require('path');

app.set('views','./views');

app.set('view engine','hbs');
app.use(cookieParser())

var AccountRoutes = require('./routes/account.route')
var courseRoute = require('./routes/course.route')
var indexrouter = require('./routes/index.route')
var studentRoute = require('./routes/student.route')
var teacherRoute = require('./routes/teacher.route')
var guestRoutes = require('./routes/guest.route')

var fileModel =require('./models/file')
var fileRouter = require('./routes/file.route')

var pathh = path.resolve(__dirname,'public');
app.use(express.static(pathh));
app.use(bodyParser.urlencoded({extended:false}));


// var path = require('path');
// var duongDanPublic = path.resolve(__dirname,'public')
// app.use(express.static(duongDanPublic));
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

// app.use('/views', express.static(path.join(__dirname,'views')))
app.use('/guest', guestRoutes);
app.use('/student', studentRoute);
app.use('/teacher', teacherRoute);
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
// //////////////////////////////////////////////////////////////////////////////////


const http = require('http');

const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');
// var AccountRoute = require('./routers/account.route')


const server = http.createServer(app);
const io = socketio(server);

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('chat', AccountRoute);
const botName = 'ChatCord Bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        // formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


