const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust path to your database config

// Booking history route
router.get('/api/bookings/history', async (req, res) => {
    console.log('=== Booking History Route Accessed ===');
    console.log('Session user:', req.session?.user);
    console.log('Full session:', req.session);
    
    try {
        // Get user ID from session
        const userId = req.session?.user?.user_id || req.session?.user?.id;
        
        console.log('Extracted user ID:', userId);
        
        if (!userId) {
            console.log('No user ID found in session');
            return res.status(401).json({
                success: false,
                error: 'User not authenticated',
                debug: {
                    session: req.session,
                    user: req.session?.user
                }
            });
        }
        
        console.log('Fetching bookings for user ID:', userId);
        
        // Updated query to match your actual database schema
        const query = `
            SELECT 
                b.id,
                b.booking_reference,
                b.booking_date,
                b.number_of_participants,
                b.total_amount,
                b.status,
                b.special_requests,
                b.created_at,
                p.name as package_name,
                p.activity_type,
                p.price,
                p.duration
            FROM bookings b
            LEFT JOIN packages p ON b.package_id = p.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `;
        
        console.log('Executing query:', query);
        console.log('With user ID parameter:', userId);
        
        // Execute the query
        const [rows] = await db.execute(query, [userId]);
        
        console.log('Raw database result:', rows);
        console.log('Number of bookings found:', rows.length);
        
        // Format the data for frontend
        const formattedBookings = rows.map(booking => {
            console.log('Processing booking:', booking);
            return {
                id: booking.id,
                booking_reference: booking.booking_reference,
                booking_date: booking.booking_date,
                number_of_participants: booking.number_of_participants,
                total_amount: booking.total_amount,
                status: booking.status,
                special_requests: booking.special_requests,
                created_at: booking.created_at,
                package_name: booking.package_name, // Now using 'name' from packages table
                activity_type: booking.activity_type,
                price: booking.price,
                duration: booking.duration
            };
        });
        
        console.log('Returning formatted bookings:', formattedBookings);
        res.json(formattedBookings);
        
    } catch (error) {
        console.error('Database error in booking history route:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Database error',
            details: error.message,
            stack: error.stack
        });
    }
});

// Create booking route
router.post('/api/bookings', async (req, res) => {
    console.log('=== Create Booking Route Accessed ===');
    console.log('Request body:', req.body);
    console.log('Session user:', req.session?.user);
    
    try {
        const userId = req.session?.user?.user_id || req.session?.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        
        const {
            package_id,
            booking_date,
            number_of_participants,
            total_amount,
            special_requests,
            contact_number,
            emergency_contact,
            emergency_phone
        } = req.body;
        
        // Validate required fields
        if (!package_id || !booking_date || !number_of_participants || !total_amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        // Generate booking reference (matching your format)
        const bookingReference = 'PG' + Date.now().toString().slice(-8);
        
        // Get tourist_id for this user
        const [touristRows] = await db.execute(
            'SELECT tourist_id FROM tourists WHERE user_id = ? LIMIT 1',
            [userId]
        );
        
        if (touristRows.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Tourist profile not found. Please complete your profile first.'
            });
        }
        
        const touristId = touristRows[0].tourist_id;
        
        // Insert booking into database (matching your schema)
        const insertQuery = `
            INSERT INTO bookings (
                package_id, 
                tourist_id,
                user_id, 
                booking_reference, 
                booking_date, 
                number_of_participants, 
                total_amount, 
                special_requests,
                contact_number,
                emergency_contact,
                emergency_phone,
                status, 
                payment_status,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', NOW())
        `;
        
        const [result] = await db.execute(insertQuery, [
            package_id,
            touristId,
            userId,
            bookingReference,
            booking_date,
            number_of_participants,
            total_amount,
            special_requests || null,
            contact_number || '',
            emergency_contact || '',
            emergency_phone || ''
        ]);
        
        console.log('Booking created with ID:', result.insertId);
        
        res.json({
            success: true,
            booking_id: result.insertId,
            booking_reference: bookingReference,
            message: 'Booking created successfully'
        });
        
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            error: 'Database error',
            details: error.message
        });
    }
});

// Test route
router.get('/api/test', (req, res) => {
    console.log('Test route accessed from bookings router');
    res.json({ message: 'Bookings API is working!', timestamp: new Date() });
});

module.exports = router;