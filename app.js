require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Debugging environment variables
console.log("DB_URL:", process.env.DB_URL);
console.log("PORT:", process.env.PORT || 5000);
console.log("ORIGIN:", process.env.ORIGIN);

// Middleware setup
app.use(express.json());
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(cookieParser());

// Routes
try { 
    // Auth routes
    const authRoutes = require('./routes/authRoute.js');
    app.use('/api/v1', authRoutes);

    // Booking routes
    const bookingRoutes = require('./routes/bookingRoutes.js');
    app.use('/api/v1/bookings', bookingRoutes);

    // User routes
    const userRoutes = require('./routes/UserRoutes');
    app.use('/api/v1/users', userRoutes);

    // Event routes
    const eventRoutes = require('./routes/EventRoutes');
    app.use('/api/v1/events', eventRoutes);

    console.log("Routes loaded successfully");
} catch (error) {
    console.error("Error loading routes:", error.message);
    process.exit(1);
}

// Connect to MongoDB Atlas
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => {
        console.error("DB connection error:", err.message);
        process.exit(1);
    });


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;