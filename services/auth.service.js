const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const authRepo = require('../repositories/auth.repository');
const { sendVerificationEmail } = require('../utils/email');

const SALT_ROUNDS = 12;
const CODE_EXPIRY_MINUTES = 15;

function generateVerificationCode() {
  return crypto.randomInt(100000, 999999).toString();
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ─── Kayıt ───────────────────────────────────────────────────────────────────
async function register({ email, username, password, country }) {
  const emailExists = await authRepo.findByEmail(email);
  if (emailExists) {
    const err = new Error('Bu e-posta adresi zaten kullanımda.');
    err.status = 409;
    throw err;
  }

  const usernameExists = await authRepo.findByUsername(username);
  if (usernameExists) {
    const err = new Error('Bu kullanıcı adı zaten alınmış.');
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await authRepo.createUser({ email, username, passwordHash, country });

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);
  await authRepo.createVerificationCode(user.id, code, expiresAt);
  await sendVerificationEmail(email, code);

  return {
    message: 'Kayıt başarılı. Lütfen e-posta adresinizi doğrulayın.',
    userId: user.id,
  };
}

// ─── E-posta Doğrulama ────────────────────────────────────────────────────────
async function verifyEmail({ userId, code }) {
  const record = await authRepo.findValidVerificationCode(userId, code);
  if (!record) {
    const err = new Error('Doğrulama kodu hatalı veya süresi dolmuş.');
    err.status = 400;
    throw err;
  }

  await authRepo.markCodeAsUsed(record.id);
  await authRepo.markUserAsVerified(userId);
  return { message: 'E-posta başarıyla doğrulandı. Giriş yapabilirsiniz.' };
}

// ─── Giriş ───────────────────────────────────────────────────────────────────
async function login({ email, password }) {
  const user = await authRepo.findByEmail(email);
  if (!user) {
    const err = new Error('E-posta veya şifre hatalı.');
    err.status = 401;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error('Hesabınız askıya alınmıştır. Lütfen destek ile iletişime geçin.');
    err.status = 403;
    throw err;
  }

  if (!user.isVerified) {
    const err = new Error('Lütfen önce e-posta adresinizi doğrulayın.');
    err.status = 403;
    throw err;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    const err = new Error('E-posta veya şifre hatalı.');
    err.status = 401;
    throw err;
  }

  const token = generateToken(user);
  return {
    token,
    user: { id: user.id, email: user.email, username: user.username, role: user.role },
  };
}

// ─── Hesabı Sil (GZ4) ────────────────────────────────────────────────────────
async function deleteAccount(userId, password) {
  const user = await authRepo.findById(userId);
  if (!user) {
    const err = new Error('Kullanıcı bulunamadı.');
    err.status = 404;
    throw err;
  }

  // Şifre onayı — yanlışlıkla silinmeyi önler
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    const err = new Error('Şifre hatalı. Hesap silme işlemi iptal edildi.');
    err.status = 401;
    throw err;
  }

  await authRepo.deactivateUser(userId);
  return { message: 'Hesabınız başarıyla silindi.' };
}

module.exports = { register, verifyEmail, login, deleteAccount };
