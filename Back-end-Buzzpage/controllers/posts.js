const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Post = require('../models/post.js');
const User = require('../models/user.js')
const router = express.Router();
const uploadFile = require('../middleware/upload-file.js');


const upload  = require('multer')();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

// create post return created post
router.post('/photoUpload',upload.single('photo'), async (req, res) => {
    try {
      if (req.file) {
          // updating the filename
          const regex = new RegExp(/[^a-zA-Z0-9\:]*/g);   
          const updatedName = req.file.originalname.replaceAll(regex, "");
          req.file.originalname = updatedName;

          // uploading to aws
          const uploadedPhoto = await uploadFile(req.file);

          // returning the link to aws photo link
          res.json(uploadedPhoto);
      } else {
          throw new Error('Must select a file');
      }
  } catch (err) {
      res.status(400).json(err.message);
  }
});

// create post return created post
router.post('/', async (req, res) => {
  try {
    req.body.author = req.user._id;
    const post = await Post.create(req.body);
    post._doc.author = req.user;

    // associate the post with the user object
    const user = await User.findById(req.user._id);
    user.posts.push(post._id);
    user.save();

    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// index to show all post "Hive Feed" return all posts
router.get('/', async (req, res) => {
    try {
      const posts = await Post.find({})
        .populate('author')
        .populate('comments').populate('author')
        .sort({ createdAt: 'desc' });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json(error);
    }
});

// show post by id and return post by id
router.get('/:postId', async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId).populate([
        'author',
        'comments.author',
      ]);
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json(error);
    }
});

// update post by ID return updated post by ID
router.put('/:postId', async (req, res) => {
    try {
      // Find the post:
      const post = await Post.findById(req.params.postId);
      const user = await User.findById(post.author);
    
      // Update Post:
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        req.body,
        { new: true }
      );
  
      // Append req.user to the author property:
      updatedPost._doc.author = user;
  
      // Issue JSON response:
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json(error);
    }
});


// delete post by ID and return deleted post
router.delete('/:postId', async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
  
      if (!post.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }

      // remove the post with the user object
      const user = await User.findById(req.user._id);
      user.posts = user.posts.filter(postId => !postId.equals(req.params.postId));
      user.save();
  
      const deletedPost = await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json(deletedPost);
    } catch (error) {
      res.status(500).json(error);
    }
});

// create a comment and return the the new comment
router.post('/:postId/comments', async (req, res) => {
  try {
    req.body.author = req.user._id;
    const author = await User.findById(req.user._id);
    req.body.authorName = author.username;
    req.body.post = req.params.postId;
    const posts = await Post.findById(req.params.postId);
    posts.comments.push(req.body);
    await posts.save();
    // Find the newly created comment:
    const newComment = posts.comments[posts.comments.length - 1];
    newComment._doc.author = req.user;
    // Respond with the newComment:
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update a comment and return "ok"
router.put('/:postId/comments/:commentId', async (req, res) => {
  try {
    req.body.author = req.user._id;
    req.body.post = req.params.postId;
    const post = await Post.findById(req.params.postId);
    const comment = post.comments.id(req.params.commentId);
    comment.text = req.body.text;
    await post.save();
    res.status(200).json({ message: 'Ok' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete comment and return "ok"
router.delete('/:postId/comments/:commentId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    post.comments.remove({ _id: req.params.commentId });
    await post.save();
    res.status(200).json({ message: 'Ok' });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;