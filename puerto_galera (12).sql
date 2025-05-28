-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 28, 2025 at 11:52 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `puerto galera`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `package_id` int NOT NULL,
  `tourist_id` int NOT NULL,
  `user_id` int NOT NULL,
  `booking_date` date NOT NULL,
  `number_of_participants` int NOT NULL DEFAULT '1',
  `total_amount` decimal(10,2) NOT NULL,
  `special_requests` text,
  `contact_number` varchar(20) NOT NULL,
  `emergency_contact` varchar(100) DEFAULT NULL,
  `emergency_phone` varchar(20) DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  `payment_status` enum('pending','paid','refunded') DEFAULT 'pending',
  `booking_reference` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_reference` (`booking_reference`),
  KEY `package_id` (`package_id`),
  KEY `tourist_id` (`tourist_id`),
  KEY `user_id` (`user_id`),
  KEY `booking_date` (`booking_date`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `package_id`, `tourist_id`, `user_id`, `booking_date`, `number_of_participants`, `total_amount`, `special_requests`, `contact_number`, `emergency_contact`, `emergency_phone`, `status`, `payment_status`, `booking_reference`, `created_at`, `updated_at`) VALUES
(1, 6, 34, 17, '2025-05-27', 1, 100.00, 'sdsadas', '096445446149865', 'rjay llena', '056164154', 'pending', 'pending', 'PG75869027', '2025-05-25 12:24:29', '2025-05-25 12:24:29'),
(2, 6, 34, 17, '2025-05-27', 1, 100.00, 'sfsdd', '096445446149865', 'rjay llena', '62952956365', 'pending', 'pending', 'PG76057842', '2025-05-25 12:27:37', '2025-05-25 12:27:37');

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

DROP TABLE IF EXISTS `packages`;
CREATE TABLE IF NOT EXISTS `packages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `activity_type` enum('Island Hopping','Snorkeling') DEFAULT 'Island Hopping',
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `duration` int DEFAULT '1',
  `max_participants` int DEFAULT '10',
  `includes` text,
  `image` varchar(255) DEFAULT 'default-package.jpg',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `name`, `activity_type`, `description`, `price`, `duration`, `max_participants`, `includes`, `image`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Island Hopping Adventure', 'Island Hopping', 'Explore the beautiful islands of Puerto Galera with our guided tour.', 1500.00, 1, 15, 'Boat ride, lunch, snorkeling gear', 'default-package.jpg', 18, '2025-05-19 15:42:13', '2025-05-19 15:42:13'),
(2, 'Scuba Diving Experience', 'Snorkeling', 'Discover the underwater wonders of Puerto Galera with certified diving instructors.', 3500.00, 1, 8, 'Equipment rental, instructor fee, boat transfer', 'default-package.jpg', 18, '2025-05-19 15:42:13', '2025-05-25 10:11:36'),
(3, 'White Beach Getaway', 'Island Hopping', 'Relax and unwind at the famous White Beach with this all-inclusive package.', 2000.00, 2, 10, 'Accommodation, breakfast, beach activities', 'default-package.jpg', 18, '2025-05-19 15:42:13', '2025-05-19 15:42:13'),
(4, 'Trekking to Tamaraw Falls', 'Island Hopping', 'Hike through lush forests to reach the majestic Tamaraw Falls.', 1200.00, 1, 12, 'Guide, transportation, packed lunch', 'default-package.jpg', 18, '2025-05-19 15:42:13', '2025-05-19 15:42:13'),
(5, 'Cultural Village Tour', 'Island Hopping', 'Experience the rich culture of the Mangyan people with this immersive tour.', 1800.00, 1, 10, 'Transportation, entrance fees, local guide, souvenir', 'default-package.jpg', 18, '2025-05-19 15:42:13', '2025-05-19 15:42:13'),
(6, 'Island 2', 'Island Hopping', 'sdsdsd', 100.00, 1, 2, 'sdsdsd', 'package-1748170047011-252694931.png', 18, '2025-05-25 10:47:27', '2025-05-25 10:47:27'),
(7, 'snorkling 1', 'Snorkeling', 'sdsafav', 1000.00, 1, 3, 'sdsds', 'package-1748170095724-499312869.png', 18, '2025-05-25 10:48:15', '2025-05-25 10:48:15');

-- --------------------------------------------------------

--
-- Table structure for table `tourists`
--

