class SmashingParser {
  constructor(documentModel) {
    this.model = documentModel;
    this.selectors = {
      author: '.article--post__author-name a',
      headline: '.article--post__title a',
      pubDate: 'time',
      summary: '.article--post__teaser',
      url: '',
    }
  }
  createSummary(summary$) {
    return summary$.contents();
  }
  createArticle(article$) {
    const findText = selector => article$.find(selector).text().trim();
    const findAttr = (selector, attr) => article$.find(selector).attr(attr);
    return {
      author: findText(this.selectors.author),
      headline: findText(this.selectors.headline),
      pubDate: findAttr(this.selectors.pubDate, 'datetime'),
      summary: findText(this.selectors.summary),
      url: '/testUrl/',
    };
  }
}
module.exports = SmashingParser;
