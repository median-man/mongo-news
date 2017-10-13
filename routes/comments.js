const Article = require('../models/Article');
const Comment = require('../models/Comment');

// Adds a new comment and sends and object back to client
// req.params.articleId = id of corresponding article
function addComment(req, res) {
  const newComment = new Comment(req.body);
  newComment.save((commentErr, comment) => {
    if (commentErr) return res.status(400).send(commentErr);

    // add the comment id to associated article
    return Article.findByIdAndUpdate(
      req.params.articleId,
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
  // get parameters from the request
  const { articleId } = req.params;
  const { commentId } = req.body;

  // delete comment by id
  Comment.remove({ _id: commentId })

    // remove the comment from the article
    .then(() => Article.findOneAndUpdate(
      { _id: articleId },
      { $pull: { comments: commentId } }, // eslint-disable-line no-underscore-dangle
      { new: true }
    ))

    // send the article to the client or the error if an error occurs
    .then(article => res.json({ message: 'Comment succesfully deleted.', article }))
    .catch(err => res.status(400).json({ message: err.message }));
}

// Send json array of comments for an article to client. Expects request to provide article id.
function getComments(req, res) {
  Article
    .findOne({ _id: req.params.articleId })
    .populate('comments')

    // return all comments for that article
    .then(doc => res.json(doc.comments))
    .catch(err => res.status(404).send(err.message));
}

module.exports = { addComment, deleteComment, getComments };
