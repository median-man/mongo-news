/* Scrapes Smashingmagazine's home page for articles */
const request = require('request');
const cheerio = require('cheerio');

// Returns an object containing an article from a post
function parseArticle(article) {
  const $ = cheerio(article);
  // console.log(article);
  return {
    author: $.find('a[rel="author"]').text().trim(),
    headline: $.find('h2 a span').text().trim(),
    pubDate: $.find('.rd').text().trim(),
    summary: $.find('p').eq(1).text().trim(),
    tags: $.find('.tags a').map((i, el) => cheerio(el).text().trim()).toArray(),
    url: $.find('h2 a').attr('href')
  };
}

// Returns array of article object from html document.
function parseHtml(html) {
  const $ = cheerio.load(html);

  // The content for each article is contained in an article element with
  // the 'post' class. Return an array of articles
  const articles = [];
  $('article.post').each((i, el) => articles.push(parseArticle(el)));
  return articles;
}

module.exports = function scrape() {
  const smashingURL = 'https://www.smashingmagazine.com/';

  return new Promise((resolve, reason) => {
    // make the request to smashingMagazine's site
    request(smashingURL, (error, response, body) => {
      if (error) { return reason(error); }
      return resolve(parseHtml(body));
    });
  });
};
