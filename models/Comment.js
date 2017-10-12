/* Comment model
 *
 * Representation of a comment created by a user associated with an article */

// Dependencies
const mongoose = require('mongoose');

const { Schema } = mongoose;

// TODO: add validation
const CommentSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  text: { type: String, required: true }
});

// Set the created at parameter on save
CommentSchema.pre('save', (next) => {
  if (!this.createdAt) this.createdAt = new Date();
  next();
});

// Export a mongoose model for the Article
module.exports = mongoose.model('Comment', CommentSchema);
