const Article = require('../models/Article.js');
const scraper = require('../lib/scraper');

// Returns a promise for the updated article after setting the saved property
function setSaved(id, saved) {
  return Article.findByIdAndUpdate(
    id,
    { saved },
    { new: true } // return the updated document
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

// Scrapes for articles and returns array of new articles to client
function scrapeNew(req, res) {
  let newArticles = [];
  scraper()
    .then((scrapings) => {
      Article.create(scrapings, (err, newArticles) => {
        if (err) console.log(err.message);
        res.json(newArticles);
      });
    })
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
  unsaveArticle
};
