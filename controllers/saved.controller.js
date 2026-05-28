const savedService = require('../services/saved.service');

// POST /posts/:id/save
async function savePost(req, res, next) {
  try {
    const postId = Number(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ message: 'Geçersiz gönderi ID.' });

    const result = await savedService.savePost(req.user.id, postId);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// DELETE /posts/:id/save
async function unsavePost(req, res, next) {
  try {
    const postId = Number(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ message: 'Geçersiz gönderi ID.' });

    const result = await savedService.unsavePost(req.user.id, postId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /users/me/saved
async function getSavedPosts(req, res, next) {
  try {
    const posts = await savedService.getSavedPosts(req.user.id);
    return res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
}

module.exports = { savePost, unsavePost, getSavedPosts };
