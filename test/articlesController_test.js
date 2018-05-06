const { expect } = require('chai');
const sinon = require('sinon');
const smashingScraper = require('../lib/smashingScraper');
const Article = require('../models/Article.js');
const articlesCon = require('../controllers/articles.js');

describe('controllers/articles', () => {
  describe('scrapeNew()', () => {
    beforeEach(() => {
      sinon.stub(smashingScraper, 'scrape');
      sinon.stub(Article, 'create');
    });

    afterEach(() => {
      smashingScraper.scrape.restore();
      Article.create.restore();
    });

    it('should scrape new articles from https://www.smashingmagazine.com/articles/', (done) => {
      const testArticles = [{ test: 'article1' }, { test: 'article2' }];
      smashingScraper.scrape.resolves(testArticles);
      Article.create
        .withArgs(testArticles[0]).resolves(testArticles[0])
        .withArgs(testArticles[1]).resolves(testArticles[1]);
      const response = {
        send: (err) => {
          throw err;
        },
        status: () => response,
        json: (newArticles) => {
          expect(newArticles).to.eql(testArticles);
        },
      };
      articlesCon.scrapeNew({}, response).then(done).catch(done);
    });

    it('should send an error response', (done) => {
      const response = {
        send: (err) => {
          expect(err).to.be.an('Error');
        },
        status: (code) => {
          expect(code).to.equal(400);
          return response;
        },
        json: () => {
          throw new Error('Expected error response but received json.');
        },
      };
      smashingScraper.scrape.rejects();
      articlesCon
        .scrapeNew({}, response)
        .then(() => {
          expect(Article.create.called).to.be.false; // eslint-disable-line
          return done();
        })
        .catch(done);
    });
  });

  describe('getArticles()', () => {

  });
});
