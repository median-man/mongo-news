const Article = require('../models/Article.js');

// TODO: build a static 404 page to redirect to

function getRoot(req, res) {
  // get articles
  Article.find()
    .then(articles => res.render('index', { articles }))
    .catch(() => res.status(404).send('page unavailable'));
}

function getSaved(req, res) {
  // get saved articles
  Article.find({ saved: true})
    .then(articles => res.render('index', { articles }))
    .catch(() => res.stats(404).send('page unavailable'));
}

module.exports = { getRoot, getSaved };
