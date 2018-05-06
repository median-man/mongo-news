const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { mockReq, mockRes } = require('sinon-express-mock');
const smashingScraper = require('../lib/smashingScraper');
const Article = require('../models/Article.js');
const articlesCon = require('../controllers/articles.js');

chai.use(sinonChai);
const { expect } = chai;

describe.only('controllers/articles', () => {
  let response;

  beforeEach(() => {
    response = mockRes();
    sinon.stub(Article, 'find');
    Article.find.expectCriteria = (expected) => {
      const [criteria] = Article.find.firstCall.args;
      expect(criteria).to.eql(expected);
    };
    sinon.stub(Article, 'findByIdAndUpdate');
  });

  afterEach(() => {
    Article.find.restore();
    Article.findByIdAndUpdate.restore();
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
      return articlesCon.scrapeNew(mockReq(), response).then(() => {
        expect(response.json).to.have.been.calledWith(testArticles);
      });
    });

    it('should send an error response', () => {
      const expectedErr = new Error();
      smashingScraper.scrape.rejects(expectedErr);
      return articlesCon
        .scrapeNew(mockReq(), response)
        .then(() => {
          expect(response.status).to.have.been.calledWith(400);
          expect(response.send).to.have.been.calledWith(expectedErr);
        });
    });
  });

  describe('getArticles()', () => {
    it('should return an array of articles', () => {
      const expected = [{ test: 'article' }];
      Article.find.resolves(expected);
      return articlesCon
        .getArticles(mockReq(), response)
        .then(() => {
          Article.find.expectCriteria(undefined);
          expect(response.json).to.have.been.calledWith(expected);
        });
    });

    it('should send an error response if read fails', () => {
      const expectedErr = new Error('test error');
      Article.find.rejects(expectedErr);
      return articlesCon
        .getArticles(mockReq(), response)
        .then(() => {
          expect(response.status).to.have.been.calledWith(500);
          expect(response.json).to.have.been.calledWith(expectedErr);
        });
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
        .getSaved(mockReq(), response)
        .then(() => {
          Article.find.expectCriteria(expected.criteria);
          expect(response.json).to.have.been.calledWith(expected.responseData);
        });
    });

    it('should send an error response if read fails', () => {
      const expectedMsg = 'error message';
      Article.find.rejects({ message: expectedMsg });
      return articlesCon
        .getSaved(mockReq(), response)
        .then(() => {
          expect(response.status).to.have.been.calledWith(500);
          expect(response.send).to.have.been.calledWith(expectedMsg);
        });
    });
  });

  const requestWithBody = () => mockReq({ body: { id: 'test' } });

  describe('saveArticle()', () => {
    it('should reject if body is undefined', () => {
      const request = mockReq();
      const shouldThrow = () => articlesCon.saveArticle(request, mockRes());
      expect(shouldThrow).to.throw();
    });

    describe('when findByIdAndUpdate is successful', () => {
      it('should send updated article when findByIdAndUpdate is successful', () => {
        const request = requestWithBody();
        const expected = { id: 'test', saved: 'true' };
        Article.findByIdAndUpdate.resolves(expected);
        return articlesCon.saveArticle(request, response)
          .then(() => {
            expect(response.json).to.have.been.calledWith(expected);
          });
      });

      it('should call findByIdAndUpdate to set Article { saved: true } and get updated Article', () => {
        const request = requestWithBody();
        const expectedArgs = [
          request.body.id,
          { saved: true },
          { new: true },
        ];
        Article.findByIdAndUpdate.resolves();
        return articlesCon.saveArticle(request, response)
          .then(() => {
            expect(Article.findByIdAndUpdate.firstCall.args).to.eql(expectedArgs);
          });
      });
    });
  });

  describe('when Article.findByIdAndUpdate rejects', () => {
    function shouldSendErrorResponse(func) {
      const request = requestWithBody();
      const expected = {
        error: new Error('test error'),
        status: 404,
      };
      Article.findByIdAndUpdate.rejects(expected.error);
      return func(request, response)
        .then(() => {
          expect(response.status).to.have.been.calledWith(404);
          expect(response.json).to.have.been.calledWith(expected.error);
        });
    }

    function testFunction(method) {
      it(`${method}() should send 404 response and error obj`, () => {
        shouldSendErrorResponse(articlesCon[method]);
      });
    }

    testFunction('saveArticle');
    testFunction('unsaveArticle');
  });

  describe('unsaveArticle()', () => {
  });
});
