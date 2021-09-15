const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    postTitle: {
      type: String,
      require: true,
      min: 3,
    },
    postContent: {
      type: String,
      require: true,
      min: 3,
    },
    reactions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Users',
        },
        counts: {
          types: Number,
          default: 0,
        },
        time: { type: Date, default: Date.now },
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Users',
        },
        comments: {
          type: String,
          trim: true,
          reactions: [
            {
              userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
              },
              time: { type: Date, default: Date.now },
            },
          ],
          reply: [
            {
              userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
              },
              reply: {
                type: String,
                trim: true,
              },
              reactions: [
                {
                  userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Users',
                  },
                  time: { type: Date, default: Date.now },
                },
              ],
            },
          ],
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Post', postSchema);
