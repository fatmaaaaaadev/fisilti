const adminRepo = require('../repositories/admin.repository');
const reportRepo = require('../repositories/report.repository');
const postRepo = require('../repositories/post.repository');
const logRepo = require('../repositories/adminLog.repository');

// ─── Tüm Kullanıcıları Listele ────────────────────────────────────────────────
async function getAllUsers() {
  return adminRepo.getAllUsers();
}

// ─── Kullanıcı Banla ──────────────────────────────────────────────────────────
async function banUser(adminId, userId) {
  const user = await adminRepo.findUserById(userId);
  if (!user) {
    const err = new Error('Kullanıcı bulunamadı.');
    err.status = 404;
    throw err;
  }
  if (!user.isActive) {
    const err = new Error('Kullanıcı zaten banlı.');
    err.status = 409;
    throw err;
  }
  if (user.role === 'ADMIN') {
    const err = new Error('Admin kullanıcılar banlanamaz.');
    err.status = 403;
    throw err;
  }

  const result = await adminRepo.setUserActiveStatus(userId, false);
  await logRepo.createLog(adminId, 'BAN_USER', userId, 'USER', `${user.username} banlandı.`);
  return result;
}

// ─── Kullanıcı Banını Kaldır ──────────────────────────────────────────────────
async function unbanUser(adminId, userId) {
  const user = await adminRepo.findUserById(userId);
  if (!user) {
    const err = new Error('Kullanıcı bulunamadı.');
    err.status = 404;
    throw err;
  }
  if (user.isActive) {
    const err = new Error('Kullanıcı zaten aktif.');
    err.status = 409;
    throw err;
  }

  const result = await adminRepo.setUserActiveStatus(userId, true);
  await logRepo.createLog(adminId, 'UNBAN_USER', userId, 'USER', `${user.username} banı kaldırıldı.`);
  return result;
}

// ─── Tüm Raporları Listele ────────────────────────────────────────────────────
async function getAllReports() {
  return reportRepo.getAllReports();
}

// ─── Belirli Gönderinin Raporları ─────────────────────────────────────────────
async function getReportsByPost(postId) {
  return reportRepo.getReportsByPost(postId);
}

// ─── Gönderiyi Gizle ──────────────────────────────────────────────────────────
async function hidePost(adminId, postId) {
  const post = await postRepo.findById(postId);
  if (!post) {
    const err = new Error('Gönderi bulunamadı.');
    err.status = 404;
    throw err;
  }
  if (!post.isActive) {
    const err = new Error('Gönderi zaten gizlenmiş.');
    err.status = 409;
    throw err;
  }

  const result = await adminRepo.hidePost(postId);
  await logRepo.createLog(adminId, 'HIDE_POST', postId, 'POST', `Post #${postId} gizlendi.`);
  return result;
}

// ─── Admin Loglarını Listele ──────────────────────────────────────────────────
async function getAdminLogs() {
  return logRepo.getAllLogs();
}

module.exports = { getAllUsers, banUser, unbanUser, getAllReports, getReportsByPost, hidePost, getAdminLogs };
