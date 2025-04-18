// filepath: c:\Users\Karim\Desktop\Event-Ticketing-System-2\Server.js
const app = require('./app');
const connectDB = require('./config/db'); // Uncomment this line
const PORT = process.env.PORT || 5000;

connectDB(); // Ensure the database connection is established

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});