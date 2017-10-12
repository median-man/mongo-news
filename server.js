/* Server.js is the entry point for the application. Start the app by running
 * 'npm start' */

// Vendor Dependencies
const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

// App modules
const scraper = require('./lib/scraper.js');
const articles = require('./routes/articles');
const comments = require('./routes/comments');

// Globals
const PORT = 8080;

// Models
const Article = require('./models/Article.js');
// const Comment = require('./models/Comment.js'); // TODO: add Comment model

// use es6 native promises with mongoose
mongoose.Promise = Promise;

// initialize express
const app = express();

// Initialize the database connection
mongoose.connect(config.DbHost, { useMongoClient: true } );
const db = mongoose.connection;
db.on('error', error => console.log('Mongoose Error: ', error));

// setup logging based on NODE_ENV. no logging if testing.
const env = config.util.getEnv('NODE_ENV');
if (env === 'dev') app.use(logger('dev'));
if (env !== 'dev' && env !== 'test') app.use(logger('tiny'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.static('public')); // TODO: add public dir and files

/* Routes
 * ==================================================================== */
app.get('/', (req, res) => res.send('TODO: serve landing page'));

// Route will scrape for articles and save them to the db.
app.get('/scrape', (req, res) => {
  // TODO drop all unsaved articles before scraping
  scraper()
    .then(scrapings => Article.create(scrapings))
    .catch(err => console.log(err));
  res.send('Scrape Complete');
});

app.get('/articles', articles.getArticles);
app.post('/articles/save', articles.saveArticle);
app.post('/articles/unsave', articles.unsaveArticle);

app.post('/comments', comments.addComment);

// start the server
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

module.exports = app;
