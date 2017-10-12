const Article = require('../models/Article.js');

// Returns all articles from db in an array
function getArticles(req, res) {
  Article.find()
    .then(articles => res.json(articles))
    .catch(err => res.status(500).json(err));
}

// Sets the saved property to true for the article with matching id
function saveArticle(req, res) {
  Article.findByIdAndUpdate(
    req.body.id,
    { saved: true },
    { new: true }, // return the updated document
    (err, article) => {
      if (err) return res.status(404).json(err);
      return res.json(article);
    }
  );
}

module.exports = { getArticles, saveArticle };
