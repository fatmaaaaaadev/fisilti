const prisma = require('../config/prisma');

/**
 * Takip ilişkisi var mı kontrol et
 */
async function findFollow(followerId, followingId) {
  return prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
}

/**
 * Takip et
 */
async function createFollow(followerId, followingId) {
  return prisma.follow.create({
    data: { followerId, followingId },
  });
}

/**
 * Takibi bırak
 */
async function deleteFollow(followerId, followingId) {
  return prisma.follow.delete({
    where: { followerId_followingId: { followerId, followingId } },
  });
}

/**
 * Takip edilenlerin listesi (ben kimleri takip ediyorum)
 */
async function getFollowing(userId) {
  return prisma.follow.findMany({
    where: { followerId: userId },
    select: {
      following: { select: { id: true, username: true } },
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Takipçilerin listesi (beni kimler takip ediyor)
 */
async function getFollowers(userId) {
  return prisma.follow.findMany({
    where: { followingId: userId },
    select: {
      follower: { select: { id: true, username: true } },
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Takipçi ve takip edilen sayısını döndür (profil sayfası için)
 */
async function getFollowCounts(userId) {
  const [followersCount, followingCount] = await Promise.all([
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);
  return { followersCount, followingCount };
}

/**
 * Henüz takip edilmeyen aktif kullanıcıları getir (öneri listesi)
 */
async function getSuggestions(userId, limit = 20) {
  // Zaten takip edilenlerin ID'leri
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);

  // Kendisi + takip ettikleri hariç aktif kullanıcılar
  return prisma.user.findMany({
    where: {
      id: { notIn: [...followingIds, userId] },
      isActive: true,
      isVerified: true,
    },
    select: { id: true, username: true, country: true },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = { findFollow, createFollow, deleteFollow, getFollowing, getFollowers, getFollowCounts, getSuggestions };
