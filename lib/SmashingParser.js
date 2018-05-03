class ArticleParser {
  constructor(article$, selectors) {
    Object.assign(this, { article$, selectors });
  }

  findText(selector) {
    return this.article$.find(selector).text().trim();
  }

  findAttr(selector, attr) {
    return this.article$.find(selector).attr(attr);
  }

  throwMissingPropertyError(prop) {
    throw new Error(`Cannot find ${prop}. Selector: "${this.selectors[prop]}".`);
  }

  get author() {
    const author = this.findText(this.selectors.author);
    if (!author) { this.throwMissingPropertyError('author'); }
    return author;
  }

  get headline() {
    const headline = this.findText(this.selectors.headline);
    if (!headline) { this.throwMissingPropertyError('headline'); }
    return headline;
  }

  get pubDate() {
    const pubDate = this.findAttr(this.selectors.pubDate, 'datetime');
    if (!pubDate) { this.throwMissingPropertyError('pubDate'); }
    return pubDate;
  }

  get summary() {
    const summary = this.article$
      .find(this.selectors.summary)
      .contents()
      .eq(2)
      .text()
      .trim();
    if (!summary) { this.throwMissingPropertyError('summary'); }
    return summary;
  }

  get url() {
    const url = this.findAttr(this.selectors.url, 'href');
    if (!url) { this.throwMissingPropertyError('url'); }
    return url;
  }
}

class SmashingParser {
  constructor($) {
    this.hostname = 'https://www.smashingmagazine.com';
    this.articleSelector = 'article';
    this.selectors = {
      author: '.article--post__author-name a',
      headline: '.article--post__title a',
      pubDate: 'time',
      summary: '.article--post__teaser',
      url: '.article--post__title a',
    };
    this.$ = $;
  }

  createArticle(article$) {
    const article = new ArticleParser(article$, this.selectors);
    return {
      author: article.author,
      headline: article.headline,
      pubDate: article.pubDate,
      summary: article.summary,
      url: this.hostname + article.url,
    };
  }

  get articles() {
    const articles = [];
    const articles$ = this.$(this.articleSelector);
    if (articles$.length === 0) {
      throw new Error(`No articles found. Article selector: "${this.articleSelector}"`);
    }
    articles$.each((index, element) => {
      articles.push(this.createArticle(this.$(element)));
    });
    return articles;
  }
}

module.exports = SmashingParser;
