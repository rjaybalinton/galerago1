const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Use your existing database connection

// Get all tourist locations for the dropdown
router.get('/api/tourist-locations', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, name, latitude, longitude, category, description, 
                   address, opening_hours, contact_info, website, 
                   entrance_fee, rating, image
            FROM tourist_locations
            ORDER BY name
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching tourist locations:', error);
        res.status(500).json({ error: 'Failed to fetch tourist locations' });
    }
});

// Get nearby locations based on user's position
router.get('/api/nearby-locations', async (req, res) => {
    try {
        const { lat, lng, radius = 5 } = req.query; // radius in kilometers
        
        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        // Calculate nearby locations using Haversine formula in MySQL
        const [rows] = await db.query(`
            SELECT id, name, latitude, longitude, category, description, 
                   address, opening_hours, contact_info, website, 
                   entrance_fee, rating, image,
                   (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
            FROM tourist_locations
            HAVING distance < ?
            ORDER BY distance
        `, [lat, lng, lat, radius]);
        
        res.json(rows);
    } catch (error) {
        console.error('Error fetching nearby locations:', error);
        res.status(500).json({ error: 'Failed to fetch nearby locations' });
    }
});

// Get details for a specific location
router.get('/api/tourist-locations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM tourist_locations WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Tourist location not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching tourist location details:', error);
        res.status(500).json({ error: 'Failed to fetch tourist location details' });
    }
});

// Render the navigation page
router.get('/navigation', (req, res) => {
    // Always provide a default user object if not in session
    const user = req.session && req.session.user ? req.session.user : { username: 'Guest' };
    
    res.render('navigation', { 
        user: user
    });
});
// Add these routes to your tourist routes or main routes file

// Public packages route (for tourists to view)
// Public packages route (for tourists to view)
router.get('/api/packages/public', async (req, res) => {
  try {
    const [packages] = await db.query(`
      SELECT p.*, u.username as created_by_name
      FROM packages p
      LEFT JOIN users u ON p.created_by = u.user_id
      WHERE p.activity_type IN ('Island Hopping', 'Snorkeling')
      ORDER BY p.activity_type, p.created_at DESC
    `);
    
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// Island page route
router.get('/tourist/islands', (req, res) => {
  console.log('Session user:', req.session.user); // Debug line
  
  if (!req.session.user || req.session.user.user_type !== 'tourist') {
    return res.redirect('/login');
  }
  
  res.render('tourist/IslandPage', { 
    user: req.session.user,
    title: 'Island Adventures'
  });
});

// Create booking
router.post('/api/bookings', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.user_type !== 'tourist') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const {
      package_id,
      booking_date,
      number_of_participants,
      contact_number,
      emergency_contact,
      emergency_phone,
      special_requests
    } = req.body;

    // Get package details
    const [packageResult] = await db.query('SELECT * FROM packages WHERE id = ?', [package_id]);
    if (packageResult.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const package = packageResult[0];
    
    // Check if participants exceed max
    if (number_of_participants > package.max_participants) {
      return res.status(400).json({ error: `Maximum ${package.max_participants} participants allowed` });
    }

    // Get tourist info
    const [touristResult] = await db.query('SELECT tourist_id FROM tourists WHERE user_id = ?', [req.session.user.user_id]);
    if (touristResult.length === 0) {
      return res.status(400).json({ error: 'Tourist profile not found. Please complete your profile first.' });
    }

    const tourist_id = touristResult[0].tourist_id;
    const total_amount = parseFloat(package.price) * parseInt(number_of_participants);
    
    // Generate booking reference
    const booking_reference = 'PG' + Date.now().toString().slice(-8);

    // Create booking
    const [result] = await db.query(`
      INSERT INTO bookings (
        package_id, tourist_id, user_id, booking_date, number_of_participants,
        total_amount, contact_number, emergency_contact, emergency_phone,
        special_requests, booking_reference
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      package_id, tourist_id, req.session.user.user_id, booking_date,
      number_of_participants, total_amount, contact_number,
      emergency_contact, emergency_phone, special_requests, booking_reference
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking_id: result.insertId,
      booking_reference: booking_reference,
      total_amount: total_amount
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get user bookings
// Get user bookings
router.get('/api/bookings/my', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.user_type !== 'tourist') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const [bookings] = await db.query(`
      SELECT b.*, p.name as package_name, p.activity_type, p.image as package_image
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [req.session.user.user_id]);

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});
module.exports = router;