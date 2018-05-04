const bodyParser = require('body-parser');
const express = require('express');
const exphbs = require('express-handlebars');
const logger = require('morgan');
const mongoose = require('mongoose');

const articles = require('./controllers/articles');
const comments = require('./controllers/comments');
const html = require('./controllers/html');

const PORT = process.env.PORT || 8080;

mongoose.Promise = Promise;

const app = express();

const dbUri = process.env.MONGODB_URI || 'mongodb://localhost/mongonews';
mongoose.connect(dbUri, { useMongoClient: true });
const db = mongoose.connection;
db.on('error', error => console.log('Mongoose Error: ', error));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.get('/', html.getRoot);
app.get('/saved', html.getSaved);
app.get('/articles', articles.getArticles);
app.route('/articles/save')
  .get(articles.getSaved)
  .post(articles.saveArticle);
app.get('/articles/scrape', articles.scrapeNew);
app.post('/articles/unsave', articles.unsaveArticle);
app.route('/comments/:articleId')
  .delete(comments.deleteComment)
  .get(comments.getComments)
  .post(comments.addComment);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));

module.exports = app;
