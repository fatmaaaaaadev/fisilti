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

INSERT INTO users (username, email, password_hash, country, is_verified, role) VALUES
('dilara_dev', 'dilara@fisilti.com', '$2b$10$K7X8...', 'Türkiye', TRUE, 'admin'),
('fatma_lead', 'fatma@fisilti.com', '$2b$10$K7X8...', 'Türkiye', TRUE, 'admin'),
('john_mod', 'john.mod@fisilti.com', '$2b$10$K7X8...', 'Amerika Birleşik Devletleri', TRUE, 'admin'),
('elena_admin', 'elena@fisilti.com', '$2b$10$K7X8...', 'İngiltere', TRUE, 'admin'),
('can_kodluyor', 'can@fisilti.com', '$2b$10$K7X8...', 'Türkiye', TRUE, 'user'),
('zeynep_mimar', 'zeynep@fisilti.com', '$2b$10$K7X8...', 'Türkiye', TRUE, 'user'),
('berk_filozof', 'berk@test.com', '$2b$10$K7X8...', 'Almanya', TRUE, 'user'),
('melis_geziyor', 'melis@test.com', '$2b$10$K7X8...', 'Fransa', TRUE, 'user'),
('hakan_tech', 'hakan@fisilti.com', '$2b$10$K7X8...', 'Almanya', TRUE, 'user'),
('ece_tasarim', 'ece@fisilti.com', '$2b$10$K7X8...', 'Türkiye', TRUE, 'user'),
('umut_retro', 'umut@test.com', '$2b$10$K7X8...', 'Türkiye', FALSE, 'user'),
('deniz_mavi', 'deniz@test.com', '$2b$10$K7X8...', 'Rusya', TRUE, 'user'),
('gamze_sarki', 'gamze@fisilti.com', '$2b$10$K7X8...', 'Türkiye', TRUE, 'user'),
('serkan_fit', 'serkan@test.com', '$2b$10$K7X8...', 'Hollanda', TRUE, 'user'),
('burak_gaming', 'burak@fisilti.com', '$2b$10$K7X8...', 'İspanya', TRUE, 'user'),
('irem_kahve', 'irem@test.com', '$2b$10$K7X8...', 'İtalya', TRUE, 'user');

INSERT INTO posts (user_id, content, status, is_reported) VALUES
(5, 'Bu sabah kahvemi içerken yine harika bir fısıltı fikri buldum! ☕', 'active', FALSE),
(6, 'React ile Tailwind CSS kullanmak tam bir görsel şölen değil mi ya?', 'active', FALSE),
(7, 'Hayat bazen sadece durup gökyüzüne bakmaktan ibarettir... ✨', 'active', FALSE),
(8, 'Yeni fısıltı uygulamamızın arayüzü gerçekten çok akıcı olmuş, ellerinize sağlık!', 'active', FALSE),
(9, 'Berlin de hava bugün buz gibi, keşke Türkiye de olsaydım 🥶', 'active', FALSE),
(10, 'Figma da yeni güncelleme gelmiş, komponent yapıları tamamen değişiyor.', 'active', FALSE),
(11, 'Plaklarımı temizlerken nostaljik bir yolculuğa çıktım, yaşasın 80ler!', 'active', FALSE),
(12, 'Selanik sahilinde yürüyüş yapmak her zaman ruhuma çok iyi geliyor.', 'active', FALSE),
(13, 'Bugün playlistime harika şarkılar ekledim, fısıltıda paylaşacağım.', 'active', FALSE),
(14, 'Sabah kardiyosu bitti, şimdi sağlıklı bir kahvaltı zamanı 🏃‍♂️', 'active', FALSE),
(15, 'Yeni çıkan o oyunu sabaha kadar oynayan tek ben miyim acaba? 🎮', 'active', FALSE),
(16, 'Roma sokaklarında kaybolmak dünyanın en güzel hissi olabilir 🍕', 'active', FALSE),
(5, 'Yarın büyük gün! Sunum için herkes hazır mı ekibim? 🚀', 'active', FALSE),
(7, 'Kamp ateşinin başında fısıldaşmak... En büyük huzur.', 'active', FALSE),
(8, 'Bu fısıltı projesi dönem sonu jürisinde kesinlikle bir numara olacak!', 'active', FALSE),
(9, 'JavaScript in o garip hataları beni bazen hayattan soğutuyor haha.', 'active', FALSE),
(10, 'Karanlık mod (dark mode) tasarımı bitti, sunumda harika görünecek 🌙', 'active', FALSE),
(1, 'Admin paneli testleri başarıyla başladı, backend bağlantısı bekleniyor.', 'active', FALSE),
(2, 'Tüm tablolar buluta taşındı, sistem şu an tamamen canlıda çalışıyor.', 'active', FALSE),
(3, 'Bugün gelen fısıltı sayıları stabil, sunucu performansı harika.', 'active', FALSE),
(4, 'Sistem logları temizlendi, sunuma tamamen hazırız arkadaşlar.', 'active', FALSE),
(11, 'Yeni bir kitap keşfettim, bitirince fısıltısını buraya bırakırım.', 'active', FALSE);
INSERT INTO posts (user_id, content, status, is_reported) VALUES
(15, 'Bu platformu hackleyeceğim, herkesin verilerini sileceğim! 😡', 'active', TRUE),
(12, 'Çok kalitesiz ve kötü bir içerik, sadece insanları rahatsız etmek için yazıyorum.', 'active', TRUE),
(7, 'Buraya çok çirkin bir reklam linki bırakıyorum, hemen tıklayın kazanmaya başlayın!', 'active', TRUE),
(11, 'Saldırgan ve nefret söylemi içeren saçma sapan bir fısıltı örneği test için.', 'active', TRUE),
(14, 'Spam! Spam! Spam! Bu postun admin panelinde hemen en üstte görünmesi lazım!', 'active', TRUE);