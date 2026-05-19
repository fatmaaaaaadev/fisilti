const jwt = require('jsonwebtoken');

/**
 * Korumalı route'lar için JWT doğrulama middleware'i.
 * Geçerli bir token varsa req.user'ı set eder ve devam eder.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token geçersiz veya süresi dolmuş.' });
  }
}

/**
 * Yalnızca admin rolüne sahip kullanıcılara izin verir.
 * authenticate() middleware'inden sonra kullanılmalıdır.
 */
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Bu işlem için admin yetkisi gereklidir.' });
  }
  next();
}

module.exports = { authenticate, requireAdmin };
