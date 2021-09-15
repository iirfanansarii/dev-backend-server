const Posts = require('../models/post-model');

const {
  mongodbError,
  postCreated,
  postCreationFailed,
  postFetched,
  postNotFound,
  postFound,
  postsNotFound,
  commentAdded,
  invalidPostId,
  commentNotAdded,
  commentIsEmpty,
  responseAdded,
  responseNotAdded,
  postTitleMissing,
  postContentMissing,
  userIdMissing,
} = require('../constants');

exports.createPost = (req, res) => {
  const data = req.body;
  const { postTitle, postContent } = data;
  const { userId } = req;
  if (!userId) {
    return res.status(400).send({ message: userIdMissing });
  }
  if (!postTitle) {
    return res.status(400).send({ message: postTitleMissing });
  }
  if (!postContent) {
    return res.status(400).send({ message: postContentMissing });
  }
  const newpost = new Posts({ user: userId, postTitle, postContent });
  newpost.save((err, results) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
    if (results) {
      return res.status(201).json({
        message: postCreated,
        post: results,
      });
    }
    return res.status(400).json({
      message: postCreationFailed,
    });
  });
  return null;
};

exports.getAllPost = (req, res) => {
  Posts.find({})
    .select('_id userId postTitle postContent reactions comments')
    .populate('user', '_id name')
    .exec()
    .then((results) => {
      if (!results) {
        return res.status(404).send({ message: postNotFound });
      }
      if (results) {
        return res.status(200).json({
          message: postFetched,
          records: results.length,
          posts: results,
        });
      }
    })
    .catch((err) =>
      res.status(500).json({
        message: mongodbError,
        error: err,
      })
    );
};

exports.getPostByPostId = (req, res) => {
  const { postId } = req.params;
  Posts.find({ _id: postId })
    .select('_id userId postTitle postContent reactions comments')
    .populate('user', '_id name')
    .exec()
    .then((results) => {
      if (!results) {
        return res.status(404).send({ message: postsNotFound });
      }
      return res.status(200).json({
        message: postFound,
        post: results,
      });
    })
    .catch((err) =>
      res.status(500).json({
        message: mongodbError,
        error: err,
      })
    );
};

exports.commentOnPost = (req, res) => {
  const { postId } = req.params;
  const { userId } = req;
  const { comments } = req.body;
  if (!postId) {
    return res.status(400).sendd({ message: postsNotFound });
  }
  if (!userId) {
    return res.status(400).send({ message: userIdMissing });
  }
  if (!comments) {
    return res.status(400).send({ message: commentIsEmpty });
  }
  Posts.findOne({ _id: postId }).exec((err, validPost) => {
    if (err) {
      return res.status(400).json({
        message: invalidPostId,
      });
    }
    if (validPost) {
      const condition = { _id: postId };
      const update = {
        $push: {
          comments: [{ userId, comments }],
        },
      };
      Posts.findOneAndUpdate(condition, update, { new: true })
        .then((response) =>
          res.status(200).send({ message: commentAdded, response })
        )
        .catch((err) => res.status(400).json({ message: commentNotAdded }));
    }
    return null;
  });
  return null;
};

exports.reactionOnPost = (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  if (!postId) {
    return res.status(400).sendd({ message: postsNotFound });
  }
  if (!userId) {
    return res.status(400).send({ message: userIdMissing });
  }
  Posts.findOne({ _id: postId }).exec((err, validPost) => {
    if (err) {
      return res.status(400).json({
        message: invalidPostId,
      });
    }
    if (validPost) {
      const condition = { _id: postId };
      const update = {
        $push: {
          reactions: [{ userId }],
        },
      };
      Posts.findOneAndUpdate(condition, update, { new: true })
        .then((response) =>
          res.status(201).send({ message: responseAdded, response })
        )
        .catch((err) => res.status(400).json({ message: responseNotAdded }));
    }
    return null;
  });
  return null;
};

exports.getPost = async (req, res) => {
  try {
    let { page, size } = req.query;
    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 10;
    }

    const limit = parseInt(size, 10);
    const skip = (page - 1) * size;
    // const postData = await Posts.find({}, {}, { limit: limit, skip: skip });
    const data = await Posts.find().limit(limit).skip(skip);
    res.status(200).send({
      records: data.length,
      page,
      size,
      posts: data,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
