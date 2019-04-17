const requester = require('axios');
const cheerio = require('cheerio');

const bourbonBlogDomain = 'https://www.bourbonbanter.com';
const bourbonBlogUrl = `${bourbonBlogDomain}/bourbonblog`;

let articles;
let $;

const selectors = {
  article: 'article.post',
  headline: 'h2.entry-title',
  url: 'h2.entry-title a',
  author: 'p.p-meta a:nth-child(2)',
  datetime: 'time',
  summary: '.entry-content',
};

const normalizeWhitespace = s => s.replace(/\s+/g, ' ');

const getHeadline = $article =>
  normalizeWhitespace($article
    .find(selectors.headline)
    .text()
    .trim());

const urlElement = $article => $article.find(selectors.url);

const getUrl = $article => urlElement($article).attr('href') || '';

const getAuthor = $article =>
  $article
    .find(selectors.author)
    .text()
    .trim();

const timeElement = $article => $article.find(selectors.datetime);

const getPubDate = $article => timeElement($article).attr('datetime') || '';

const getSummary = ($article) => {
  let result = $article
    .find(selectors.summary)
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
    return requester.get(bourbonBlogUrl).then(response => response.data);
  },

  parse(html) {
    $ = cheerio.load(html);
    articles = $(selectors.article)
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
