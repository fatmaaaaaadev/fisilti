const savedRepo = require('../repositories/saved.repository');
const postRepo = require('../repositories/post.repository');

// ─── Gönderiyi Kaydet ─────────────────────────────────────────────────────────
async function savePost(userId, postId) {
  // Gönderi var mı ve aktif mi?
  const post = await postRepo.findById(postId);
  if (!post || !post.isActive) {
    const err = new Error('Gönderi bulunamadı.');
    err.status = 404;
    throw err;
  }

  // Zaten kaydedilmiş mi?
  const existing = await savedRepo.findSaved(userId, postId);
  if (existing) {
    const err = new Error('Bu gönderiyi zaten kaydettiniz.');
    err.status = 409;
    throw err;
  }

  await savedRepo.createSaved(userId, postId);
  return { message: 'Gönderi kaydedildi.' };
}

// ─── Kaydı Kaldır ─────────────────────────────────────────────────────────────
async function unsavePost(userId, postId) {
  const existing = await savedRepo.findSaved(userId, postId);
  if (!existing) {
    const err = new Error('Bu gönderi kayıtlarınızda bulunmuyor.');
    err.status = 404;
    throw err;
  }

  await savedRepo.deleteSaved(userId, postId);
  return { message: 'Gönderi kayıtlardan kaldırıldı.' };
}

// ─── Kaydedilen Gönderileri Listele ──────────────────────────────────────────
async function getSavedPosts(userId) {
  const rows = await savedRepo.getSavedPosts(userId);

  // Silinmiş / gizlenmiş gönderileri filtrele
  return rows
    .filter((r) => r.post.isActive)
    .map((r) => ({ ...r.post, savedAt: r.createdAt }));
}

module.exports = { savePost, unsavePost, getSavedPosts };
