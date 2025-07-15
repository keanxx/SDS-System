const express = require('express');
const cors = require('cors');
const path = require('path');

// Load routes
const appointmentRoutes = require('./routes/appointment');
const travelRoutes = require('./routes/travel');
const employeeRoutes = require('./routes/employee'); 
// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes
app.use('/api', appointmentRoutes);       // All /api/appointment and /api/appointments
app.use('/api', travelRoutes);    // All /api/travels routes
app.use('/api', employeeRoutes); // Correctly mount employee routes


// Start server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT}`);
});