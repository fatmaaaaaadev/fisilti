const statsRepo = require('../repositories/stats.repository');

/**
 * Genel platform istatistiklerini tek seferde toplar
 */
async function getPlatformStats(days = 7) {
  const [
    totalUsers,
    totalPosts,
    totalReports,
    bannedUsers,
    dailyPosts,
    dailyUsers,
    countryDistribution,
  ] = await Promise.all([
    statsRepo.getTotalUsers(),
    statsRepo.getTotalPosts(),
    statsRepo.getTotalReports(),
    statsRepo.getBannedUserCount(),
    statsRepo.getDailyPostCounts(days),
    statsRepo.getDailyUserCounts(days),
    statsRepo.getUserCountryDistribution(),
  ]);

  return {
    overview: {
      totalUsers,
      totalPosts,
      totalReports,
      bannedUsers,
    },
    dailyPosts,
    dailyUsers,
    countryDistribution,
  };
}

module.exports = { getPlatformStats };
