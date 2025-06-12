-- Create database
CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') NOT NULL,
  college VARCHAR(255) NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  profile_picture VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_college (college),
  INDEX idx_is_approved (is_approved)
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  location VARCHAR(255) NOT NULL,
  job_type ENUM('full-time', 'part-time', 'internship', 'contract') DEFAULT 'full-time',
  salary_range VARCHAR(100),
  deadline DATE NOT NULL,
  status ENUM('active', 'closed', 'draft') DEFAULT 'active',
  posted_by INT NOT NULL,
  college VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_college (college),
  INDEX idx_job_type (job_type),
  INDEX idx_deadline (deadline),
  INDEX idx_posted_by (posted_by),
  FULLTEXT idx_search (title, description)
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  cover_letter TEXT,
  resume_url VARCHAR(255),
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_application (job_id, user_id),
  INDEX idx_status (status),
  INDEX idx_job_id (job_id),
  INDEX idx_user_id (user_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);

-- Insert sample data
INSERT INTO users (name, email, password, role, college, is_approved) VALUES
('Admin User', 'admin@techuniversity.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'admin', 'Tech University', TRUE),
('John Student', 'john@student.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'student', 'Tech University', TRUE),
('Jane Doe', 'jane@student.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'student', 'Tech University', FALSE);

-- Insert sample jobs
INSERT INTO jobs (title, description, requirements, location, job_type, salary_range, deadline, posted_by, college) VALUES
('Software Engineer Intern', 'Join our engineering team to work on cutting-edge web applications using React and Node.js.', 'React, JavaScript, Node.js, Git', 'San Francisco, CA', 'internship', '$8,000/month', '2024-03-15', 1, 'Tech University'),
('Data Science Analyst', 'Analyze large datasets and build machine learning models to drive business insights.', 'Python, Machine Learning, SQL, Statistics', 'Remote', 'full-time', '$95,000/year', '2024-03-20', 1, 'Tech University'),
('UX Designer', 'Create user-centered designs for mobile and web applications.', 'Figma, User Research, Prototyping, Design Systems', 'New York, NY', 'part-time', '$45/hour', '2024-03-25', 1, 'Tech University');
