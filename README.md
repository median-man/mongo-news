# Mongo News
A web app that lets users view and leave comments on the latest news.

## Live Demo
coming soon

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequesites
* NodeJS v6.11.2+ must be installed. Visit https://nodejs.org/en/download/
* Clone the repository. https://github.com/median-man/mongo-news

### Installation & Testing
Run `npm install`to install dependencies.
Run `npm test` to run all tests.

## Built With
* [Cheerio](https://cheerio.js.org/)
* [Mongoose](http://mongoosejs.com/)
* [Express](http://expressjs.com/) with [Morgan](https://github.com/expressjs/morgan)
* [Handlebars](http://handlebarsjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Config](https://github.com/lorenwest/node-config)
* [Spectre](https://picturepan2.github.io/spectre/index.html) CSS Framework
* Testing framework: [Mocha](https://mochajs.org/) & [Chai](http://chaijs.com/)

## To Do
- [ ] Add checking to scraper.js for page structure. Throw an error if page structure has changed.
- [x] Setup initial server.js and implement an Article model (no comments yet)
- [x] Test and refactor server and Article model
- [x] Implement Article model. Test & Refactor
- [x] Design a front-end
- [ ] Fulfill all requirements found in [requirements.md](dev/requirements.md)

## Contributors
[John Desrosiers](https://github.com/median-man)