const { DateTime } = require('luxon');

const Article = require('../models/Article.js');

function articleDisplayDate(date) {
  const dateTime = DateTime.fromJSDate(date);
  return dateTime.toFormat('LLLL d, yyyy');
}

function enrichArticle(article) {
  const { datePublished } = article;
  const displayDate = articleDisplayDate(datePublished);
  return { ...article._doc, displayDate };
}

const defaultArticleQueryConditions = {
  datePublished: { $exists: true },
  summary: { $exists: true },

  // ignore articles with summary containing fewer than 15 characters.
  // Usually saved as "Read more...". The bad data is occasionally scraped\
  // (generally caused by a change in the html structure)
  $expr: { $gt: [{ $strLenCP: '$summary' }, 15] },
};

// Sends index page with articles from the database to the client
function getRoot(req, res) {
  Article.find(defaultArticleQueryConditions)
    .sort({ datePublished: 'desc' })
    .then(articles => articles.map(enrichArticle))
    .then(articles => res.render('index', { articles }))
    .catch(() => res.status(404).send('page unavailable'));
}

// Sends index page with saved articles to client
function getSaved(req, res) {
  const conditions = { ...defaultArticleQueryConditions, saved: true };
  Article.find(conditions)
    .sort({ datePublished: 'desc' })
    .then(articles => articles.map(enrichArticle))
    .then(articles => res.render('index', { articles, saved: true }))
    .catch(() => res.stats(404).send('page unavailable'));
}

module.exports = { getRoot, getSaved };
