require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
const authRoute = require('./routes/authRoute');
app.use('/api/v1/auth', authRoute);

const bookingRoutes = require('./routes/bookingRoutes.js');
app.use('/api/v1/bookings', bookingRoutes);

const userRoutes = require('./routes/UserRoutes');
app.use('/api/v1/users', userRoutes);

const eventRoutes = require('./routes/EventRoutes');
app.use('/api/v1/events', eventRoutes);

// Database connection
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => {
        console.error("DB connection error:", err.message);
        process.exit(1);
    });

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;