DROP TABLE IF EXISTS `tourists`;
CREATE TABLE IF NOT EXISTS `tourists` (
  `tourist_id` int NOT NULL AUTO_INCREMENT,
  `registration_type` enum('Regular Tourist','Day Tourist','Resident') NOT NULL DEFAULT 'Regular Tourist',
  `user_id` int NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `age` int NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `nationality` varchar(50) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `is_resident` enum('Yes','No') DEFAULT NULL,
  `residence` varchar(255) DEFAULT NULL,
  `companions_12` int DEFAULT '0',
  `companions_below_12` int DEFAULT '0',
  `arrival_date` date NOT NULL,
  `departure_date` date DEFAULT NULL,
  `picture` varchar(255) DEFAULT 'default.jpg',
  `accommodation` varchar(255) DEFAULT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `special_requests` text,
  `host_first_name` varchar(100) DEFAULT NULL,
  `host_last_name` varchar(100) DEFAULT NULL,
  `host_address` varchar(255) DEFAULT NULL,
  `host_email` varchar(255) DEFAULT NULL,
  `host_phone` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `qrcode` text,
  `verified_at` timestamp NULL DEFAULT NULL,
  `verified_by` int DEFAULT NULL,
  PRIMARY KEY (`tourist_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_registration_type` (`registration_type`),
  KEY `idx_verified_at` (`verified_at`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tourists`
--

INSERT INTO `tourists` (`tourist_id`, `registration_type`, `user_id`, `email`, `phone`, `first_name`, `last_name`, `age`, `gender`, `nationality`, `photo`, `is_resident`, `residence`, `companions_12`, `companions_below_12`, `arrival_date`, `departure_date`, `picture`, `accommodation`, `purpose`, `special_requests`, `host_first_name`, `host_last_name`, `host_address`, `host_email`, `host_phone`, `created_at`, `qrcode`, `verified_at`, `verified_by`) VALUES
(37, 'Day Tourist', 17, 'sdsdsdsd@dw', '09123456789', 'rjay', 'balinton', 23, 'Male', 'Filipino', '/images/placeholder-avatar.png', 'Yes', 'tabinay', 4, 7, '2025-05-22', NULL, '/uploads/tourist-1747757991900-402768372.png', NULL, 'Business', 'ss', NULL, NULL, NULL, NULL, NULL, '2025-05-20 16:19:52', 'data:image/png;base64,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', NULL, NULL),
(48, 'Resident', 17, 'jhayllena1234@gmail.com', '093856466', 'alex', 'madird', 23, 'Male', 'african', '/images/placeholder-avatar.png', NULL, 'white beach', 2, 36, '2025-05-26', '2025-05-29', '/uploads/tourist-1748163736806-166816076.png', NULL, 'Tourism', 'sdsfs', 'eljhun', 'leyesa', 'Tabinay', 'eljhunleyesa1234@gmail.com', '21653566', '2025-05-25 09:02:17', 'data:image/png;base64,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', NULL, NULL),
(49, 'Regular Tourist', 17, 'jhayllena1234@gmail.com', '0699461', 'remain', 'balinton', 23, 'Male', 'filipino', '/images/placeholder-avatar.png', NULL, 'ssddad', 5, 6, '2025-05-29', '2025-05-26', '/uploads/tourist-1748185509409-734981211.jpg', 'Amami Beach Resort', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-25 15:05:09', 'data:image/png;base64,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', NULL, NULL),
(50, 'Regular Tourist', 17, 'jhayllena1234@gmail.com', '0699461', 'janine', 'lubaton', 24, 'Female', 'filipino', '/images/placeholder-avatar.png', NULL, 'ssddad', 0, 0, '2025-05-25', '2025-05-28', '/uploads/tourist-1748185582181-28827760.jpg', 'Amami Beach Resort', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-25 15:06:22', 'data:image/png;base64,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', '2025-05-25 15:38:55', NULL),
(51, 'Regular Tourist', 17, 'eljhun1234@gmail.com', '06416541654', 'eljhun', 'leyesa', 40, 'Male', 'RUSSIAN', NULL, NULL, 'PUERTO RICO', 8, 4, '2025-05-26', '2025-05-28', '/uploads/tourist-1748189873120-360510426.png', 'Amihan Del Sol', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-25 16:17:53', 'data:image/png;base64,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', NULL, NULL),
(52, 'Day Tourist', 17, 'janine@gmail.com', '0396154145', 'janine', 'dalisay', 24, 'Female', 'filipino', NULL, 'No', 'barcenaga', 2, 1, '2025-05-27', NULL, '/uploads/tourist-1748331822972-157913773.jpg', NULL, 'Tourism', 'jasifola,bgxiufajb', NULL, NULL, NULL, NULL, NULL, '2025-05-27 07:43:43', 'data:image/png;base64,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', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tourist_locations`
--

DROP TABLE IF EXISTS `tourist_locations`;
CREATE TABLE IF NOT EXISTS `tourist_locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `address` text,
  `category` varchar(50) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `opening_hours` varchar(255) DEFAULT NULL,
  `contact_info` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `entrance_fee` varchar(100) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tourist_locations`
--

INSERT INTO `tourist_locations` (`id`, `name`, `description`, `latitude`, `longitude`, `address`, `category`, `image`, `opening_hours`, `contact_info`, `website`, `entrance_fee`, `rating`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'White Beach', 'White Beach is the main tourism beach of Puerto Galera. It is a long stretch of white sand with crystal clear waters, perfect for swimming and sunbathing.', 13.50030000, 120.96750000, 'White Beach, Puerto Galera, Oriental Mindoro, Philippines', 'beach', 'location-1747755536954-176949764.jpeg', 'Open 24 hours', '+63 123 456 7890', 'https://www.puertogalera.org', 'Free', 4.70, 1, '2025-05-19 17:38:12', '2025-05-20 15:38:56'),
(2, 'Tamaraw Falls', 'Tamaraw Falls is a beautiful waterfall located along the highway between Puerto Galera and Calapan City. It is a popular stop for tourists traveling to and from Puerto Galera.', 13.44560000, 121.03670000, 'Puerto Galera - Calapan Rd, Puerto Galera, Oriental Mindoro, Philippines', 'waterfall', 'tamaraw-falls.jpg', '7:00 AM - 6:00 PM', '+63 123 456 7891', 'https://www.puertogalera.org/tamaraw-falls', 'PHP 50', 4.50, 1, '2025-05-19 17:38:12', '2025-05-19 17:38:12'),
(3, 'Muelle Bay', 'Muelle Bay is a historic port area in Puerto Galera with a beautiful view of the bay. It is the original port of Puerto Galera and has a rich history.', 13.51220000, 120.95530000, 'Muelle Bay, Puerto Galera, Oriental Mindoro, Philippines', 'historical', 'muelle-bay.jpg', 'Open 24 hours', '+63 123 456 7892', 'https://www.puertogalera.org/muelle-bay', 'Free', 4.30, 1, '2025-05-19 17:38:12', '2025-05-19 17:38:12'),
(4, '7/11', 'CONVIENT STORE', 13.50135334, 120.95420590, 'POBLACION, PUERTO GALERA, ORIENTAL MINDORO', 'viewpoint', 'location-1747751705776-565047008.png', '24 Houurs', '09385771857', 'https://www.google.com.ph/', 'none', 4.50, 18, '2025-05-20 14:15:05', '2025-05-20 14:35:05'),
(5, 'PGH', 'Public Hospital for Puerto Galera Residence', 13.50375921, 120.94148323, 'Poblacion, Puerto Galera', 'hospital', 'location-1747752618647-576923031.jpg', '24 Houurs', '09385771857', 'https://www.youtube.com/', 'n/a', 4.50, 18, '2025-05-20 14:50:18', '2025-05-20 14:50:18'),
(6, 'RJAY', 'bahay namin', 13.50271816, 120.95572126, 'tabinay', 'other', 'location-1747828738013-872293114.jpg', '24 hours', '0915415454', 'https://www.google.com/', 'n/a', 2.60, 18, '2025-05-21 11:58:58', '2025-05-21 11:58:58');

-- --------------------------------------------------------

--
-- Table structure for table `tourist_location_images`
--

DROP TABLE IF EXISTS `tourist_location_images`;
CREATE TABLE IF NOT EXISTS `tourist_location_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location_id` int NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `location_id` (`location_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `nationality` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `profile_picture` varchar(255) DEFAULT 'default.jpg',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reset_code` varchar(6) DEFAULT NULL,
  `reset_expiry` datetime DEFAULT NULL,
  `user_type` enum('tourist','admin','entry_provider','activity_provider') NOT NULL DEFAULT 'tourist',
  `is_suspended` tinyint(1) DEFAULT '0',
  `suspension_reason` text,
  `suspended_at` timestamp NULL DEFAULT NULL,
  `suspended_by` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_is_suspended` (`is_suspended`),
  KEY `fk_suspended_by` (`suspended_by`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `first_name`, `last_name`, `contact_number`, `email`, `password`, `date_of_birth`, `gender`, `nationality`, `address`, `profile_picture`, `created_at`, `reset_code`, `reset_expiry`, `user_type`, `is_suspended`, `suspension_reason`, `suspended_at`, `suspended_by`) VALUES
(2, 'jhay', 'jhay', 'llena', '0641635', 'jhay123@gmail.com', '$2b$10$aKKoca0FMocdzoS0X1EkmuocvWHg73q8clN7GF4mQ5w', '2001-06-06', 'Male', 'Filipino', 'sdsds', 'Picture2.jpg', '2025-02-23 16:09:03', NULL, NULL, 'tourist', 0, NULL, NULL, NULL),
(7, 'janine', 'janine', 'dalisay', '15465', 'janine@gmail.com', '$2b$10$KkQLUeWIBYSQcrCdqH5Zq.PnBnB7zAIGvBVtiF7Bht2apHkfqt3dq', '6666-06-06', 'Female', 'sdfs', 'sfsd', 'Screenshot 2024-12-11 121454.png', '2025-02-25 20:48:19', NULL, NULL, 'tourist', 0, NULL, NULL, NULL),
(8, 'jhayllena', 'jhay', 'llena', '15465', 'rjaybalinton833@gmail.com', '$2b$10$PMnATsAZFEIJU62XniCv1.5oSZ4DfI/K9uDIm7B7K0kPqcr.3ys8S', '6666-06-06', 'Male', 'sdfs', 'sfsd', 'Screenshot 2024-12-11 121454.png', '2025-02-25 20:49:23', NULL, NULL, 'entry_provider', 0, NULL, NULL, NULL),
(13, 'testuser', 'Test', 'User', '09123456789', 'testuser@example.com', '$2b$10$GpQUyfaJ.4nC9USLRRJNa.X3j8fEM7gFa9M0OJ2i1uM1FwE3tdQJ2', '2000-01-01', 'Male', 'Filipino', 'Puerto Galera', 'default.jpg', '2025-05-17 14:25:48', NULL, NULL, 'tourist', 0, NULL, NULL, NULL),
(15, 'test_1747540858560', 'Test', 'User', '1234567890', 'test_1747540858560@example.com', 'password123', '2000-01-01', 'Other', 'Test', 'Test Address', 'default.jpg', '2025-05-18 04:00:58', NULL, NULL, 'tourist', 0, NULL, NULL, NULL),
(17, 'RedmiNote', 'redmi', 'note', '09385771857', 'redminote26@gmail.com', '$2b$10$Khz619TpmGj4SgMBcfxtauriTEnIJOuCTELHdkRyJeshzu1IWN2zq', '2001-12-01', 'Male', 'Filipino', 'tabinay', '1747543826371.png', '2025-05-18 04:50:26', NULL, NULL, 'tourist', 0, NULL, NULL, NULL),
(18, 'admin', 'Admin', 'User', '1234567890', 'admin@example.com', '$2b$10$rfB0eESvoOgY7ds.XMCHTew/A0q676WQn8qwTuA3Ei5jxXYJtC0gq', '2000-01-01', 'Other', 'N/A', 'N/A', 'default.jpg', '2025-05-18 05:50:34', NULL, NULL, 'admin', 0, NULL, NULL, NULL),
(20, 'service1', 'service1', 'entry', '0641646', 'service1@gmail.com', '$2b$10$MI9rJpEAkzZxMvvFwGFRh.OoXNnflhVcf0J/wiNWHME0pzXvgH.0K', '2025-05-27', 'Male', 'filipino', 'Tabinay\nMasipit', 'default.jpg', '2025-05-25 14:41:10', NULL, NULL, 'entry_provider', 0, NULL, NULL, NULL),
(21, 'service2', 'service2', 'activity', '09385771857', 'service2@gmail.com', '$2b$10$5AryrAn7tLNsuTrsn6110eQBX6aJO65991M9mZ67391F0xYv.MbAC', '2000-05-30', 'Male', 'filipino', 'Tabinay\nMasipit', 'default.jpg', '2025-05-25 14:42:17', NULL, NULL, 'activity_provider', 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `verification_tokens`
--

DROP TABLE IF EXISTS `verification_tokens`;
CREATE TABLE IF NOT EXISTS `verification_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `type` enum('email','password') NOT NULL DEFAULT 'email',
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tourists`
--
ALTER TABLE `tourists`
  ADD CONSTRAINT `fk_tourist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_suspended_by` FOREIGN KEY (`suspended_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
