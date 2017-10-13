// set env to test
process.env.NODE_ENV = 'test';

/* global describe before beforeEach it */

const mongoose = require('mongoose');
const Article = require('../models/Article');
const Comment = require('../models/Comment');

// dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

// globals
const should = chai.should();

// implement chaiHttp
chai.use(chaiHttp);

// Test the api
describe('API routes', () => {

  // test the /scrape route
  describe('/GET /articles/scrape', () => {
    it('it sends "Scrape Complete" and status code 200', (done) => {
      chai.request(server)
        .get('/articles/scrape')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });

  // test /articles route. assume that there are some articles in the database already.
  describe('/GET articles', () => {
    it('it should GET all the articles', (done) => {
      chai.request(server)
        .get('/articles')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.at.least(1);
          done();
        });
    });
  });

  // test /comments route.
  describe('/POST comments/articleId', () => {
    let articleId;
    const comment = {
      text: 'This is a test comment.'
    };

    // get a valid article id
    before((done) => {
      Article.findOne().then((doc) => {
        articleId = doc._id;
        done();
      });
    });

    it('it should POST a comment', (done) => {
      chai.request(server)
        .post(`/comments/${articleId}`)
        .send(comment)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('text');
          res.body.should.have.property('createdAt');
          done();
        });
    });
  });
});
