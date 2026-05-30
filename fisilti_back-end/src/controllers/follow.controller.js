const followService = require('../services/follow.service');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /users/:id/follow
async function followUser(req, res, next) {
  try {
    const followingId = Number(req.params.id);
    if (isNaN(followingId)) return res.status(400).json({ message: 'Geçersiz kullanıcı ID.' });

    const result = await followService.followUser(req.user.id, followingId);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// DELETE /users/:id/follow
async function unfollowUser(req, res, next) {
  try {
    const followingId = Number(req.params.id);
    if (isNaN(followingId)) return res.status(400).json({ message: 'Geçersiz kullanıcı ID.' });

    const result = await followService.unfollowUser(req.user.id, followingId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /users/:id/following
async function getFollowing(req, res, next) {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ message: 'Geçersiz kullanıcı ID.' });

    const result = await followService.getFollowing(userId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /users/:id/followers
async function getFollowers(req, res, next) {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ message: 'Geçersiz kullanıcı ID.' });

    const result = await followService.getFollowers(userId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// 🎯 YENİ EKLENEN ENDPOINT: GET /users/suggestions (Takip Önerileri)
async function getSuggestions(req, res, next) {
  try {
    const currentUserId = req.user.id; // İstek atan (giriş yapmış) kullanıcının ID'si

    // 1. Önce kullanıcının halihazırda takip ettiği kişilerin ID'lerini buluyoruz
    const myFollowings = await prisma.follows.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true }
    });

    // ID'leri düz bir diziye (array) çeviriyoruz: [2, 5, 12] gibi
    const followedIds = myFollowings.map(f => f.followingId);

    // 2. Takip edilmeyen kişileri buluyoruz. 
    // Kriterler: Kendisi olmayacak, halihazırda takip ettiği kişiler olmayacak ve hesabı aktif olacak.
    const suggestedUsers = await prisma.user.findMany({
      where: {
        id: {
          notIn: [...followedIds, currentUserId] // Kendisi ve takip ettikleri hariç
        },
        isActive: true // Banlanmamış kullanıcılar
      },
      select: {
        id: true,
        username: true,
        email: true // Gerekirse frontend'de göstermek veya avatar için kullanmak üzere
      },
      take: 5 // Ekrana çok yük binmesin diye sadece 5 kişi öneriyoruz
    });

    return res.status(200).json(suggestedUsers);
  } catch (err) {
    console.error("Takip önerileri getirilirken hata oluştu:", err);
    next(err);
  }
}

// 💡 getSuggestions fonksiyonunu hem dışarıya açtık hem de listeyi tamamladık!
module.exports = { 
  followUser, 
  unfollowUser, 
  getFollowing, 
  getFollowers,
  getSuggestions 
};