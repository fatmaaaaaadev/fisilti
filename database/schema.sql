CREATE DATABASE IF NOT EXISTS fisilti_db;
USE fisilti_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    country VARCHAR(50) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    status ENUM('active', 'passive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    inactivated_at TIMESTAMP NULL DEFAULT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE follows (
    follower_id INT NOT NULL,
    followed_id INT NOT NULL,

    PRIMARY KEY (follower_id, followed_id),

    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,

    FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE saved_posts (
    user_id INT NOT NULL,
    post_id INT NOT NULL,

    PRIMARY KEY (user_id, post_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);


CREATE TABLE reports (
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    reason TEXT NOT NULL,

    PRIMARY KEY (user_id, post_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS eposta_dogrulama (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    verification_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,          
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
   
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE INDEX idx_users_email ON users(email);


CREATE INDEX idx_verification_code ON eposta_dogrulama(verification_code);


CREATE INDEX idx_posts_created ON posts(created_at);



INSERT INTO users (username, email, password_hash, country, is_verified, role) VALUES
('dilara_dev', 'dilara@fisilti.com', '$2b$10$K7X8...', 'Turkey', TRUE, 'admin'),
('ahmet_kodlar', 'ahmet@fisilti.com', '$2b$10$P3Y2...', 'Turkey', FALSE, 'user'),
('john_doe', 'john@test.com', '$2b$10$M9W1...', 'Germany', TRUE, 'user');

INSERT INTO posts (user_id, content, status) VALUES
(1, 'Fısıltı projesinin veritabanı altyapısı an itibariyle tamamen bitti! 🚀', 'active'),
(2, 'E-posta doğrulama sayfasını test ediyorum kod geldi mi?', 'active');


INSERT INTO eposta_dogrulama (user_id, verification_code, expires_at) VALUES
(2, '583920', '2026-12-31 23:59:59');


INSERT INTO follows (follower_id, followed_id) VALUES
(1, 2);