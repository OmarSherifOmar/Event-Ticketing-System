const mongoose = require('mongoose')
const User = require("./User")
mongoose.connect("mongodb://localhost/ETS")

user = new User({name:"king", age:100, email:"ool"})

user.save()
console.log(user)
