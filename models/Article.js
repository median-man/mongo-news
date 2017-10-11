/* Article model
 *
 * Representation of an article scraped from smashingmagazine.com */

// Dependencies
const mongoose = require('mongoose');

const { Schema } = mongoose;

// TODO: add validation
const ArticleSchema = new Schema({
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  headline: { type: String, required: true },
  pubDate: Date,
  summary: { type: String, required: true },
  tags: Array,

  // article url must be unique to prevent duplication of
  // the article in the database
  url: { type: String, required: true, unique: true }
});

// Set the created at parameter on save
ArticleSchema.pre('save', (next) => {
  if (!this.createdAt) this.createdAt = new Date();
  next();
});

// Export a mongoose model for the Article
module.exports = mongoose.model('Article', ArticleSchema);
