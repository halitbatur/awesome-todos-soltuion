const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const transform = function (doc, ret, options) {
  if (options.hide) {
    options.hide.split(' ').forEach(function (prop) {
      delete ret[prop];
    });
  }
  return ret;
};

todoSchema.set('toObject', { virtuals: true, transform });
todoSchema.set('toJSON', { virtuals: true, transform });
todoSchema.options.toJSON.hide = 'user';
// todoSchema.options.toObject.hide = 'user';

module.exports = mongoose.model('Todo', todoSchema);
