var mongoose = require('mongoose')
var slug = require('mongoose-slug-generator');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://minhpham852000:Quangminh2000@cluster0.46ara.mongodb.net/test";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;
const CourseSchema = new Schema({ 
    coursename : String,
    topic : String,
    slug: {type:String, slug: "coursename", unique:true },
    student : [{
        type : mongoose.Schema.Types.ObjectId
    }]
},{
    collection : 'course',
    timestamps : true
});

var CourseModel = mongoose.model('course', CourseSchema)
module.exports = CourseModel