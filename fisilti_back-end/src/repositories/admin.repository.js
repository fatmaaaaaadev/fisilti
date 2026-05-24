const prisma = require('../config/prisma');

/**
 * Tüm kullanıcıları listele (hassas alanlar hariç)
 */
async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      username: true,
      isVerified: true,
      isActive: true,
      role: true,
      country: true,
      createdAt: true,
    },
  });
}

/**
 * Kullanıcıyı banla / banı kaldır
 */
async function setUserActiveStatus(userId, isActive) {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: { id: true, username: true, isActive: true },
  });
}

/**
 * Gönderiyi gizle (soft delete — admin versiyonu)
 */
async function hidePost(postId) {
  return prisma.post.update({
    where: { id: postId },
    data: { isActive: false },
    select: { id: true, isActive: true },
  });
}

/**
 * Kullanıcıyı ID ile bul
 */
async function findUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

module.exports = { getAllUsers, setUserActiveStatus, hidePost, findUserById };
