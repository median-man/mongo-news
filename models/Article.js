/* Article model
 *
 * Representation of an article scraped from smashingmagazine.com */

// Dependencies
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({});

// Export a mongoose model for the Article
module.exports = mongoose.model('Article', ArticleSchema);
