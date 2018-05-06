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
          const badRequest = 400;
          expect(response.status).to.have.been.calledWith(badRequest);
          expect(response.send).to.have.been.calledWith(expectedErr);
        });
    });
  });

  describe('read methods', () => {
    let request;

    beforeEach(() => {
      sinon.stub(Article, 'find');
    });

    afterEach(() => {
      Article.find.restore();
    });

    beforeEach(() => {
      request = mockReq();
    });

    describe('when Article.find rejects', () => {
      let expectedMsg;
      let expectedErr;
      const internalServerError = 500;

      beforeEach(() => {
        expectedMsg = 'test error';
        expectedErr = new Error(expectedMsg);
        Article.find.rejects(expectedErr);
      });

      it('getArticles() should send an error response', () => articlesCon
        .getArticles(request, response)
        .then(() => {
          expect(response.status).to.have.been.calledWith(internalServerError);
          expect(response.json).to.have.been.calledWith(expectedErr);
        }));

      it('getSaved() should send an error response', () => articlesCon
        .getSaved(request, response)
        .then(() => {
          expect(response.status).to.have.been.calledWith(internalServerError);
          expect(response.send).to.have.been.calledWith(expectedMsg);
        }));
    });

    describe('when Article.find resolves', () => {
      const expected = [{ test: 'article' }];

      beforeEach(() => {
        Article.find.resolves(expected);
      });

      function methodShouldSendJson(method) {
        return articlesCon[method](request, response)
          .then(() => {
            expect(response.json).to.have.been.calledWith(expected);
          });
      }

      it('getArticles() should send json', () => methodShouldSendJson('getArticles'));

      it('getArticles() should call Article.Find without conditions', () => articlesCon
        .getArticles(request, response)
        .then(() => {
          expect(Article.find).to.have.been.called;
          expect(Article.find).to.have.been.calledWithExactly();
        }));

      it('getSaved() should send json', () => methodShouldSendJson('getSaved'));

      it('getSaved() should call Article.Find with conditions', () => {
        const expectedConditions = { saved: true };
        return articlesCon
          .getSaved(request, response)
          .then(() => {
            expect(Article.find).to.have.been.calledWith(expectedConditions);
          });
      });
    });
  });

  describe('update methods', () => {
    before(() => {
      sinon.stub(Article, 'findByIdAndUpdate');
    });

    afterEach(() => {
      Article.findByIdAndUpdate.reset();
    });

    after(() => {
      Article.findByIdAndUpdate.restore();
    });

    const requestWithBody = () => mockReq({ body: { id: 'test' } });

    describe('when Article.findByIdAndUpdate rejects', () => {
      let request;
      const notFound = 404;

      beforeEach(() => {
        request = requestWithBody();
      });

      function shouldSendErrorResponse(func) {
        const expectedError = new Error('test error');
        Article.findByIdAndUpdate.rejects(expectedError);
        return func(request, response)
          .then(() => {
            expect(response.status).to.have.been.calledWith(notFound);
            expect(response.json).to.have.been.calledWith(expectedError);
          });
      }

      function testFunction(method) {
        it(`${method}() should send ${notFound} response and error obj`, () => {
          shouldSendErrorResponse(articlesCon[method]);
        });
      }

      testFunction('saveArticle');
      testFunction('unsaveArticle');
    });

    describe('when request body is undefined', () => {
      let request;

      beforeEach(() => {
        request = mockReq();
      });

      function methodShouldThrow(method) {
        const shouldThrow = () => articlesCon[method](request, response);
        const test = () => expect(shouldThrow).to.throw();
        it(`${method}() should throw`, test);
      }

      methodShouldThrow('saveArticle');
      methodShouldThrow('unsaveArticle');
    });

    describe('when findByIdAndUpdate resolves', () => {
      let request;

      beforeEach(() => {
        request = requestWithBody();
      });

      function methodShouldSendJson(method) {
        const expected = { id: 'test' };
        Article.findByIdAndUpdate.resolves(expected);
        return articlesCon[method](request, response)
          .then(() => {
            expect(response.json).to.have.been.calledWith(expected);
          });
      }

      function testArticleUpdate(method, saved) {
        const expectedArgs = {
          id: request.body.id,
          update: { saved },
          options: { new: true },
        };
        Article.findByIdAndUpdate.resolves();
        const testExpectations = () => {
          const [id, update, options] = Article.findByIdAndUpdate.firstCall.args;
          expect(id, 'id argument').to.equal(expectedArgs.id);
          expect(update, 'update argument').to.eql(expectedArgs.update);
          expect(options).to.eql(expectedArgs.options);
        };
        return articlesCon[method](request, response).then(testExpectations);
      }

      function testMethod(method, saved) {
        it(`${method}() should send updated article json`, () => methodShouldSendJson(method));
        it(`${method}() should set Article { saved: ${saved} }`, () => {
          testArticleUpdate(method, saved);
        });
      }

      testMethod('saveArticle', true);
      testMethod('unsaveArticle', false);
    });
  });
});
