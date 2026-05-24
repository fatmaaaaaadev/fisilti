const prisma = require('../config/prisma');

/**
 * Admin işlemini logla
 * @param {number} adminId
 * @param {"BAN_USER"|"UNBAN_USER"|"HIDE_POST"} action
 * @param {number} targetId
 * @param {"USER"|"POST"} targetType
 * @param {string} [note]
 */
async function createLog(adminId, action, targetId, targetType, note) {
  return prisma.adminLog.create({
    data: { adminId, action, targetId, targetType, note: note || null },
  });
}

/**
 * Tüm admin loglarını getir
 */
async function getAllLogs() {
  return prisma.adminLog.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      admin: { select: { id: true, username: true } },
    },
  });
}

module.exports = { createLog, getAllLogs };
