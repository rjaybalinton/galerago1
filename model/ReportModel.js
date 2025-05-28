const db = require("../config/db")

class ReportModel {
  static async getTouristsByType() {
    try {
      const [rows] = await db.query(`
        SELECT 
          COALESCE(registration_type, 'Regular Tourist') as type,
          COUNT(*) as count
        FROM tourists
        GROUP BY registration_type
        ORDER BY count DESC
      `)

      return rows
    } catch (error) {
      console.error("Error in getTouristsByType:", error)
      return []
    }
  }

  static async getTouristsByNationality(limit = 10) {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          COALESCE(nationality, 'Not Specified') as nationality,
          COUNT(*) as count
        FROM tourists
        GROUP BY nationality
        ORDER BY count DESC
        LIMIT ?
      `,
        [limit],
      )

      return rows
    } catch (error) {
      console.error("Error in getTouristsByNationality:", error)
      return []
    }
  }

  static async getTouristsByMonth(limit = 12) {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month_year,
          DATE_FORMAT(created_at, '%b %Y') as month,
          COUNT(*) as count
        FROM tourists
        GROUP BY month_year
        ORDER BY month_year ASC
        LIMIT ?
      `,
        [limit],
      )

      return rows
    } catch (error) {
      console.error("Error in getTouristsByMonth:", error)
      return []
    }
  }

  static async getBookingsByPackage(limit = 10) {
    try {
      // Check if bookings table exists
      const [tables] = await db.query(`
        SHOW TABLES LIKE 'bookings'
      `)

      if (tables.length === 0) {
        console.log("Bookings table does not exist")
        return []
      }

      const [rows] = await db.query(
        `
        SELECT 
          p.name as package_name,
          COUNT(b.id) as booking_count
        FROM bookings b
        JOIN packages p ON b.package_id = p.id
        GROUP BY b.package_id
        ORDER BY booking_count DESC
        LIMIT ?
      `,
        [limit],
      )

      return rows
    } catch (error) {
      console.error("Error in getBookingsByPackage:", error)
      return []
    }
  }

  static async getRevenueByMonth(limit = 12) {
    try {
      // Check if bookings table exists
      const [tables] = await db.query(`
        SHOW TABLES LIKE 'bookings'
      `)

      if (tables.length === 0) {
        console.log("Bookings table does not exist")
        return []
      }

      const [rows] = await db.query(
        `
        SELECT 
          DATE_FORMAT(b.booking_date, '%Y-%m') as month_year,
          DATE_FORMAT(b.booking_date, '%b %Y') as month,
          SUM(p.price * b.participants) as revenue
        FROM bookings b
        JOIN packages p ON b.package_id = p.id
        WHERE b.status = 'confirmed'
        GROUP BY month_year
        ORDER BY month_year ASC
        LIMIT ?
      `,
        [limit],
      )

      return rows
    } catch (error) {
      console.error("Error in getRevenueByMonth:", error)
      return []
    }
  }

  // Get overall dashboard statistics
  static async getDashboardStats() {
    try {
      // Get tourist count
      const [touristCount] = await db.query(`
        SELECT COUNT(*) as count FROM tourists
      `)

      // Get user count
      const [userCount] = await db.query(`
        SELECT COUNT(*) as count FROM users
      `)

      // Get provider count
      const [providerCount] = await db.query(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE user_type IN ('entry_provider', 'activity_provider')
      `)

      // Get package count
      const [packageCount] = await db.query(`
        SELECT COUNT(*) as count FROM packages
      `)

      // Check if bookings table exists
      const [tables] = await db.query(`
        SHOW TABLES LIKE 'bookings'
      `)

      let bookingCount = 0
      let revenue = 0

      if (tables.length > 0) {
        // Get booking count
        const [bookings] = await db.query(`
          SELECT COUNT(*) as count FROM bookings
        `)
        bookingCount = bookings[0].count

        // Get total revenue
        const [revenueResult] = await db.query(`
          SELECT SUM(p.price * b.participants) as total
          FROM bookings b
          JOIN packages p ON b.package_id = p.id
          WHERE b.status = 'confirmed'
        `)
        revenue = revenueResult[0].total || 0
      }

      return {
        tourists: touristCount[0].count,
        users: userCount[0].count,
        providers: providerCount[0].count,
        packages: packageCount[0].count,
        bookings: bookingCount,
        revenue: revenue,
      }
    } catch (error) {
      console.error("Error in getDashboardStats:", error)
      return {
        tourists: 0,
        users: 0,
        providers: 0,
        packages: 0,
        bookings: 0,
        revenue: 0,
      }
    }
  }
}

module.exports = ReportModel
