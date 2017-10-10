const mocha = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { describe, it } = mocha;
const { expect } = chai;

/* eslint prefer-arrow-callback: 0 */
/* eslint func-names: 0 */

const scraper = require('../src/lib/scraper.js');

// runs tests on an article from the array produced by scraper
function testArticle(article) {
  describe('each article', function () {
    it('has a valid headline property', function () {
      expect(article.headline).to.be.a('string');
    });
    it('has a valid summary property', function () {
      expect(article.summary).to.be.a('string');
    });
    it('has a valid url property', function () {
      expect(article.url).to.be.a('string');
    });
    it('has a valid tags property', function () {
      expect(article.tags).to.be.an('array');
    });
    it('has a valid pubDate property', function () {
      expect(article.pubDate).to.be.a('date');
    });
    it('has a valid author property', function () {
      expect(article.author).to.be.a('string');
    });
  });
}

describe('scraper', function () {
  it('is a function', function () {
    expect(scraper).to.be.a('function');
  });

  it('returns a promise', function () {
    expect(scraper()).to.be.a('promise');
  });

  it(
    'passes an array with at least one element when the promise is fullfilled',
    function (done) {
      scraper()
        .then((articles) => {
          expect(articles).to.be.an('array');
          expect(articles.length).to.be.greaterThan(0);
          done();
        }).catch(done);
    }
  );

  // run test on each item in array of articles from scraper
  scraper()
    .then((articles) => {
      // test each element for valid properties
      articles.forEach(testArticle);

      // test contents of first article returned for page as it is on
      // 10/9/2017  (will not pass when page contents are updated)
      describe('first article in the array', function () {
        const article = articles[0];
        const itMsg = 'has values that match the first article on the page on ' +
        '10/9/2017 (will fail when page is updated)';

        // expected values from current page content
        const expectedValues = {
          headline:
            'Building A Large-Scale Design System: How A Design ' +
            'System Was Created For The U.S. Government (Case Study)',
          summary:
            'Editor\'s Note: We’ve been closely working with Maya on ' +
            'this article, and we’re happy to see the final result now being ' +
            'published on 18F. We highly encourage more teams to share the ' +
            'lessons they learned when building design systems or pattern ' +
            'libraries, and we’re always happy to support them in writing, ' +
            ' editing and shaping that article. This post is a re-post of ' +
            'Maya’s final article.',
          url:
            'https://www.smashingmagazine.com/2017/10/large-scale-design-sy' +
            'stem-us-government/',
          tags: ['Design Patterns', 'Design Systems', 'Pattern Libraries'],
          pubDate: new Date(2017, 9, 10),
          author: 'Maya Benari'
        };
        it(itMsg, function () {
          expect(article).to.deep.equal(expectedValues);
        })
      });
    })
    .catch(console.log);
});
