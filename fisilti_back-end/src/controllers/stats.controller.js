const statsService = require('../services/stats.service');

// GET /admin/stats
async function getPlatformStats(req, res, next) {
  try {
    // ?days=30 gibi opsiyonel parametre, varsayılan 7
    const days = Math.min(Number(req.query.days) || 7, 90); // max 90 gün

    const stats = await statsService.getPlatformStats(days);
    return res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}

module.exports = { getPlatformStats };
