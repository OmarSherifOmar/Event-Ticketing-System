const mongoose = require('mongoose')
const User = require("./User")
//mongoose.connect("mongodb://localhost/ETS")

user = new User({name:"king", email:"ETS@gmail.com", profilepicture:"https://www.bing.com/th?id=OIP.tLotgCDtzgTdwJcTiXWRCwHaEK&w=164&h=100&c=8&rs=1&qlt=90&o=6&cb=15&pid=3.1&rm=2",
    password:"123", role:"Organizer"})

user.save()
console.log(user)
