const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql2/promise');
const routes = require('./routes/router');
const multer = require('multer');
const db = require('./config/db'); // Import your database connection
const adminRoutes = require('./routes/adminRoutes');
const touristRoutes = require('./routes/touristRoutes');
const bookingsRouter = require('./routes/bookings');
const providerRoutes = require('./routes/providerRoutes'); // Add this line
const app = express();
const cors = require('cors');

// Setup Multer
const upload = multer({ dest: 'uploads/' });

// View Engine
app.set('view engine', 'ejs');

// Body Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static('uploads'));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());

// Routes (in proper order)
app.use('/', bookingsRouter);  // This handles /api/bookings/* routes
app.use('/', routes);
app.use('/admin', adminRoutes);
app.use('/provider', providerRoutes);
app.use('/', touristRoutes);

// Start Server
app.listen(3233, () => {
    console.log('Server running on http://localhost:3233');
    console.log('Routes registered:');
    console.log('- Bookings routes: /api/bookings/*');
    console.log('- Main routes: /');
    console.log('- Admin routes: /admin/*');
     console.log('- Provider routes: /provider/*'); // Add this line
    console.log('- Tourist routes: /');
});