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

// Sets the saved property to true for the article with matching id
function saveArticle(req, res) {
  setSaved(req.body.id, true)
    .then(article => res.json(article))
    .catch(err => res.status(404).json(err));
}

// Scrapes for articles and returns articles json to client
function scrapeNew(req, res) {
  scraper()
    .then((scrapings) => {
      scrapings.forEach((scraping) => {
        const entry = new Article(scraping);
        entry.save((err, doc) => {
          if (err) console.log({ message: err.message, scraping });
        });
      });
      res.send('Scrape Complete');
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
  saveArticle,
  scrapeNew,
  unsaveArticle
};
