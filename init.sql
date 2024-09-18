-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS nodedb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Use the created database
USE nodedb;

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS people (
  id INT AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
  