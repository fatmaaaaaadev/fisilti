const prisma = require('../config/prisma');

/**
 * Yeni gönderi oluştur
 */
async function createPost(userId, content) {
  return prisma.post.create({
    data: { userId, content },
    include: { user: { select: { id: true, username: true } } },
  });
}

/**
 * ID ile gönderi bul
 */
async function findById(id) {
  return prisma.post.findUnique({
    where: { id },
    include: { user: { select: { id: true, username: true } } },
  });
}

/**
 * Feed: sadece takip edilenlerin aktif gönderileri — cursor tabanlı sayfalama
 */
async function getFeed(userId, { limit = 20, cursor } = {}) {
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = follows.map((f) => f.followingId);

  if (followingIds.length === 0) return [];

  return prisma.post.findMany({
    where: { userId: { in: followingIds }, isActive: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    include: { user: { select: { id: true, username: true } } },
  });
}

/**
 * Belirli kullanıcının gönderileri
 */
async function getUserPosts(userId, { limit = 20, cursor } = {}) {
  return prisma.post.findMany({
    where: { userId, isActive: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    include: { user: { select: { id: true, username: true } } },
  });
}

/**
 * Soft delete — gönderiyi pasife al, DB'den silme
 */
async function softDeletePost(id) {
  return prisma.post.update({
    where: { id },
    data: { isActive: false },
  });
}

module.exports = { createPost, findById, getFeed, getUserPosts, softDeletePost };
