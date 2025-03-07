const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/ETS")

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

const User = mongoose.model("User", userSchema);