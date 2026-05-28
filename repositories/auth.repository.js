const prisma = require('../config/prisma');

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function findByUsername(username) {
  return prisma.user.findUnique({ where: { username } });
}

async function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function createUser({ email, username, passwordHash, country }) {
  return prisma.user.create({
    data: { email, username, passwordHash, country },
  });
}

async function createVerificationCode(userId, code, expiresAt) {
  return prisma.emailVerification.create({
    data: { userId, code, expiresAt },
  });
}

async function findValidVerificationCode(userId, code) {
  return prisma.emailVerification.findFirst({
    where: {
      userId,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });
}

async function markCodeAsUsed(codeId) {
  return prisma.emailVerification.update({
    where: { id: codeId },
    data: { used: true },
  });
}

async function markUserAsVerified(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: { isVerified: true },
  });
}

/**
 * Hesabı pasife al — soft delete (GZ4: kullanıcı hesap silme hakkı)
 */
async function deactivateUser(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });
}

module.exports = {
  findByEmail,
  findByUsername,
  findById,
  createUser,
  createVerificationCode,
  findValidVerificationCode,
  markCodeAsUsed,
  markUserAsVerified,
  deactivateUser,
};
