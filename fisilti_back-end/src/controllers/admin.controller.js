const adminService = require('../services/admin.service');
const { PrismaClient } = require('@prisma/client'); // 💡 Require formatına çevirdik
const prisma = new PrismaClient();

// GET /admin/users
async function getAllUsers(req, res, next) {
  try {
    const users = await adminService.getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

// PATCH /admin/users/:id/ban
async function banUser(req, res, next) {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ message: 'Geçersiz kullanıcı ID.' });

    const result = await adminService.banUser(req.user.id, userId);
    return res.status(200).json({ message: 'Kullanıcı banlandı.', user: result });
  } catch (err) {
    next(err);
  }
}

// PATCH /admin/users/:id/unban
async function unbanUser(req, res, next) {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ message: 'Geçersiz kullanıcı ID.' });

    const result = await adminService.unbanUser(req.user.id, userId);
    return res.status(200).json({ message: 'Kullanıcı banı kaldırıldı.', user: result });
  } catch (err) {
    next(err);
  }
}

// GET /admin/reports
async function getAllReports(req, res, next) {
  try {
    const reports = await adminService.getAllReports();
    return res.status(200).json(reports);
  } catch (err) {
    next(err);
  }
}

// GET /admin/reports/post/:postId
async function getReportsByPost(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    if (isNaN(postId)) return res.status(400).json({ message: 'Geçersiz gönderi ID.' });

    const reports = await adminService.getReportsByPost(postId);
    return res.status(200).json(reports);
  } catch (err) {
    next(err);
  }
}

// PATCH /admin/posts/:id/hide
async function hidePost(req, res, next) {
  try {
    const postId = Number(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ message: 'Geçersiz gönderi ID.' });

    const result = await adminService.hidePost(req.user.id, postId);
    return res.status(200).json({ message: 'Gönderi gizlendi.', post: result });
  } catch (err) {
    next(err);
  }
}

// GET /admin/logs
async function getAdminLogs(req, res, next) {
  try {
    const logs = await adminService.getAdminLogs();
    return res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
}

// 🎯 YENİ ENDPOINT: Raporlanan detaylı gönderileri çeken fonksiyonumuz
async function getReportedPosts(req, res, next) {
  try {
    const reportedPosts = await prisma.post.findMany({
      where: {
        reports: {
          some: {} 
        }
      },
      include: {
        _count: {
          select: { reports: true } 
        },
        reports: {
          select: {
            reason: true 
          }
        },
        user: {
          select: {
            username: true 
          }
        }
      }
    });

    const formattedReports = reportedPosts.map(post => ({
      id: post.id,
      content: post.content,
      username: post.user.username,
      reportCount: post._count.reports, 
      reasons: post.reports.map(r => r.reason).filter(Boolean), 
      isActive: post.isActive
    }));

    return res.status(200).json(formattedReports);
  } catch (error) {
    console.error("Raporlar getirilirken backend hatası:", error);
    next(error); // Diğer fonksiyonlardaki gibi merkezi hata yakalayıcıya pasladık
  }
}

// 💡 getReportedPosts fonksiyonunu da buraya ekleyerek dışarıya açtık!
module.exports = { 
  getAllUsers, 
  banUser, 
  unbanUser, 
  getAllReports, 
  getReportsByPost, 
  hidePost, 
  getAdminLogs,
  getReportedPosts 
};