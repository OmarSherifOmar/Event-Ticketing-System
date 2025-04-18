const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose"); 
const jwt = require("jsonwebtoken");


const JWT_SECRET = "your_jwt_secret_key"; // Replace with a secure key

 
exports.register = async (req, res) => {
    try {
        console.log("Request body:", req.body); // Debugging log
        const { name, email, password, role, profilepicture } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
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
        console.error("Error during registration:", error); // Log the error
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

        // Set the token in a cookie
        res.cookie("token", token, {
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            maxAge: 3600000, // 1 hour
        });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is extracted from the JWT
        const { name, profilepicture } = req.body;

        // Update the user's profile
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
// Delete a user
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

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users); // Return the users in the response
    } catch (error) {
        console.error("Error fetching users:", error); // Log the error
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// Update user's role (Admin only)
exports.updateUserRole = async (req, res) => {
    try {
        const userId = req.params.id; // Extract user ID from the route parameter
        const { role } = req.body; // Extract the new role from the request body

        // Validate the role
        const validRoles = ['Standard User', 'Organizer', 'System Admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role. Valid roles are: 'Standard User', 'Organizer', 'System Admin'" });
        }

        // Update the user's role
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User role updated successfully", updatedUser });
    } catch (error) {
        console.error("Error updating user role:", error); // Log the error
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// Get a single user by ID (Admin only)
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id; // Extract user ID from the route parameter

        // Validate the user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // Fetch the user from the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user); // Return the user details
    } catch (error) {
        console.error("Error fetching user by ID:", error); // Log the error
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// Get current user's profile (Authenticated Users)

exports.getCurrentUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the JWT (set by authentication middleware)

        // Fetch the user from the database
        const user = await User.findById(userId).select("-password"); // Exclude the password field

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user); // Return the user details
    } catch (error) {
        console.error("Error fetching current user's profile:", error); // Log the error
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const crypto = require("crypto");

exports.forgetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Validate input
        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error); // Log the error
        res.status(500).json({ message: "Server error", error: error.message });
    }
};