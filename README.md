# Mongo News
A web app that lets users view and leave comments on the latest news from the [Smashing Magazine web site](https://www.smashingmagazine.com/).

## Live Demo
https://mongo-news-smash.herokuapp.com/

## Using the App
* 'Scrape New Articles' button checks for new articles, adds them to the database, and adds them to the page.
* Clicking on 'Save' will add the article to a list of saved articles.
* Clicking on 'Saved Articles' will show only articles that have been flagged as saved.
* Click on the 'Notes' button to view, add, and delete notes and comments about an article. An article must be saved for notes to be enable.
* If an article has been unsaved by clicking the 'Unsave' button, any notes are retained. However, the article must first be re-saved before notes can be viewed again.

## Getting Started

### Prerequesites
* NodeJS v6.11.2+ must be installed. Visit https://nodejs.org/en/download/
* Clone the repository. https://github.com/median-man/mongo-news

### Installation & Testing
1. Run `npm install`to install dependencies.
2. Run `npm test` to run all tests.

## Built With
* [Cheerio](https://cheerio.js.org/)
* [Mongoose](http://mongoosejs.com/)
* [Express](http://expressjs.com/) with [Morgan](https://github.com/expressjs/morgan)
* [Handlebars](http://handlebarsjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Spectre](https://picturepan2.github.io/spectre/index.html) CSS Framework
* Testing framework: [Mocha](https://mochajs.org/) & [Chai](http://chaijs.com/)

## Contributors
[John Desrosiers](https://github.com/median-man)
