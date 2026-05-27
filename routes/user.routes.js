const express = require('express');
const router = express.Router();
const followController = require('../controllers/follow.controller');
const savedController = require('../controllers/saved.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

// GET    /users/suggestions          — Takip edilebilecek kişiler önerisi
router.get('/suggestions', followController.getSuggestions);

// GET    /users/me/saved             — Giriş yapan kullanıcının kaydettikleri
router.get('/me/saved', savedController.getSavedPosts);

// POST   /users/:id/follow           — Kullanıcıyı takip et
router.post('/:id/follow', followController.followUser);

// DELETE /users/:id/follow         — Takibi bırak
router.delete('/:id/follow', followController.unfollowUser);

// GET    /users/:id/following      — Kullanıcının takip ettikleri
router.get('/:id/following', followController.getFollowing);

// GET    /users/:id/followers      — Kullanıcının takipçileri
router.get('/:id/followers', followController.getFollowers);

// GET    /users/:id/counts          — Takipçi ve takip edilen sayısı
router.get('/:id/counts', followController.getFollowCounts);

// GET    /users/me/saved           — Giriş yapan kullanıcının kaydettikleri
router.get('/me/saved', savedController.getSavedPosts);

module.exports = router;
