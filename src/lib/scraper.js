/* Scrapes Smashingmagazine's home page for articles */

module.exports = function scrape() {
  return new Promise((resolve, reason) => {
    resolve([{
      headline: '',
      summary: '',
      url: '',
      tags: [],
      pubDate: new Date(),
      author: ''
    }]);
  });
};
