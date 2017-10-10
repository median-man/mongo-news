/* Scrapes Smashingmagazine's home page for articles */
const request = require('request');
const cheerio = require('cheerio');

// Returns array of article object from html document.
function parseHtml(html) {
  const $ = cheerio.load(html);

  // The content for each article is contained in an article element with
  // the 'post' class.
  const firstPost = $('article.post').first();

  return [{
    author: firstPost.find('a[rel="author"]').text().trim(),
    headline: firstPost.find('h2 a span').text().trim(),
    pubDate: firstPost.find('.rd').text().trim(),
    summary: firstPost.find('p').eq(1).text().trim(),
    tags: firstPost.find('.tags a').map((i, el) => $(el).text().trim()).toArray(),
    url: firstPost.find('h2 a').attr('href')
  }];
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
