let comments = require('../mockdata/comments');
let cid = comments.length;

const getCommentsByPostId = (req, res) => {
    const commentsOfPost = comments.filter(comment => comment.postId == req.params.id);
    res.send(commentsOfPost);
};

const createComment = (req, res) => {
    const data = req.body;
    data.id = cid++;
    comments.push(data);
    res.status(201).send({ message: 'Comment created successfully', comment: data });
};

module.exports = {
    getCommentsByPostId,
    createComment
};
