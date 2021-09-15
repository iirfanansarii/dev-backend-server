const router = require('express').Router();
const {
  createPost,
  getAllPost,
  getPostByPostId,
  commentOnPost,
  reactionOnPost,
  getPost,
} = require('../controller/post-controller');

const customerAuth = require('../middleware/customerAuth');

router.post('/create/post', customerAuth, createPost);
router.put('/comment/on/post/:postId', customerAuth, commentOnPost);
router.patch('/reaction/on/comment/:postId', customerAuth, reactionOnPost);
router.get('/post', getPost);
router.get('/post/all', getAllPost);
router.get('/post/:postId', getPostByPostId);

module.exports = router;
