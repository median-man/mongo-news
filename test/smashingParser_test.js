const { expect } = require('chai');
const SmashingParser = require('../lib/SmashingParser.js');
const cheerio = require('cheerio');

describe('smashingParser', () => {
  describe('createArticle()', () => {
    const getArticleModel = (html, selector) => cheerio.load(html)(selector);
    let parser;
    const createParser = () => { parser = new SmashingParser(cheerio); };
    beforeEach(createParser);

    it('should be a function', () => expect(parser.createArticle).to.be.a('function'));

    it('should return an article', () => {
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
        url: 'https://www.smashingmagazine.com/2018/05/print-stylesheets-in-2018/',
      };
      const input = getArticleModel(articleHtml, 'article');
      parser.hostname = 'https://www.smashingmagazine.com';
      const actual = parser.createArticle(input);
      expect(actual).to.eql(expected);
    });

    it('should append #hostname to the url', () => {
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
        
          <h1 class="article--post__title"><a href="/test/article/">A Guide To The State Of Print Stylesheets In 2018</a></h1>
        
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
      const input = getArticleModel(articleHtml, 'article');
      parser.hostname = 'http://www.test.com';
      const expected = 'http://www.test.com/test/article/';
      const actual = parser.createArticle(input).url;
      expect(actual).to.equal(expected);
    });

    describe('when an article property is not found', () => {
      const shouldThrowMissingProperty = (input, selector) => {
        parser.selectors[selector.key] = selector.value;
        const expectedMsg = `Cannot find ${selector.key}. Selector: "${selector.value}".`;
        const actual = () => parser.createArticle(input);
        expect(actual).to.throw(expectedMsg);
      };

      it('should throw if author not found', () => {
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
            </header>
          
            <h1 class="article--post__title"><a href="/test/article/">A Guide To The State Of Print Stylesheets In 2018</a></h1>
          
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
        const input = getArticleModel(articleHtml, 'article');
        const selector = { key: 'author', value: '.author' };
        shouldThrowMissingProperty(input, selector);
      });

      it('should throw if headline is not found', () => {
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
          
            <h1 class=""><a href="/test/article/">Invalid headline seclector</a></h1>
          
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
        const input = getArticleModel(articleHtml, 'article');
        const selector = { key: 'headline', value: '.headline' };
        shouldThrowMissingProperty(input, selector);
      });

      it('should throw if pubDate is not found', () => {
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
          
                We have covered print stylesheets in the past here on Smashing Magazine. In this article, Rachel Andrew takes a look at the state of printing from the browser today. <a href="/2018/05/print-stylesheets-in-2018/" class="read-more-link"> Read More…</a>
              </p>
            </div>
          </article>`;
        const input = getArticleModel(articleHtml, 'article');
        const selector = { key: 'pubDate', value: '.pubDate' };
        shouldThrowMissingProperty(input, selector);
      });

      it('should throw if summary is not found', () => {
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
          
              </p>
            </div>
          </article>`;
        const input = getArticleModel(articleHtml, 'article');
        const selector = { key: 'summary', value: '.article--post__teaser' };
        shouldThrowMissingProperty(input, selector);
      });

      it('should throw if url is not found', () => {
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
          
            <h1 class="article--post__title"><a href="">A Guide To The State Of Print Stylesheets In 2018</a></h1>
          
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
        const input = getArticleModel(articleHtml, 'article');
        const selector = { key: 'url', value: '.article--post__title' };
        shouldThrowMissingProperty(input, selector);
      });
    });
  });

  describe('articles', () => {
    it('should return an array of articles', () => {
      const html = `<div class="col col-12">
        <article class="article--post">
          <header>
            <figure class="author author--small">
              <a href="/author/brian-holt">
                <div class="author__image-wrapper">
                  <div class="author__image">
                    
          <img src="//cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/131c56af-37b8-450c-8eb0-54a1908d1602/brian-holt-profile-pic-opt.jpeg" alt="Brian Holt">
        
                  </div>
                </div>
              </a>
            </figure>
            <span class="article--post__author-name grey"><a href="/author/brian-holt">Brian Holt</a> <span>wrote</span></span>
          </header>
        
          <h1 class="article--post__title"><a href="/2018/05/building-serverless-contact-form-static-website/">Building A Serverless Contact Form For Your Static Site</a></h1>
        
          <footer class="article--post__stats">
            <ul>
              <li class="article--post__reading-time"><span class="small-caps">14</span> min read</li>
              <li class="article--post__comments-count">
              <a href="/2018/05/building-serverless-contact-form-static-website/#comments-building-serverless-contact-form-static-website">
                <span data-component="CommentsCount" data-insert="true" data-thread="/2018/05/building-serverless-contact-form-static-website/"><span><span class="small-caps">3</span> comments</span></span>
              </a>
              </li>
            </ul>
          </footer>
          <div class="article--post__content">
            <p class="article--post__teaser">
              <time datetime="2018-05-02" class="article--post__time">May 2, 2018 — </time>
        
              With the help of this article, you will finally be able to learn the basics of Amazon Web Services (AWS) Lambda and Simple Email Service (SES) APIs to help you build your own static site mailer on the Serverless Framework. Let’s get started! <a href="/2018/05/building-serverless-contact-form-static-website/" class="read-more-link"> Read More…</a>
            </p>
          </div>
        </article>
        <article class="article--post">
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
                <span data-component="CommentsCount" data-insert="true" data-thread="/2018/05/print-stylesheets-in-2018/"><span><span class="small-caps">2</span> comments</span></span>
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
        </article>
      </div>`;
      const $ = cheerio.load(html);
      const expected = [
        {
          author: 'Brian Holt',
          headline: 'Building A Serverless Contact Form For Your Static Site',
          pubDate: '2018-05-02',
          summary: 'With the help of this article, you will finally be able to learn the basics of Amazon Web Services (AWS) Lambda and Simple Email Service (SES) APIs to help you build your own static site mailer on the Serverless Framework. Let’s get started!',
          url: 'https://www.smashingmagazine.com/2018/05/building-serverless-contact-form-static-website/',
        }, {
          author: 'Rachel Andrew',
          headline: 'A Guide To The State Of Print Stylesheets In 2018',
          pubDate: '2018-05-01',
          summary: 'We have covered print stylesheets in the past here on Smashing Magazine. In this article, Rachel Andrew takes a look at the state of printing from the browser today.',
          url: 'https://www.smashingmagazine.com/2018/05/print-stylesheets-in-2018/',
        },
      ];
      const actual = new SmashingParser($).articles;
      expect(actual).to.be.an('array');
      expect(actual).to.eql(expected);
    });

    it('should find articles using #articleSelector', () => {
      const html = `<div class="col col-12">
        <div class="article--post">
          <header>
            <figure class="author author--small">
              <a href="/author/brian-holt">
                <div class="author__image-wrapper">
                  <div class="author__image">
                    
          <img src="//cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/131c56af-37b8-450c-8eb0-54a1908d1602/brian-holt-profile-pic-opt.jpeg" alt="Brian Holt">
        
                  </div>
                </div>
              </a>
            </figure>
            <span class="article--post__author-name grey"><a href="/author/brian-holt">Brian Holt</a> <span>wrote</span></span>
          </header>
        
          <h1 class="article--post__title"><a href="/2018/05/building-serverless-contact-form-static-website/">Building A Serverless Contact Form For Your Static Site</a></h1>
        
          <footer class="article--post__stats">
            <ul>
              <li class="article--post__reading-time"><span class="small-caps">14</span> min read</li>
              <li class="article--post__comments-count">
              <a href="/2018/05/building-serverless-contact-form-static-website/#comments-building-serverless-contact-form-static-website">
                <span data-component="CommentsCount" data-insert="true" data-thread="/2018/05/building-serverless-contact-form-static-website/"><span><span class="small-caps">3</span> comments</span></span>
              </a>
              </li>
            </ul>
          </footer>
          <div class="article--post__content">
            <p class="article--post__teaser">
              <time datetime="2018-05-02" class="article--post__time">May 2, 2018 — </time>
        
              With the help of this article, you will finally be able to learn the basics of Amazon Web Services (AWS) Lambda and Simple Email Service (SES) APIs to help you build your own static site mailer on the Serverless Framework. Let’s get started! <a href="/2018/05/building-serverless-contact-form-static-website/" class="read-more-link"> Read More…</a>
            </p>
          </div>
        </div>
        <div class="article--post">
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
                <span data-component="CommentsCount" data-insert="true" data-thread="/2018/05/print-stylesheets-in-2018/"><span><span class="small-caps">2</span> comments</span></span>
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
        </div>
      </div>`;
      const $ = cheerio.load(html);
      const expected = [
        {
          author: 'Brian Holt',
          headline: 'Building A Serverless Contact Form For Your Static Site',
          pubDate: '2018-05-02',
          summary: 'With the help of this article, you will finally be able to learn the basics of Amazon Web Services (AWS) Lambda and Simple Email Service (SES) APIs to help you build your own static site mailer on the Serverless Framework. Let’s get started!',
          url: 'https://www.smashingmagazine.com/2018/05/building-serverless-contact-form-static-website/',
        }, {
          author: 'Rachel Andrew',
          headline: 'A Guide To The State Of Print Stylesheets In 2018',
          pubDate: '2018-05-01',
          summary: 'We have covered print stylesheets in the past here on Smashing Magazine. In this article, Rachel Andrew takes a look at the state of printing from the browser today.',
          url: 'https://www.smashingmagazine.com/2018/05/print-stylesheets-in-2018/',
        },
      ];
      const smashingParser = new SmashingParser($);
      smashingParser.articleSelector = '.article--post';
      const actual = smashingParser.articles;
      expect(actual).to.be.an('array');
      expect(actual).to.eql(expected);
    });

    it('should throw if no articles found', () => {
      const html = `<div class="col col-12">
        <article class="article--post">
          <header>
            <figure class="author author--small">
              <a href="/author/brian-holt">
                <div class="author__image-wrapper">
                  <div class="author__image">
                    
          <img src="//cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/131c56af-37b8-450c-8eb0-54a1908d1602/brian-holt-profile-pic-opt.jpeg" alt="Brian Holt">
        
                  </div>
                </div>
              </a>
            </figure>
            <span class="article--post__author-name grey"><a href="/author/brian-holt">Brian Holt</a> <span>wrote</span></span>
          </header>
        
          <h1 class="article--post__title"><a href="/2018/05/building-serverless-contact-form-static-website/">Building A Serverless Contact Form For Your Static Site</a></h1>
        
          <footer class="article--post__stats">
            <ul>
              <li class="article--post__reading-time"><span class="small-caps">14</span> min read</li>
              <li class="article--post__comments-count">
              <a href="/2018/05/building-serverless-contact-form-static-website/#comments-building-serverless-contact-form-static-website">
                <span data-component="CommentsCount" data-insert="true" data-thread="/2018/05/building-serverless-contact-form-static-website/"><span><span class="small-caps">3</span> comments</span></span>
              </a>
              </li>
            </ul>
          </footer>
          <div class="article--post__content">
            <p class="article--post__teaser">
              <time datetime="2018-05-02" class="article--post__time">May 2, 2018 — </time>
        
              With the help of this article, you will finally be able to learn the basics of Amazon Web Services (AWS) Lambda and Simple Email Service (SES) APIs to help you build your own static site mailer on the Serverless Framework. Let’s get started! <a href="/2018/05/building-serverless-contact-form-static-website/" class="read-more-link"> Read More…</a>
            </p>
          </div>
        </article>
        <article class="article--post">
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
                <span data-component="CommentsCount" data-insert="true" data-thread="/2018/05/print-stylesheets-in-2018/"><span><span class="small-caps">2</span> comments</span></span>
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
        </article>
      </div>`;
      const $ = cheerio.load(html);
      const smashingParser = new SmashingParser($);
      smashingParser.articleSelector = '.failed-selector';
      const shouldThrow = () => smashingParser.articles;
      expect(shouldThrow).to.throw('No articles found. Article selector: ".failed-selector"');
    });
  });
});
