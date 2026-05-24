const followRepo = require('../repositories/follow.repository');
const authRepo = require('../repositories/auth.repository');

// ─── Takip Et ─────────────────────────────────────────────────────────────────
async function followUser(followerId, followingId) {
  // Kendini takip etme kontrolü
  if (followerId === followingId) {
    const err = new Error('Kendinizi takip edemezsiniz.');
    err.status = 400;
    throw err;
  }

  // Hedef kullanıcı var mı ve aktif mi?
  const target = await authRepo.findById(followingId);
  if (!target || !target.isActive) {
    const err = new Error('Kullanıcı bulunamadı.');
    err.status = 404;
    throw err;
  }

  // Zaten takip ediyor mu?
  const existing = await followRepo.findFollow(followerId, followingId);
  if (existing) {
    const err = new Error('Bu kullanıcıyı zaten takip ediyorsunuz.');
    err.status = 409;
    throw err;
  }

  await followRepo.createFollow(followerId, followingId);
  return { message: `${target.username} takip edildi.` };
}

// ─── Takibi Bırak ─────────────────────────────────────────────────────────────
async function unfollowUser(followerId, followingId) {
  if (followerId === followingId) {
    const err = new Error('Geçersiz işlem.');
    err.status = 400;
    throw err;
  }

  const existing = await followRepo.findFollow(followerId, followingId);
  if (!existing) {
    const err = new Error('Bu kullanıcıyı zaten takip etmiyorsunuz.');
    err.status = 404;
    throw err;
  }

  await followRepo.deleteFollow(followerId, followingId);
  return { message: 'Takipten çıkıldı.' };
}

// ─── Takip Edilenler ──────────────────────────────────────────────────────────
async function getFollowing(userId) {
  const rows = await followRepo.getFollowing(userId);
  return rows.map((r) => ({ ...r.following, followedAt: r.createdAt }));
}

// ─── Takipçiler ───────────────────────────────────────────────────────────────
async function getFollowers(userId) {
  const rows = await followRepo.getFollowers(userId);
  return rows.map((r) => ({ ...r.follower, followedAt: r.createdAt }));
}

module.exports = { followUser, unfollowUser, getFollowing, getFollowers };
