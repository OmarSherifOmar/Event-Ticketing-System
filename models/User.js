// filepath: c:\Users\Karim\Desktop\Event-Ticketing-System-2\models\User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilepicture: {
        type: String,
        required: true
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
    },
    resetToken: { type: String },
resetTokenExpiry: { type: Date }
});

const User = mongoose.model("User", userSchema);
module.exports = User;