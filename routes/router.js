const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const authenticateToken = require('../controller/authMiddleware');
const multer = require("multer");
const upload = UserController.upload;
const fs = require('fs');
const path = require('path');
const  TouristController  = require('../controller/TouristController');
const ensureLoggedIn = require('../middleware/sessionAuth');
const adminRoutes = require('./adminRoutes');
// Add this middleware to your router.js before protected routes
const preventCaching = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
router.use('/admin', adminRoutes);
router.post('/register-tourist', authenticateToken, UserController.registerTourist);
// Show Registration Page
router.get('/', (req, res) => {
    res.render('LandingPage');
});
router.get('/register1', (req, res) => {
    res.render('UserRegister', { session: req.session });
});


router.get('/booking', (req, res) => {
    res.render('BookingPage');
});
router.get('/navigation', (req, res) => {
    // Always provide a default user object if not in session
    const user = req.session && req.session.user ? req.session.user : { username: 'Guest' };
    
    res.render('navigation', { 
        user: user
    });
});
router.get('/AboutPage', (req, res) => {
    res.render('AboutPage');
});
router.get('/ContactPage', (req, res) => {
    res.render('ContactPage');
});
router.get('/FeaturesPage', (req, res) => {
    res.render('FeaturesPage');
});
router.get('/island', (req, res) => {
    res.render('IslandPage');
});


// Forgot Password Routes
router.post("/forgot-password", UserController.forgotPassword);
router.post("/verify-code", UserController.verifyCode);
router.post("/reset-password", UserController.resetPassword);


// Handle User Registration
router.post('/register', upload.single('profile_picture'), UserController.register);
// Show login form
router.get('/login', (req, res) => {
    res.render('Userlogin', { error: null });
});

// OR just this one instead of both, if you're using session error
router.get('/userlogin', (req, res) => {
    res.render('Userlogin', { 
        error: req.session.error,
        success: req.session.success  // Add this line for success messages
    });
    req.session.error = null;
    req.session.success = null;
});

// Handle login submission
router.post('/login', UserController.login);

// Protected user homepage (after login)
router.get('/user/home', preventCaching, ensureLoggedIn, (req, res) => {
    res.render('UserHome', { user: req.session.user });
});

// Handle User Logout
router.get('/logout', UserController.logout);

// Get User by ID
router.get('/user/:id', UserController.getUserById);


// Updated route with better error handling
// Tourist registration route with file upload
router.post('/register2', TouristController.upload.single('picture'), TouristController.registerTourist);
router.get('/tourist/history', TouristController.getHistory);
  
module.exports = router;