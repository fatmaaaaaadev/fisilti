const prisma = require('../config/prisma');

/**
 * Aynı kullanıcı aynı gönderiyi daha önce raporladı mı?
 */
async function findReport(postId, userId) {
  return prisma.report.findUnique({
    where: { postId_userId: { postId, userId } },
  });
}

/**
 * Yeni rapor oluştur
 */
async function createReport(postId, userId, reason) {
  return prisma.report.create({
    data: { postId, userId, reason },
  });
}

/**
 * Tüm raporları listele (admin için) — gönderi ve raporlayan bilgisiyle
 */
async function getAllReports() {
  return prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      post: {
        select: { id: true, content: true, isActive: true, userId: true },
      },
      user: {
        select: { id: true, username: true },
      },
    },
  });
}

/**
 * Belirli bir gönderiye ait raporları getir
 */
async function getReportsByPost(postId) {
  return prisma.report.findMany({
    where: { postId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, username: true } },
    },
  });
}

module.exports = { findReport, createReport, getAllReports, getReportsByPost };
