const { expect } = require('chai');
const sinon = require('sinon');
const ResponseStub = require('./responseStub');
const smashingScraper = require('../lib/smashingScraper');
const Article = require('../models/Article.js');
const articlesCon = require('../controllers/articles.js');

describe.only('controllers/articles', () => {
  let responseStub;

  beforeEach(() => {
    responseStub = new ResponseStub();
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

  describe('saveArticle()', () => {
    beforeEach(() => {
      sinon.stub(Article, 'findByIdAndUpdate');
    });

    afterEach(() => {
      Article.findByIdAndUpdate.restore();
    });

    const requestFixture = () => ({ body: { id: 'test' } });

    it('should send 404 response and error obj when findByIdAndUpdate rejects', () => {
      const expected = {
        error: new Error('test error'),
        status: 404,
      };
      Article.findByIdAndUpdate.rejects(expected.error);
      return articlesCon.saveArticle(requestFixture(), responseStub)
        .then(() => {
          responseStub
            .expect.json(expected.error)
            .expect.statusCode(expected.status);
        });
    });

    it('should reject if body is undefined', () => {
      const request = {};
      const shouldThrow = () => articlesCon.saveArticle(request);
      expect(shouldThrow).to.throw();
    });

    describe('when findByIdAndUpdate is successful', () => {
      it('should send updated article when findByIdAndUpdate is successful', () => {
        const expected = { id: 'test', saved: 'true' };
        Article.findByIdAndUpdate.resolves(expected);
        return articlesCon.saveArticle(requestFixture(), responseStub)
          .then(() => {
            responseStub.expect.json(expected);
          });
      });

      it('should call findByIdAndUpdate to set Article { saved: true } and get updated Article', () => {
        const request = requestFixture();
        const expectedArgs = [
          request.body.id,
          { saved: true },
          { new: true },
        ];
        Article.findByIdAndUpdate.resolves();
        return articlesCon.saveArticle(request, responseStub)
          .then(() => {
            expect(Article.findByIdAndUpdate.firstCall.args).to.eql(expectedArgs);
          });
      });
    });
  });

  describe('unsaveArticle()', () => {
    it('todo');
  });
});
