const { expect } = require('chai');
const sinon = require('sinon');
const smashingScraper = require('../lib/smashingScraper');
const Article = require('../models/Article.js');
const articlesCon = require('../controllers/articles.js');

describe.only('controllers/articles', () => {
  const responseStub = {
    reset() {
      this.json = sinon.stub().returns(this);
      this.status = sinon.stub().returns(this);
      this.send = sinon.stub().returns(this);
    },
    expect: {
      statusCode(code) {
        const [status] = responseStub.status.firstCall.args;
        expect(status, `Expected response.status(${code}) to be called.`).to.equal(code);
        return responseStub;
      },

      json(expected) {
        const [actual] = responseStub.json.firstCall.args;
        expect(actual).to.equal(expected);
        return responseStub;
      },

      send(expected) {
        const [actual] = responseStub.send.firstCall.args;
        expect(actual).to.equal(expected);
        return responseStub;
      },
    },
  };

  beforeEach(() => {
    responseStub.reset();
    sinon.stub(Article, 'find');
    Article.find.expectCriteria = (expected) => {
      const [criteria] = Article.find.firstCall.args;
      expect(criteria).to.eql(expected);
    };
  });

  afterEach(() => {
    Article.find.restore();
  });

  describe('scrapeNew()', () => {
    beforeEach(() => {
      sinon.stub(smashingScraper, 'scrape');
      sinon.stub(Article, 'create');
    });

    afterEach(() => {
      smashingScraper.scrape.restore();
      Article.create.restore();
    });

    it('should scrape new articles from https://www.smashingmagazine.com/articles/', () => {
      const testArticles = [{ test: 'article1' }, { test: 'article2' }];
      smashingScraper.scrape.resolves(testArticles);
      Article.create
        .withArgs(testArticles[0]).resolves(testArticles[0])
        .withArgs(testArticles[1]).resolves(testArticles[1]);
      return articlesCon.scrapeNew({}, responseStub).then(() => {
        const [articles] = responseStub.json.firstCall.args;
        return expect(articles).to.eql(testArticles);
      });
    });

    it('should send an error response', () => {
      smashingScraper.scrape.rejects();
      return articlesCon
        .scrapeNew({}, responseStub)
        .then(() => {
          expect(responseStub.status.firstCall.args[0]).to.equal(400);
          expect(responseStub.send.firstCall.args[0]).to.be.an('Error');
        });
    });
  });

  describe('getArticles()', () => {
    it('should return an array of articles', () => {
      const expected = [{ test: 'article' }];
      Article.find.resolves(expected);
      return articlesCon
        .getArticles(null, responseStub)
        .then(() => {
          Article.find.expectCriteria(undefined);
          responseStub.expect.json(expected);
        });
    });

    it('should send an error response if read fails', () => {
      const expectedErr = new Error('test error');
      Article.find.rejects(expectedErr);
      return articlesCon
        .getArticles(null, responseStub)
        .then(() => responseStub
          .expect.statusCode(500)
          .expect.json(expectedErr));
    });
  });

  describe('getSaved()', () => {
    it('should find articles where { saved: true }', () => {
      const expected = {
        criteria: { saved: true },
        responseData: [{ test: 'article', saved: true }],
      };
      Article.find.resolves(expected.responseData);
      return articlesCon
        .getSaved(null, responseStub)
        .then(() => {
          Article.find.expectCriteria(expected.criteria);
          responseStub.expect.json(expected.responseData);
        });
    });

    it('should send an error response if read fails', () => {
      const expectedMsg = 'error message';
      Article.find.rejects({ message: expectedMsg });
      return articlesCon
        .getSaved(null, responseStub)
        .then(() => responseStub
          .expect.statusCode(500)
          .expect.send(expectedMsg));
    });
  });
});
