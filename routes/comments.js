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
      { $push: { comments: comment._id } },
      {}, // no options
      (articleErr) => {
        if (articleErr) return res.status(400).send(articleErr);
        return res.json(newComment); // send new comment to client
      }
    );
  });
}

module.exports = { addComment };
