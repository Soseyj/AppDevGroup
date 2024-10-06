-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 05, 2024 at 08:13 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `province` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `addressline` varchar(255) NOT NULL,
  `postal` varchar(255) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`id`, `user_id`, `province`, `city`, `barangay`, `addressline`, `postal`, `is_default`, `created_at`) VALUES
(29, 10, 'Oriental', 'Calapan Citya', 'San Antonioad', 'Green Hills', '5200', 1, '2024-10-04 23:57:10'),
(30, 10, 'mindoro12', 'calapandas', 'pachoca', 'don', '1333333', 0, '2024-10-04 23:57:35');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`) VALUES
(1, 11, '2024-10-04 17:20:48'),
(2, 10, '2024-10-04 18:17:01'),
(3, 5, '2024-10-04 18:19:26'),
(4, 9, '2024-10-04 22:13:19');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `quantity`) VALUES
(5, 3, 1, 1),
(8, 3, 3, 5),
(13, 4, 2, 1),
(28, 2, 1, 1),
(35, 2, 5, 1),
(37, 2, 6, 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `image_url` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `stock`, `image_url`, `created_at`) VALUES
(1, 'Lucia Armchair11', 50.00, 0, '/assets/images/1728103674504.jpg', '2024-09-28 21:23:07'),
(2, 'Nordic Chair', 50.00, 12, '/public/assets/images/product-1.png', '2024-09-28 21:23:07'),
(3, 'Kruzo Aero Chair', 78.00, 41, '/public/assets/images/product-2.png', '2024-09-28 21:24:24'),
(4, 'upuan', 16.00, 20, '/public/assets/images/1728098271774.jpg', '2024-10-05 11:17:51'),
(5, 'upuan1', 16.00, 20, '/public/assets/images/1728098453942.png', '2024-10-05 11:20:53'),
(6, 'upuan2', 16.00, 20, '/assets/images/1728104527332.jpg', '2024-10-05 11:24:40');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fName` varchar(255) NOT NULL,
  `lName` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin','','') NOT NULL DEFAULT 'customer',
  `Created_AT` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fName`, `lName`, `phone`, `email`, `password`, `role`, `Created_AT`) VALUES
(5, 'Rey ', 'Rivera', '090535702', 'normanrivera005@gmail.com', '$2b$10$ssRZZ75I94TbahxrwZ48xuQ5y9vM7LdBXrJtWUCUbLZEknbQbj5rC', 'customer', '2024-09-28 17:29:55'),
(6, 'Benedict', 'Rudabia', '09123456789', 'benedictrudabia@gmail.com', '$2b$10$3jr40GxDPLsFyo8Mnw5TtuzT0pcQ2yFh.sf/m42Ib0KM0kx14TehO', 'customer', '2024-09-28 17:29:55'),
(7, 'Carl', 'Ulip', '09987654321', 'carlulip@gmail.com', '$2b$10$.Kk.YXdONlSMqG21iqeZY.yKeSIR2cHgnf1ES5b19hMW2E0LrJ3sm', 'admin', '2024-09-28 17:30:37'),
(8, 'Janine', 'Dalisay', '09678954321', 'janinedalisay@gmail.com', '$2b$10$XNUg8KmeyZAp1NdCSzh6GOEbnq5OnCzicnTt70e5ue9O7m3MKEaVG', 'customer', '2024-09-28 17:30:37'),
(9, 'Mico', 'Manhic', '09876223435', 'micomanhic@gmail.com', '$2b$10$QlKHmNJI82T7RZjIP3OXrOfz2N.9Cv5LYWbIKk1lusIFzNbbzKvBK', 'customer', '2024-10-02 01:09:59'),
(10, 'Haze ', 'Layag', '09876543211', 'hazelayag@gmail.com', '$2b$10$2KP05erRc1/OwUJcIQJDAOeet0ZtQ9Je2zvlpGxDmHUQ7O8QQifdO', 'customer', '2024-10-02 12:39:49'),
(11, 'Kiel', 'Rivera', '09053570298', 'kielrivera@gmail.com', '$2b$10$L8iZ.2Zc2jRZH1YoKDu5aOm8lwdi6Y8R/Moi7vnfPkFKzArUNBV5u', 'customer', '2024-10-05 01:20:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cart` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `fk_cart_items` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `fk_address` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `fk_cart` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `fk_cart_item` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cart_items` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
