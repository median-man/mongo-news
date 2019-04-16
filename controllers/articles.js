const Article = require('../models/Article.js');
const smashingScraper = require('../lib/smashingScraper.js');

function scrapeNew(req, res) {
  const createArticle = article => 
    Article.create({
      ...article,
      datePublished: new Date(article.pubDate),
    }).catch(() => null);
  const createArticles = articles => articles.map(createArticle);
  const awaitAllArticles = articles => Promise.all(articles);
  const filterNull = articles => articles.filter(article => article);

  return smashingScraper
    .scrape()
    .then(createArticles)
    .then(awaitAllArticles)
    .then(filterNull)
    .then(articles => res.json(articles))
    .catch(err => res.status(500).send(err));
}

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
  console.log(req.body.id)
  return setSaved(req.body.id, true)
    .then(article => res.json(article))
    .catch(err => res.status(404).json(err));
}

function unsaveArticle(req, res) {
  return setSaved(req.body.id, false)
    .then(article => res.json(article))
    .catch(err => res.status(404).json(err));
}

module.exports = {
  getArticles,
  getSaved,
  saveArticle,
  unsaveArticle,
  scrapeNew,
};
