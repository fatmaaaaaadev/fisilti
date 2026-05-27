const followService = require('../services/follow.service');

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

// GET /users/:id/counts
async function getFollowCounts(req, res, next) {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ message: 'Geçersiz kullanıcı ID.' });

    const result = await followService.getFollowCounts(userId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /users/suggestions
async function getSuggestions(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const result = await followService.getSuggestions(req.user.id, limit);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { followUser, unfollowUser, getFollowing, getFollowers, getFollowCounts, getSuggestions };
