-- Smart Crop Recommendation System - MySQL schema
DROP DATABASE IF EXISTS smart_crop_db;
CREATE DATABASE IF NOT EXISTS smart_crop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_crop_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  location VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crop_information (
  id INT AUTO_INCREMENT PRIMARY KEY,
  crop_name VARCHAR(60) NOT NULL UNIQUE,
  description TEXT,
  soil_type VARCHAR(150),
  min_ph DECIMAL(4,2),
  max_ph DECIMAL(4,2),
  min_temperature DECIMAL(5,2),
  max_temperature DECIMAL(5,2),
  rainfall VARCHAR(40),
  min_rainfall DECIMAL(7,2),
  max_rainfall DECIMAL(7,2),
  growing_period VARCHAR(150),
  cultivation_info TEXT,
  fertilizer_info TEXT,
  irrigation_info TEXT
);

CREATE TABLE IF NOT EXISTS recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  nitrogen DECIMAL(7,2) NOT NULL,
  phosphorus DECIMAL(7,2) NOT NULL,
  potassium DECIMAL(7,2) NOT NULL,
  ph DECIMAL(4,2) NOT NULL,
  temperature DECIMAL(5,2) NOT NULL,
  humidity DECIMAL(5,2) NOT NULL,
  rainfall DECIMAL(7,2) NOT NULL,
  soil_type VARCHAR(40) NOT NULL,
  location VARCHAR(200) NOT NULL,
  recommended_crop VARCHAR(60) NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  is_saved TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reco_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
