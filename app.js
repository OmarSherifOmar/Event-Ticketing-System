require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Debugging environment variables
console.log("DB_URL:", process.env.DB_URL);
console.log("PORT:", process.env.PORT);

// Middleware setup
app.use(express.json());
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/authRoute.js');
app.use('/api/v1', authRoutes);

const userRoutes = require('./routes/UserRoutes');
app.use('/api/v1/users', userRoutes);

// Connect to MongoDB Atlas
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => {
        console.error("DB connection error:", err);
        process.exit(1);
    });

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

module.exports = app;