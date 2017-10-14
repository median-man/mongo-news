/* Server.js is the entry point for the application. Start the app by running
 * 'npm start' */

// Vendor Dependencies
const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const exphbs = require('express-handlebars');
const logger = require('morgan');
const mongoose = require('mongoose');

// routes modules
const articles = require('./routes/articles');
const comments = require('./routes/comments');
const html = require('./routes/html');

// Globals
const PORT = 8080;

// use es6 native promises with mongoose
mongoose.Promise = Promise;

// initialize express
const app = express();

// Initialize the database connection
let dbUri = process.eventNames.MONGODB_URI || config.DbHost;
mongoose.connect(dbUri, { useMongoClient: true });
const db = mongoose.connection;
db.on('error', error => console.log('Mongoose Error: ', error));

// setup logging based on NODE_ENV. no logging if testing.
const env = config.util.getEnv('NODE_ENV');
if (env === 'dev') app.use(logger('dev'));
if (env !== 'dev' && env !== 'test') app.use(logger('tiny'));

// use body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use handlebars for rendering html
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// use static files
app.use(express.static('public'));

/* Routes
 * ==================================================================== */

// html routes
app.get('/', html.getRoot);
app.get('/saved', html.getSaved);

// articles api routes
app.get('/articles', articles.getArticles);
app.route('/articles/save')
  .get(articles.getSaved)
  .post(articles.saveArticle);
app.get('/articles/scrape', articles.scrapeNew);
app.post('/articles/unsave', articles.unsaveArticle);

// comments api routes
app.route('/comments/:articleId')
  .delete(comments.deleteComment)
  .get(comments.getComments)
  .post(comments.addComment);

// start the server
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

module.exports = app;
