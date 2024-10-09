let posts = require('../mockdata/posts');
let pid = posts.length;

const getPosts = (req, res) => {
    res.send(posts);
};

const getPostById = (req, res) => {
    const post = posts.find(item => item.id == req.params.id);
    console.log(`${req.params.id}번 게시글을 전송합니다.`);
    res.send(post);
};

const createPost = (req, res) => {
    const data = req.body;
    data.id = pid++;
    posts.push(data);
    res.status(201).send({ message: 'Post created successfully', post: data });
};

const updatePost = (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const updatedData = req.body;
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        posts[postIndex] = { ...posts[postIndex], ...updatedData };
        res.status(200).send({ message: 'Post updated successfully', post: posts[postIndex] });
    } else {
        res.status(404).send({ message: 'Post not found' });
    }
};

const deletePost = (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        posts.splice(postIndex, 1);
        res.status(200).send({ message: 'Post deleted successfully' });
    } else {
        res.status(404).send({ message: 'Post not found' });
    }
};

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
