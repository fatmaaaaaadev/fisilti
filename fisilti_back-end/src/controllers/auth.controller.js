const authService = require('../services/auth.service');

// POST /auth/register
async function register(req, res, next) {
  try {
    const { email, username, password, country } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: 'E-posta, kullanıcı adı ve şifre zorunludur.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Geçerli bir e-posta adresi giriniz.' });
    }

    const result = await authService.register({ email, username, password, country });
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// POST /auth/verify
async function verifyEmail(req, res, next) {
  try {
    const { userId, code } = req.body;
    if (!userId || !code) {
      return res.status(400).json({ message: 'userId ve code zorunludur.' });
    }

    const result = await authService.verifyEmail({ userId: Number(userId), code });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// POST /auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'E-posta ve şifre zorunludur.' });
    }

    const result = await authService.login({ email, password });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// DELETE /auth/account  — Hesabı sil (JWT zorunlu, şifre onayı gerekir)
async function deleteAccount(req, res, next) {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Hesabı silmek için şifrenizi girmeniz zorunludur.' });
    }

    const result = await authService.deleteAccount(req.user.id, password);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, verifyEmail, login, deleteAccount };
