const Article = require('../models/Article.js');
const smashingScraper = require('../lib/smashingScraper.js');

function setSaved(id, saved) {
  return Article.findByIdAndUpdate(
    id,
    { saved },
    { new: true },
  );
}

// Returns all articles from db in an array
function getArticles(req, res) {
  Article.find()
    .then(articles => res.json(articles))
    .catch(err => res.status(500).json(err));
}

// Returns articles where saved = true
function getSaved(req, res) {
  Article.find({ saved: true })
    .then(articles => res.json(articles))
    .catch(err => res.status(500).send(err.message));
}

// Sets the saved property to true for the article with matching id
function saveArticle(req, res) {
  setSaved(req.body.id, true)
    .then(article => res.json(article))
    .catch(err => res.status(404).json(err));
}

function scrapeNew(req, res) {
  const createArticles = articles => Promise.all(articles.map(Article.create));

  return smashingScraper.scrape()
    .then(createArticles)
    .then(res.json.bind(res))
    .catch(err => res.status(400).send(err));
}

// Sets the saved property to false for the article
function unsaveArticle(req, res) {
  setSaved(req.body.id, false)
    .then(article => res.json(article))
    .catch(err => res.status(404).json(err));
}

module.exports = {
  getArticles,
  getSaved,
  saveArticle,
  scrapeNew,
  unsaveArticle,
};
