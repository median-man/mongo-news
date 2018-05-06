const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const fixtures = require('./fixtures/smashingScraper.js');
const smashingScraper = require('../lib/smashingScraper.js');

describe('smashingScraper', () => {
  describe('getHtml()', () => {
    beforeEach(() => {
      sinon.stub(axios, 'get');
    });

    afterEach(() => {
      axios.get.restore();
    });


    it('should request page from https://www.smashingmagazine.com/articles/', () => {
      axios.get.resolves(fixtures.responses.oneArticle);
      return smashingScraper
        .getHtml()
        .then((html) => {
          const expectedUrl = 'https://www.smashingmagazine.com/articles/';
          const actualUrl = axios.get.firstCall.args[0];
          expect(expectedUrl).to.equal(actualUrl);
          expect(html).to.equal(fixtures.responses.oneArticle.data);
        })
        .catch();
    });

    describe('when request to Smashing website fails', () => {
      it('should reject with error object', () => {
        const stub = sinon.stub();
        axios.get.rejects(stub);
        return smashingScraper
          .getHtml()
          .then(() => expect.fail('Expected getHtml() to reject.'))
          .catch(error => expect(error).to.equal(stub));
      });
    });
  });

  describe('when no articles are on the page', () => {
    it('parse() should throw Error: "No articles found." ', () => {
      const shouldThrow = () => smashingScraper.parse(fixtures.html.noArticles);
      const expectedErrorMsg = 'No articles found.';
      expect(shouldThrow).to.throw(expectedErrorMsg);
    });
  });

  describe('when there is one article', () => {
    it('parse() should return an array with one article', () => {
      const expected = [{
        headline: 'FAST UX Research: An Easier Way To Engage Stakeholders And Speed Up The Research Process',
        pubDate: '2018-05-04',
        url: 'https://www.smashingmagazine.com/2018/05/fast-ux-research/',
        author: 'Zoe Dimov',
        summary: 'UX professionals are constantly pressured to reduce the time they need to conduct UX research. Find out which techniques and ideas can make the user research process more transparent and collaborative.',
      }];
      const actual = smashingScraper.parse(fixtures.html.oneArticle);
      expect(actual).to.eql(expected);
    });
  });

  describe('when there are three articles', () => {
    it('parse() should return an array with three articles', () => {
      const expected = [
        {
          headline: 'FAST UX Research: An Easier Way To Engage Stakeholders And Speed Up The Research Process',
          pubDate: '2018-05-04',
          url: 'https://www.smashingmagazine.com/2018/05/fast-ux-research/',
          author: 'Zoe Dimov',
          summary: 'UX professionals are constantly pressured to reduce the time they need to conduct UX research. Find out which techniques and ideas can make the user research process more transparent and collaborative.',
        }, {
          headline: 'Using Low Vision As My Tool To Help Me Teach WordPress',
          pubDate: '2018-05-03',
          url: 'https://www.smashingmagazine.com/2018/05/using-low-vision-teach-wordpress/',
          author: 'Bud Kraus',
          summary: 'Macular degeneration is the leading cause of legal blindness in the United States. Bud Kraus shares his story of lessons learned from his disability as a tool to help him communicate and teach WordPress to others.',
        }, {
          headline: 'A Conference Without Slides: Meet SmashingConf Toronto 2018 (June 26-27)',
          pubDate: '2018-05-03',
          url: 'https://www.smashingmagazine.com/2018/05/smashingconf-toronto-2018/',
          author: 'Vitaly Friedman',
          summary: 'SmashingConf Toronto is coming! Join us for a conference without slides, and see how experienced designers and developers work live. With lots of time for deep dive-ins. June 26–27.',
        },
      ];
      const actual = smashingScraper.parse(fixtures.html.threeArticles);
      expect(actual).to.eql(expected);
    });
  });

  describe('article object from parse() when article values are missing', () => {
    it('missing values should be empty strings', () => {
      const expected = [{
        headline: '',
        pubDate: '',
        url: '',
        author: '',
        summary: '',
      }];
      const actual = smashingScraper.parse(fixtures.html.missingValues);
      expect(actual).to.eql(expected);
    });
  });

  describe('functional test', () => {
    it('should scrape articles from https://www.smashingmagazine.com', (done) => {
      const expectAllKeys = article => expect(article).to.have.keys('headline', 'url', 'pubDate', 'author', 'summary');
      const validateArticle = (article) => {
        expectAllKeys(article);
        Object.values(article).forEach(value => expect(value).to.have.length.greaterThan(0));
      };

      smashingScraper
        .scrape()
        .then((articles) => {
          expect(articles).to.be.an('array');
          expect(articles).to.have.length.greaterThan(0);
          articles.forEach(validateArticle);
          done();
        })
        .catch(done);
    });
  });
});
