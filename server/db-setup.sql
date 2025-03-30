-- MySQL Database Setup for Crichattric
-- This script creates the database schema for the Crichattric application

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS crichattric_prod;
USE crichattric_prod;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  short_name VARCHAR(10) NOT NULL,
  logo_url VARCHAR(255),
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(50),
  date_of_birth DATE,
  batting_style VARCHAR(50),
  bowling_style VARCHAR(50),
  role VARCHAR(50),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create team_players table (for player transfers between teams)
CREATE TABLE IF NOT EXISTS team_players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  player_id INT NOT NULL,
  season VARCHAR(20) NOT NULL,
  is_captain BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (player_id) REFERENCES players(id),
  UNIQUE KEY team_player_season (team_id, player_id, season)
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_key VARCHAR(50) NOT NULL UNIQUE,
  team1_id INT NOT NULL,
  team2_id INT NOT NULL,
  venue VARCHAR(100),
  match_date DATETIME NOT NULL,
  season VARCHAR(20),
  match_type VARCHAR(50) DEFAULT 'T20',
  status ENUM('scheduled', 'live', 'completed', 'abandoned') DEFAULT 'scheduled',
  winner_id INT,
  man_of_match_id INT,
  toss_winner_id INT,
  toss_decision VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (team1_id) REFERENCES teams(id),
  FOREIGN KEY (team2_id) REFERENCES teams(id),
  FOREIGN KEY (winner_id) REFERENCES teams(id),
  FOREIGN KEY (man_of_match_id) REFERENCES players(id)
);

-- Create innings table
CREATE TABLE IF NOT EXISTS innings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_id INT NOT NULL,
  batting_team_id INT NOT NULL,
  bowling_team_id INT NOT NULL,
  innings_number INT NOT NULL,
  runs INT DEFAULT 0,
  wickets INT DEFAULT 0,
  overs DECIMAL(5,1) DEFAULT 0.0,
  extras INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id),
  FOREIGN KEY (batting_team_id) REFERENCES teams(id),
  FOREIGN KEY (bowling_team_id) REFERENCES teams(id),
  UNIQUE KEY match_innings (match_id, innings_number)
);

-- Create player_performances table
CREATE TABLE IF NOT EXISTS player_performances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_id INT NOT NULL,
  player_id INT NOT NULL,
  team_id INT NOT NULL,
  runs_scored INT DEFAULT 0,
  balls_faced INT DEFAULT 0,
  fours INT DEFAULT 0,
  sixes INT DEFAULT 0,
  overs_bowled DECIMAL(5,1) DEFAULT 0.0,
  runs_conceded INT DEFAULT 0,
  wickets INT DEFAULT 0,
  maidens INT DEFAULT 0,
  catches INT DEFAULT 0,
  stumpings INT DEFAULT 0,
  run_outs INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id),
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  UNIQUE KEY match_player (match_id, player_id)
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  team_id INT,
  player_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (player_id) REFERENCES players(id),
  UNIQUE KEY user_team (user_id, team_id),
  UNIQUE KEY user_player (user_id, player_id)
);

-- Create api_cache table for storing API responses
CREATE TABLE IF NOT EXISTS api_cache (
  id INT AUTO_INCREMENT PRIMARY KEY,
  endpoint VARCHAR(255) NOT NULL,
  parameters TEXT,
  response LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  INDEX (endpoint, expires_at)
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  theme VARCHAR(20) DEFAULT 'light',
  notification_enabled BOOLEAN DEFAULT TRUE,
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create sample data for teams
INSERT IGNORE INTO teams (name, short_name, logo_url, primary_color, secondary_color) VALUES
('Mumbai Indians', 'MI', '/images/teams/mi.png', '#004BA0', '#D1AB3E'),
('Chennai Super Kings', 'CSK', '/images/teams/csk.png', '#FFFF00', '#0081E9'),
('Royal Challengers Bangalore', 'RCB', '/images/teams/rcb.png', '#EC1C24', '#000000'),
('Kolkata Knight Riders', 'KKR', '/images/teams/kkr.png', '#3A225D', '#D4AF37'),
('Delhi Capitals', 'DC', '/images/teams/dc.png', '#00008B', '#EF1B23'),
('Punjab Kings', 'PBKS', '/images/teams/pbks.png', '#ED1B24', '#A7A9AC'),
('Rajasthan Royals', 'RR', '/images/teams/rr.png', '#254AA5', '#FF69B4'),
('Sunrisers Hyderabad', 'SRH', '/images/teams/srh.png', '#FF822A', '#000000'),
('Gujarat Titans', 'GT', '/images/teams/gt.png', '#1C1C1C', '#0085CA'),
('Lucknow Super Giants', 'LSG', '/images/teams/lsg.png', '#A72056', '#FFCC00');

-- Create admin user
INSERT IGNORE INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@crichattric.com', '$2b$10$XFE0UQYWHRBg6jKtXRWOZeUBGO1yO5iyz0YdKZ.M7T0i.J5jIaVga', 'Crichattric Admin', 'admin');
-- Note: password_hash is for 'admin123' - change in production!
