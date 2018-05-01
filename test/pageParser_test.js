const { expect } = require('chai');
const SmashingParser = require('../lib/pageParser.js');
const cheerio = require('cheerio');

describe('pageParser', () => {
  describe('createSummary()', () => {
    it('should return the summary text', () => {
      const html = `<p class="article--post__teaser">
        <time datetime="2018-05-01" class="article--post__time">May 1, 2018 — </time>

        We have covered print stylesheets in the past here on Smashing Magazine. In this article, Rachel Andrew takes a look at the state of printing from the browser today. <a href="/2018/05/print-stylesheets-in-2018/" class="read-more-link"> Read More…</a>
        </p>`;
      const input = cheerio.load(html)('.article--post__teaser');
      const expected = 'We have covered print stylesheets in the past here on Smashing Magazine. In this article, Rachel Andrew takes a look at the state of printing from the browser today.';
      const parser = new SmashingParser(cheerio);
      const actual = parser.createSummary(input);
      expect(actual).to.equal(expected);
    })
  })
  describe('createArticle()', () => {
    let parser;
    const createParser = () => { parser = new SmashingParser(cheerio); };
    beforeEach(createParser);
    it('should be a function', () => expect(parser.createArticle).to.be.a('function'));

    it.skip('should return an article', () => {
      const articleHtml =
        `<article class="article--post">
          <header>
            <figure class="author author--small">
              <a href="/author/rachel-andrew">
                <div class="author__image-wrapper">
                  <div class="author__image">
                    
                    <img src="https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/82c26edc-5500-42a6-87a9-62e84b998433/rachel-andrew-tw-profile.jpg" alt="Rachel Andrew">
        
                  </div>
                </div>
              </a>
            </figure>
            <span class="article--post__author-name grey"><a href="/author/rachel-andrew">Rachel Andrew</a> <span>wrote</span></span>
          </header>
        
          <h1 class="article--post__title"><a href="/2018/05/print-stylesheets-in-2018/">A Guide To The State Of Print Stylesheets In 2018</a></h1>
        
          <footer class="article--post__stats">
            <ul>
              <li class="article--post__reading-time"><span class="small-caps">18</span> min read</li>
              <li class="article--post__comments-count">
              <a href="/2018/05/print-stylesheets-in-2018/#comments-print-stylesheets-in-2018">
                <span data-component="CommentsCount" data-insert="true" data-thread="/2018/05/print-stylesheets-in-2018/"><span>Leave a comment</span></span>
              </a>
              </li>
            </ul>
          </footer>
          <div class="article--post__content">
            <p class="article--post__teaser">
              <time datetime="2018-05-01" class="article--post__time">May 1, 2018 — </time>
        
              We have covered print stylesheets in the past here on Smashing Magazine. In this article, Rachel Andrew takes a look at the state of printing from the browser today. <a href="/2018/05/print-stylesheets-in-2018/" class="read-more-link"> Read More…</a>
            </p>
          </div>
        </article>`;
      
        const expected = {
        author: 'Rachel Andrew',
        headline: 'A Guide To The State Of Print Stylesheets In 2018',
        pubDate: '2018-05-01',
        summary: 'We have covered print stylesheets in the past here on Smashing Magazine. In this article, Rachel Andrew takes a look at the state of printing from the browser today.',
        tags: '',
        url: 'https://www.smashingmagazine.com/2018/05/print-stylesheets-in-2018/',
      };
      const input = cheerio.load(articleHtml)('article');
      const actual = parser.createArticle(input);
      expect(actual).to.eql(expected);
    })
  });
});