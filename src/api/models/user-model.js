const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    min: 3,
    max: 15,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    min: 3,
    max: 15,
    trim: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
