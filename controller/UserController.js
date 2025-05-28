const bcrypt = require('bcrypt');
const User = require('../model/UserModel'); // ✅ Make sure the path is correct
const TouristModel= require('../model/TouristModel');
const db = require('../config/db');
const multer = require("multer") 
const path = require("path");
const nodemailer = require("nodemailer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Save files in 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"), false);
        }
    }
});



const UserController = {
   // In UserController.js
// In UserController.js - register method
register: async (req, res) => {
    try {
        console.log("🔹 Received Registration Data:", req.body);
        console.log("🔹 Uploaded File:", req.file);

        const newUser = {
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            contact_number: req.body.contact_number,
            email: req.body.email,
            password: req.body.password,
            date_of_birth: req.body.date_of_birth || '2000-01-01',
            gender: req.body.gender || 'Other',
            nationality: req.body.nationality || 'N/A',
            address: req.body.address || 'N/A',
            profile_picture: req.file ? req.file.filename : 'default.jpg'
        };

        const requiredFields = ['username', 'first_name', 'last_name', 'contact_number', 'email', 'password'];
        const missingFields = requiredFields.filter(field => !newUser[field]);

        if (missingFields.length > 0) {
            console.error("❌ Missing required fields:", missingFields);
            req.session.error = `Missing required fields: ${missingFields.join(', ')}`;
            return res.redirect('/register1');
        }

        // Check if user exists
        console.log("🔹 Checking if email exists:", newUser.email);
        const existingUser = await User.findByEmail(newUser.email);

        if (existingUser) {
            console.log("❌ Email already registered:", newUser.email);
            req.session.error = 'Email is already registered.';
            return res.redirect('/register1');
        }

        // Hash password
        console.log("🔹 Hashing password");
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashedPassword;

        console.log("📦 Final user data before save:", newUser);

        // Save user
        try {
            console.log("🔹 Attempting to save user");
            const result = await User.createUser(newUser);
            console.log("✅ User registered successfully with ID:", result.insertId);
            
            req.session.success = 'Registration successful! Please log in.';
            return res.redirect('/userlogin');
        } catch (dbError) {
            console.error("❌ Failed to create user:", dbError);
            req.session.error = 'Database error. Please try again later.';
            return res.redirect('/register1');
        }
    } catch (error) {
        console.error("❌ Registration error:", error);
        console.error("❌ Error stack:", error.stack);
        req.session.error = 'An unexpected error occurred. Please try again.';
        return res.redirect('/register1');
    }
},
    
    // User Login
// User Login with improved error handling
login: async (req, res) => {
    const { email, password } = req.body;
    
    console.log("Login attempt with:", { email });

    try {
        // Check if db is properly initialized
        if (!db || !db.query) {
            console.error("❌ Database connection is not available");
            req.session.error = 'Database connection error. Please try again later.';
            return res.redirect('/userlogin');
        }
        
        try {
            // Find user by email - use direct query for debugging
            const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            console.log("Query result rows:", rows ? rows.length : 'undefined');
            
            const user = rows[0];
            
            if (!user) {
                console.log("❌ No user found with email:", email);
                req.session.error = 'Invalid email or password.';
                return res.redirect('/userlogin');
            }
            
            console.log("Found user:", {
                id: user.user_id,
                email: user.email,
                type: user.user_type,
                passwordHash: user.password ? user.password.substring(0, 20) + '...' : 'undefined' // Show part of hash for debugging
            });
            
            // Compare passwords
            console.log("Comparing password with hash...");
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Password match result:", isMatch);
            
            if (!isMatch) {
                console.log("❌ Passwords do not match!");
                req.session.error = 'Invalid email or password.';
                return res.redirect('/userlogin');
            }
            
            // Login successful
            console.log("✅ Login successful for user type:", user.user_type);

            // Store user data in session
            req.session.user = {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                user_type: user.user_type
            };

            // Redirect based on user type
            console.log("Redirecting based on user type:", user.user_type);

            switch(user.user_type) {
                case 'admin':
                    console.log("Redirecting to admin dashboard");
                    return res.redirect('/admin/dashboard');  // This should match your route in adminRoutes.js
                case 'entry_provider':
                    return res.redirect('/provider/entry');
                case 'activity_provider':
                    return res.redirect('/provider/activities');
                case 'tourist':
                default:
                    return res.redirect('/user/home');
            }
        } catch (dbQueryError) {
            console.error("❌ Database query error:", dbQueryError);
            req.session.error = 'Database query error. Please try again later.';
            return res.redirect('/userlogin');
        }
    } catch (err) {
        console.error("❌ General error:", err);
        req.session.error = 'An unexpected error occurred. Please try again later.';
        return res.redirect('/userlogin');
    }
},
    

    // Get User by ID
getUserById: async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.getUserById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        return res.status(500).json({ error: 'Database error' });
    }
},

    

    
logout: (req, res) => {
    // Set cache control headers to prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Failed to logout. Please try again.');
        }
        res.clearCookie('connect.sid'); // Remove session cookie
        res.redirect('/userlogin'); // Redirect to login page
    });
},
    // Forgot Password - Generate and Send Code
    forgotPassword: async (req, res) => {
        const { email } = req.body;
    
        try {
            const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    
            if (!users || users.length === 0) {
                return res.status(404).json({ message: "Email not found" });
            }
    
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
            await db.query(
                "UPDATE users SET reset_code = ?, reset_expiry = ? WHERE email = ?",
                [resetCode, expirationTime, email]
            );
    
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "rjaybalinton833@gmail.com",
                    pass: "eaal kwcp xvpo kxcr"
                }
            });
    
            const mailOptions = {
                from: "rjaybalinton833@gmail.com",
                to: email,
                subject: "Password Reset Code",
                text: `Your reset code is: ${resetCode}`
            };
    
            await transporter.sendMail(mailOptions);
    
            res.json({ message: "Reset code sent to your email." });
    
        } catch (error) {
            console.error("❌ Error sending reset code:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    },
     
    verifyCode: async (req, res) => {
        const { email, code } = req.body;
    
        try {
            const [results] = await db.query("SELECT reset_code, reset_expiry FROM users WHERE email = ?", [email]);
    
            if (!results || results.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }
    
            const user = results[0];
    
            // Check code
            if (user.reset_code !== code) {
                return res.status(400).json({ message: "Invalid reset code." });
            }
    
            // Check expiry
            if (new Date(user.reset_expiry) < new Date()) {
                return res.status(400).json({ message: "Reset code has expired." });
            }
    
            res.json({ message: "Code verified successfully." });
    
        } catch (err) {
            console.error("Error verifying code:", err);
            res.status(500).json({ message: "Server error." });
        }
    },
    
    resetPassword: async (req, res) => {
        const { email, newPassword } = req.body;
    
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
    
            await db.query(
                "UPDATE users SET password = ?, reset_code = NULL, reset_expiry = NULL WHERE email = ?",
                [hashedPassword, email]
            );
    
            res.json({ message: "Password successfully reset!" });
        } catch (error) {
            console.error("Reset error:", error);
            res.status(500).json({ message: "Server error!" });
        }
    },
    
    registerTourist: (req, res) => {
        console.log("🔹 Session Data:", req.session);
        console.log("🔹 User in Session:", req.session.user);
    
        // Check if user is authenticated
        if (!req.session.user || !req.session.user.user_id) {
            return res.status(401).json({ error: 'Unauthorized: Please log in first.' });
        }
    
        // Convert req.body to a plain object to avoid null prototype issues
        req.body = Object.assign({}, req.body);
    
        console.log("✅ Received Body Data:", req.body);
        console.log("✅ Uploaded File:", req.file ? req.file.filename : "No file uploaded");
    
        // Check if required fields exist
        const requiredFields = ['email', 'phone', 'first_name', 'last_name', 'age', 'gender', 
                               'nationality', 'residence', 'arrival_date', 'departure_date', 
                               'accommodation'];
        
        const missingFields = [];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                missingFields.push(field);
            }
        }
        
        if (missingFields.length > 0) {
            console.error("❌ Missing required fields:", missingFields);
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }
    
        if (!req.file) {
            console.error("❌ No file uploaded");
            return res.status(400).json({ error: 'Please upload a picture' });
        }
    
        const picture = req.file ? req.file.filename : 'default.jpg';
    
        const touristData = {
            user_id: req.session.user.user_id,
            email: req.body.email,
            phone: req.body.phone,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            age: req.body.age,
            gender: req.body.gender,
            nationality: req.body.nationality,
            residence: req.body.residence,
            companions_12: req.body.companions_12 || 0,
            companions_below_12: req.body.companions_below_12 || 0,
            arrival_date: req.body.arrival_date,
            departure_date: req.body.departure_date,
            picture: picture,
            accommodation: req.body.accommodation
        };
    
        TouristModel.registerTourist(touristData, (err, result) => {
            if (err) {
                console.error("❌ Database Error:", err.sqlMessage || err);
                return res.status(500).json({ error: 'Database error', details: err.message });
            }
            console.log("✅ Tourist Registered Successfully:", result.insertId);
            res.status(201).json({ message: 'Tourist registered successfully', touristId: result.insertId });
        });
    }
    

  
};

// ✅ Correct module.exports
module.exports = UserController;
module.exports.upload = upload;