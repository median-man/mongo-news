const requester = require('axios');
const cheerio = require('cheerio');

const smashingDomain = 'https://www.smashingmagazine.com';
const smashingUrl = `${smashingDomain}/articles/`;
const articleSelector = 'article';

let articles;
let $;

const normalizeWhitespace = s => s.replace(/\s+/g, ' ');

const getHeadline = $article => normalizeWhitespace($article.find('h1 a').text());

const getUrlPath = $article => $article.find('h1 a').attr('href');

const getUrl = ($article) => {
  const path = getUrlPath($article);
  if (path) {
    return smashingDomain + path;
  }
  return '';
};

const getAuthor = $article => $article.find('header a').text().trim();

const getPubDate = $article => $article.find('time').attr('datetime') || '';

const getSummary = $article => normalizeWhitespace($article
  .find('p')
  .contents()
  .eq(2)
  .text()
  .trim());

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
    articles = $(articleSelector).map(parseArticle).get();
    if (articlesExist()) {
      return articles;
    }
    throw new Error('No articles found.');
  },

  scrape() {
    return this.getHtml().then(this.parse);
  },
};
