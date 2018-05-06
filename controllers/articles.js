const Article = require('../models/Article.js');
const smashingScraper = require('../lib/smashingScraper.js');

function setSaved(id, saved) {
  return Article.findByIdAndUpdate(id, { saved }, { new: true });
}

function getArticles(req, res) {
  return Article.find()
    .then(articles => res.json(articles))
    .catch(err => res.status(500).json(err));
}

function getSaved(req, res) {
  return Article.find({ saved: true })
    .then(articles => res.json(articles))
    .catch(err => res.status(500).send(err.message));
}

function saveArticle(req, res) {
  setSaved(req.body.id, true)
    .then(article => res.json(article))
    .catch(err => res.status(404).json(err));
}

function unsaveArticle(req, res) {
  setSaved(req.body.id, false)
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

module.exports = {
  getArticles,
  getSaved,
  saveArticle,
  unsaveArticle,
  scrapeNew,
};
