const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const articlesCon = require('../controllers/articles.js');

describe('controllers/articles functional tests', () => {
  describe('scrapeNew()', () => {
    it('should scrape new articles from https://www.smashingmagazine.com/articles/', (done) => {
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
      sinon.stub(axios, 'get').resolves({ data: '' });
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
      articlesCon
        .scrapeNew({}, response)
        .then(() => {
          axios.get.restore();
          return done();
        })
        .catch((reason) => {
          axios.get.restore();
          return done(reason);
        });
    });
  });
});
