const postService = require('../services/post.service');

// POST /posts
async function createPost(req, res, next) {
  try {
    const { content } = req.body;
    const post = await postService.createPost(req.user.id, content);
    return res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

// DELETE /posts/:id
async function deletePost(req, res, next) {
  try {
    const postId = Number(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ message: 'Geçersiz gönderi ID.' });

    const result = await postService.deletePost(postId, req.user.id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /posts/feed
async function getFeed(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50); // max 50
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;

    const result = await postService.getFeed(req.user.id, { limit, cursor });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /posts/user/:userId
async function getUserPosts(req, res, next) {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: 'Geçersiz kullanıcı ID.' });

    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;

    const result = await postService.getUserPosts(userId, { limit, cursor });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { createPost, deletePost, getFeed, getUserPosts };
