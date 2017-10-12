const Article = require('../models/Article');
const Comment = require('../models/Comment');

// Adds a new comment and sends and object back to client
// req.body.articleId = id of corresponding article
function addComment(req, res) {
  const newComment = new Comment(req.body);
  newComment.save((commentErr, comment) => {
    if (commentErr) return res.status(400).send(commentErr);

    // add the comment id to associated article
    return Article.findByIdAndUpdate(
      req.body.articleId,
      { $push: { comments: comment._id } }, // eslint-disable-line no-underscore-dangle
      {}, // no options
      (articleErr) => {
        if (articleErr) return res.status(400).send(articleErr);
        return res.json(newComment); // send new comment to client
      }
    );
  });
}

// Deletes comment and sends text confirmation to client
function deleteComment(req, res) {
  // TODO
}

// Send json array of comments for an article to client
function getComments(req, res) {
  // TODO
  // get array of comment ids for the article
  Article
    .findOne({ _id: req.params.articleId })
    .populate('comments')

    // return all comments for that article
    .then(doc => res.json(doc.comments))
    .catch(err => res.status(404).send(err.message));
}

module.exports = { addComment, deleteComment, getComments };
