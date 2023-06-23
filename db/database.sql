create database if not exists lab3;
use lab3;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  year DATE NOT NULL,
  gender VARCHAR(255) NOT NULL
);
DESCRIBE users;