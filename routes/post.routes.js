const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const reportController = require('../controllers/report.controller');
const savedController = require('../controllers/saved.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

// POST   /posts                    — Yeni gönderi oluştur
router.post('/', postController.createPost);

// DELETE /posts/:id                — Gönderiyi sil (sadece sahibi)
router.delete('/:id', postController.deletePost);

// GET    /posts/feed               — Takip edilenlerin gönderileri
router.get('/feed', postController.getFeed);

// GET    /posts/user/:userId       — Belirli kullanıcının gönderileri
router.get('/user/:userId', postController.getUserPosts);

// POST   /posts/:id/report         — Gönderiyi raporla
router.post('/:id/report', reportController.reportPost);

// POST   /posts/:id/save           — Gönderiyi kaydet
router.post('/:id/save', savedController.savePost);

// DELETE /posts/:id/save           — Kaydı kaldır
router.delete('/:id/save', savedController.unsavePost);

module.exports = router;
