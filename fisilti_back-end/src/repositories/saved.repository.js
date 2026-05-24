const prisma = require('../config/prisma');

/**
 * Kullanıcı bu gönderiyi kaydetmiş mi?
 */
async function findSaved(userId, postId) {
  return prisma.savedPost.findUnique({
    where: { userId_postId: { userId, postId } },
  });
}

/**
 * Gönderiyi kaydet
 */
async function createSaved(userId, postId) {
  return prisma.savedPost.create({
    data: { userId, postId },
  });
}

/**
 * Kaydı kaldır
 */
async function deleteSaved(userId, postId) {
  return prisma.savedPost.delete({
    where: { userId_postId: { userId, postId } },
  });
}

/**
 * Kullanıcının kaydettiği gönderileri listele
 */
async function getSavedPosts(userId) {
  return prisma.savedPost.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      post: {
        include: {
          user: { select: { id: true, username: true } },
        },
      },
    },
  });
}

module.exports = { findSaved, createSaved, deleteSaved, getSavedPosts };
