const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// POST   /auth/register  — Yeni kullanıcı kaydı
router.post('/register', authController.register);

// POST   /auth/verify    — E-posta doğrulama
router.post('/verify', authController.verifyEmail);

// POST   /auth/resend-verify-code — Yeni doğrulama kodu talep etme (Eklenen Rota 🚀)
router.post('/resend-verify-code', authController.resendVerifyCode);

// POST   /auth/login     — Giriş ve JWT alma
router.post('/login', authController.login);

// DELETE /auth/account   — Hesabı sil (JWT zorunlu, şifre onayı gerekir)
router.delete('/account', authenticate, authController.deleteAccount);

module.exports = router;
