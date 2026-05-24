const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const statsController = require('../controllers/stats.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');

router.use(authenticate, requireAdmin);

// ─── Kullanıcı Yönetimi ───────────────────────────────────────────────────────
router.get('/users',              adminController.getAllUsers);
router.patch('/users/:id/ban',    adminController.banUser);
router.patch('/users/:id/unban',  adminController.unbanUser);

// ─── Rapor Yönetimi ───────────────────────────────────────────────────────────
router.get('/reports',                 adminController.getAllReports);
router.get('/reports/post/:postId',    adminController.getReportsByPost);

// ─── Gönderi Yönetimi ─────────────────────────────────────────────────────────
router.patch('/posts/:id/hide',        adminController.hidePost);

// ─── İstatistikler ────────────────────────────────────────────────────────────
router.get('/stats',                   statsController.getPlatformStats);

// ─── Admin İşlem Logları ──────────────────────────────────────────────────────
router.get('/logs',                    adminController.getAdminLogs);

module.exports = router;
