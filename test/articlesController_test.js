const { expect } = require('chai');
const sinon = require('sinon');
const smashingScraper = require('../lib/smashingScraper');
const articlesCon = require('../controllers/articles.js');

describe('controllers/articles', () => {
  beforeEach(() => {
    sinon.stub(smashingScraper, 'scrape');
  });

  afterEach(() => {
    smashingScraper.scrape.restore();
  });

  describe('scrapeNew()', () => {
    it('should scrape new articles from https://www.smashingmagazine.com/articles/', (done) => {
      smashingScraper.scrape.resolves([]);
      const response = {
        send: (err) => {
          throw err;
        },
        status: () => response,
        json: (newArticles) => {
          expect(newArticles).to.be.an('array');
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
        .then(() => done())
        .catch(done);
    });
  });
});
