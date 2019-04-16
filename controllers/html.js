const { DateTime } = require('luxon');

const Article = require('../models/Article.js');

function articleDisplayDate(date) {
  const dateTime = DateTime.fromJSDate(date);
  return dateTime.toFormat('LLLL d, yyyy');
}

// Sends index page with articles from the database to the client
function getRoot(req, res) {
  Article.find()
    .then((articles) => {
      const hbsObject = {
        articles: articles.map(article => ({
          ...article._doc, // eslint-disable-line
          displayDate: articleDisplayDate(article.datePublished),
        })),
      };
      return res.render('index', hbsObject);
    })
    .catch(() => res.status(404).send('page unavailable'));
}

// Sends index page with saved articles to client
function getSaved(req, res) {
  // get saved articles
  Article.find({ saved: true })
    .then(articles => res.render('index', { articles, saved: true }))
    .catch(() => res.stats(404).send('page unavailable'));
}

module.exports = { getRoot, getSaved };
