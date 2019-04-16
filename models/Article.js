const mongoose = require('mongoose');

const { Schema } = mongoose;

const ArticleSchema = new Schema({
  author: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now },
  headline: { type: String, required: true },
  pubDate: String,
  datePublished: Date,
  saved: { type: Boolean, default: false },
  summary: { type: String, required: true },

  // prevent duplicate articles
  url: { type: String, required: true, unique: true },
});

ArticleSchema.pre('save', (next) => {
  if (!this.createdAt) this.createdAt = new Date();
  next();
});

const isModelCompiled = () => mongoose.modelNames().indexOf('Article') > -1;
const getModel = () =>
  (isModelCompiled()
    ? mongoose.connection.model('Article')
    : mongoose.model('Article', ArticleSchema));

module.exports = getModel();
