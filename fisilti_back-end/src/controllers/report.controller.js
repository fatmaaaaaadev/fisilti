const reportService = require('../services/report.service');

// POST /posts/:id/report
async function reportPost(req, res, next) {
  try {
    const postId = Number(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ message: 'Geçersiz gönderi ID.' });

    const { reason } = req.body;

    const result = await reportService.reportPost(postId, req.user.id, reason);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /admin/reports  (admin only — route'ta kontrol edilecek)
async function getAllReports(req, res, next) {
  try {
    const reports = await reportService.getAllReports();
    return res.status(200).json(reports);
  } catch (err) {
    next(err);
  }
}

// GET /admin/reports/post/:postId  (admin only)
async function getReportsByPost(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    if (isNaN(postId)) return res.status(400).json({ message: 'Geçersiz gönderi ID.' });

    const reports = await reportService.getReportsByPost(postId);
    return res.status(200).json(reports);
  } catch (err) {
    next(err);
  }
}

module.exports = { reportPost, getAllReports, getReportsByPost };
