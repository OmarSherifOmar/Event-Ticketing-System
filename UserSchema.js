require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    profilepicture:{
        type:String,
        required:true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Standard User', 'Organizer', 'System Admin'],
        default: 'Standard User'
    },
      createdAt: {
        type: Date,
        default: Date.now
      }
    

})
module.exports = Event;

const User = mongoose.model("Users", userSchema);