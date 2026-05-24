/**
 * Express global hata yakalama middleware'i.
 * Tüm next(err) çağrılarını buraya düşer.
 */
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Beklenmeyen bir sunucu hatası oluştu.';

  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${status} — ${message}`);
    console.error(err.stack);
  }

  return res.status(status).json({ message });
}

module.exports = errorHandler;
