// set env to test
process.env.NODE_ENV = 'test';

/* global describe beforeEach it */

const mongoose = require('mongoose');
const Article = require('../models/Article');

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
          res.text.should.include('Scrape Complete');
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
});
