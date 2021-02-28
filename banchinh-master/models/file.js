var mongoose = require('mongoose');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://minhpham852000:Quangminh2000@cluster0.46ara.mongodb.net/test";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);


var picSchema= new mongoose.Schema({
    filePath:String,
    nameFile : String,
    studentemail: String,
    status: {
        type : String,
        default : "not rate"
    },
    comment: {
        type : String,
        default : ""
    },
})

var picModel = mongoose.model('file',picSchema);

module.exports = picModel