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

module.exports = { findFollow, createFollow, deleteFollow, getFollowing, getFollowers };
