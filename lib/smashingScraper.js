const requester = require('axios');
const cheerio = require('cheerio');

const smashingDomain = 'https://www.smashingmagazine.com';
const smashingUrl = `${smashingDomain}/articles/page/2/`;
const articleSelector = 'article.article--post';

let articles;
let $;

const normalizeWhitespace = s => s.replace(/\s+/g, ' ');

const getHeadline = $article => normalizeWhitespace($article.find('h1 a').text());

const urlElement = $article => $article.find('h1 a');

const getUrl = ($article) => {
  const path = urlElement($article).attr('href');
  if (path) {
    return smashingDomain + path;
  }
  return '';
};

const getAuthor = $article =>
  $article
    .find('header a')
    .text()
    .trim();

const timeElement = $article => $article.find('time');

const getPubDate = $article => timeElement($article).attr('datetime') || '';

const getSummary = ($article) => {
  let result = $article
    .find('p')
    .contents()
    .text();

  const timeText = timeElement($article).text();
  result = result.replace(timeText, '');

  const readMoreText = $article.find('.read-more-link').text();
  result = result.replace(readMoreText, '');

  return normalizeWhitespace(result.trim());
};

function parseArticle() {
  const $article = $(this);

  return {
    headline: getHeadline($article),
    url: getUrl($article),
    author: getAuthor($article),
    pubDate: getPubDate($article),
    summary: getSummary($article),
  };
}

const articlesExist = () => articles.length > 0;

module.exports = {
  getHtml() {
    return requester.get(smashingUrl).then(response => response.data);
  },

  parse(html) {
    $ = cheerio.load(html);
    articles = $(articleSelector)
      .map(parseArticle)
      .get();
    if (articlesExist()) {
      return articles;
    }
    throw new Error('No articles found.');
  },

  scrape() {
    return this.getHtml()
      .then(this.parse)
      .catch((err) => {
        console.error(err);
        return [];
      });
  },
};
