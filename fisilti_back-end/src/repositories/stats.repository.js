const prisma = require('../config/prisma');

/**
 * Toplam kullanıcı sayısı
 */
async function getTotalUsers() {
  return prisma.user.count({ where: { isActive: true, isVerified: true } });
}

/**
 * Toplam gönderi sayısı
 */
async function getTotalPosts() {
  return prisma.post.count({ where: { isActive: true } });
}

/**
 * Son N günün günlük gönderi sayıları
 */
async function getDailyPostCounts(days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const posts = await prisma.post.findMany({
    where: { createdAt: { gte: since }, isActive: true },
    select: { createdAt: true },
  });

  // Tarihe göre grupla
  const counts = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    counts[key] = 0;
  }
  posts.forEach((p) => {
    const key = p.createdAt.toISOString().slice(0, 10);
    if (key in counts) counts[key]++;
  });

  // Sıralı dizi olarak döndür
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

/**
 * Son N günün günlük yeni kullanıcı sayıları
 */
async function getDailyUserCounts(days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const users = await prisma.user.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const counts = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    counts[key] = 0;
  }
  users.forEach((u) => {
    const key = u.createdAt.toISOString().slice(0, 10);
    if (key in counts) counts[key]++;
  });

  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

/**
 * Ülkeye göre kullanıcı dağılımı
 */
async function getUserCountryDistribution() {
  const result = await prisma.user.groupBy({
    by: ['country'],
    where: { isActive: true, isVerified: true },
    _count: { country: true },
    orderBy: { _count: { country: 'desc' } },
  });

  return result.map((r) => ({
    country: r.country || 'Bilinmiyor',
    count: r._count.country,
  }));
}

/**
 * Toplam rapor sayısı
 */
async function getTotalReports() {
  return prisma.report.count();
}

/**
 * Banlı kullanıcı sayısı
 */
async function getBannedUserCount() {
  return prisma.user.count({ where: { isActive: false } });
}

module.exports = {
  getTotalUsers,
  getTotalPosts,
  getDailyPostCounts,
  getDailyUserCounts,
  getUserCountryDistribution,
  getTotalReports,
  getBannedUserCount,
};
