const Article = require('../models/Article.js');

function getRoot(req, res) {
  // get articles
  Article.find()
    .then(articles => res.render('index', { articles }))
    .catch(() => res.status(404).send('page unavailable'));
}

module.exports = { getRoot };
