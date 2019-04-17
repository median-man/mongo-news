const { DateTime } = require('luxon');

const Article = require('../models/Article.js');

function articleDisplayDate(date) {
  const dateTime = DateTime.fromJSDate(date);
  return dateTime.toFormat('LLLL d, yyyy');
}

function enrichArticle(article) {
  const { pubDate } = article;
  let { datePublished } = article;
  let displayDate;
  if (datePublished) {
    displayDate = articleDisplayDate(datePublished);
  } else {
    displayDate = pubDate;
    datePublished = pubDate;
  }
  return { ...article._doc, displayDate, datePublished };
}

// Sends index page with articles from the database to the client
function getRoot(req, res) {
  Article.find()
    .then((articles) => {
      const hbsObject = {
        articles: articles.map(enrichArticle),
      };
      return res.render('index', hbsObject);
    })
    .catch(() => res.status(404).send('page unavailable'));
}

// Sends index page with saved articles to client
function getSaved(req, res) {
  Article.find({ saved: true })
    .then(articles => res.render('index', { articles: articles.map(enrichArticle), saved: true }))
    .catch(() => res.stats(404).send('page unavailable'));
}

module.exports = { getRoot, getSaved };
