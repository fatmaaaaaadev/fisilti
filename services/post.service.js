const postRepo = require('../repositories/post.repository');

const MAX_CONTENT_LENGTH = 280;

// ─── Gönderi Oluştur ─────────────────────────────────────────────────────────
async function createPost(userId, content) {
  if (!content || content.trim().length === 0) {
    const err = new Error('Gönderi içeriği boş olamaz.');
    err.status = 400;
    throw err;
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    const err = new Error(`Gönderi en fazla ${MAX_CONTENT_LENGTH} karakter olabilir.`);
    err.status = 400;
    throw err;
  }

  return postRepo.createPost(userId, content.trim());
}

// ─── Gönderi Sil (sadece sahibi) ─────────────────────────────────────────────
async function deletePost(postId, requestingUserId) {
  const post = await postRepo.findById(postId);

  if (!post || !post.isActive) {
    const err = new Error('Gönderi bulunamadı.');
    err.status = 404;
    throw err;
  }

  // Sahiplik kontrolü
  if (post.userId !== requestingUserId) {
    const err = new Error('Bu gönderiyi silme yetkiniz yok.');
    err.status = 403;
    throw err;
  }

  await postRepo.softDeletePost(postId);
  return { message: 'Gönderi silindi.' };
}

// ─── Feed Getir ───────────────────────────────────────────────────────────────
async function getFeed(userId, { limit, cursor } = {}) {
  const posts = await postRepo.getFeed(userId, { limit, cursor });
  return {
    posts,
    nextCursor: posts.length > 0 ? posts[posts.length - 1].id : null,
  };
}

// ─── Kullanıcının Gönderileri ─────────────────────────────────────────────────
async function getUserPosts(userId, { limit, cursor } = {}) {
  const posts = await postRepo.getUserPosts(userId, { limit, cursor });
  return {
    posts,
    nextCursor: posts.length > 0 ? posts[posts.length - 1].id : null,
  };
}

module.exports = { createPost, deletePost, getFeed, getUserPosts };
