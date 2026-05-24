const reportRepo = require('../repositories/report.repository');
const postRepo = require('../repositories/post.repository');

// ─── Gönderi Raporla ──────────────────────────────────────────────────────────
async function reportPost(postId, userId, reason) {
  // Gönderi var mı ve aktif mi?
  const post = await postRepo.findById(postId);
  if (!post || !post.isActive) {
    const err = new Error('Gönderi bulunamadı.');
    err.status = 404;
    throw err;
  }

  // Kendi gönderisini raporlayamaz
  if (post.userId === userId) {
    const err = new Error('Kendi gönderinizi raporlayamazsınız.');
    err.status = 400;
    throw err;
  }

  // Aynı gönderiyi tekrar raporlayamaz
  const existing = await reportRepo.findReport(postId, userId);
  if (existing) {
    const err = new Error('Bu gönderiyi zaten raporladınız.');
    err.status = 409;
    throw err;
  }

  await reportRepo.createReport(postId, userId, reason || null);
  return { message: 'Gönderi raporlandı. Teşekkürler.' };
}

// ─── Tüm Raporları Getir (Admin) ──────────────────────────────────────────────
async function getAllReports() {
  return reportRepo.getAllReports();
}

// ─── Belirli Gönderinin Raporları (Admin) ─────────────────────────────────────
async function getReportsByPost(postId) {
  return reportRepo.getReportsByPost(postId);
}

module.exports = { reportPost, getAllReports, getReportsByPost };
