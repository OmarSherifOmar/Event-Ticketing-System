const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose"); 
const jwt = require("jsonwebtoken");


const JWT_SECRET = "your_jwt_secret_key";

 
exports.register = async (req, res) => {
    try {
        // For debugging: log body and file
        console.log("Request body:", req.body); 
        console.log("Uploaded file:", req.file);

        const { name, email, password, role } = req.body;
        // Get the uploaded file path (if file was uploaded)
        const profilepicture = req.file ? req.file.path : null;

        // Validate required fields
        if (!name || !email || !password ) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            profilepicture
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during registration:", error); 
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            maxAge: 3600000, //(1 hour)
        });

        // Send user info along with token
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                name: user.name,
                role: user.role,
                profilepicture: user.profilepicture,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });
    res.status(200).json({ message: "Logged out successfully" });
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { name, profilepicture } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, profilepicture },
            { new: true }
        );

        res.status(200).json({ message: "Profile updated successfully", updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.updateProfilePicture = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: user not found in request" });
        }
        const userId = req.user.id;
        const profilepicture = req.file ? req.file.path : null;

        if (!profilepicture) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilepicture },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ profilepicture: updatedUser.profilepicture });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.deleteUser = async (req, res) => {
    console.log("Delete user request received for ID:", req.params.id);
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users); 
    } catch (error) {
        console.error("Error fetching users:", error); 
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const userId = req.params.id; 
        const { role } = req.body; 

        const validRoles = ['Standard User', 'Organizer', 'System Admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role. Valid roles are: 'Standard User', 'Organizer', 'System Admin'" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        
        if (req.user.id === updatedUser.id) {
            const token = jwt.sign(
                { id: updatedUser.id, role: updatedUser.role },
                process.env.SECRET_KEY,
                { expiresIn: "1h" }
            );
            res.cookie("token", token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === "production", 
                maxAge: 3600000, //(1 hour)
            });
        }

        res.status(200).json({ message: "User role updated successfully", updatedUser });
    } catch (error) {
        console.error("Error updating user role:", error); 
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id; 

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user); 
    } catch (error) {
        console.error("Error fetching user by ID:", error); 
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.getCurrentUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password"); 

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user); 
    } catch (error) {
        console.error("Error fetching current user's profile:", error); 
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const crypto = require("crypto");
const nodemailer = require("nodemailer");


exports.forgetPassword = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { email } = req.body;
        
        if (!email) {
            console.log('No email provided');
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(404).json({ message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 1000 * 60 * 5;

        user.resetToken = otp;
        user.resetTokenExpiry = expiry;
        await user.save();

        console.log('OTP generated:', otp);

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "🔐 Reset Your Password - OTP Inside",
            html: `
            <html>
                <head>
                    <style>
                        body {
                            background-color: #f5f7fa;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            background-color: #ffffff;
                            margin: 40px auto;
                            border-radius: 8px;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                            overflow: hidden;
                        }
                        .header {
                            background-color: #0f4c81;
                            padding: 20px;
                            text-align: center;
                            color: #ffffff;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                            letter-spacing: 1px;
                        }
                        .content {
                            padding: 30px;
                            text-align: center;
                        }
                        .content p {
                            font-size: 16px;
                            color: #555;
                        }
                        .otp-box {
                            margin: 20px auto;
                            background-color: #e0f7fa;
                            border: 2px dashed #00acc1;
                            padding: 15px 25px;
                            font-size: 26px;
                            font-weight: bold;
                            color: #007c91;
                            width: fit-content;
                            border-radius: 6px;
                            letter-spacing: 4px;
                        }
                        .footer {
                            background-color: #f0f0f0;
                            padding: 20px;
                            text-align: center;
                            font-size: 14px;
                            color: #777;
                        }
                        .footer a {
                            color: #0f4c81;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Eventify</h1>
                            <p>Password Reset Request</p>
                        </div>
                        <div class="content">
                            <p>Hi there 👋</p>
                            <p>Use the OTP below to reset your password. It is valid for <strong>5 minutes</strong>.</p>
                            <div class="otp-box">${otp}</div>
                            <p>If you didn’t request this, you can safely ignore this email.</p>
                        </div>
                        <div class="footer">
                            &copy; ${new Date().getFullYear()} Eventify. Need help? <a href="mailto:support@eventify.com">Contact us</a>
                        </div>
                    </div>
                </body>
            </html>
            `
        };
        
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        res.status(200).json({ 
            message: "OTP sent to email",
            hint: "Check spam folder if not received"
        });

    } catch (error) {
        console.error("Full error:", error);
        res.status(500).json({ 
            message: "Server error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;
        if (!email || !token || !newPassword) {
            return res.status(400).json({ message: "Email, token, and new password are required" });
     } 
    
        const user = await User.findOne({ email });
        
      if (!user|| user.resetToken !== token || user.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined; 
        user.resetTokenExpiry = undefined; 
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Top up wallet
exports.topUpWallet = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Invalid top-up amount" });
        }
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.wallet = (user.wallet || 0) + Number(amount);
        await user.save();
        res.json({ message: "Wallet topped up successfully", wallet: user.wallet });
    } catch (err) {
        res.status(500).json({ message: "Failed to top up wallet", error: err.message });
    }
};
