const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Post = require('../models/post.js');
const verifyToken = require('../middleware/verify-token.js');

// return the user object if authorized else throw an error
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('posts');
        if (!user) {
            res.status(404)
            throw new Error('Profile not found.');
        }
        res.json({user});
    } catch (error) {
        if (res.statusCode === 404) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// update and return the user object
router.put('/:userId', verifyToken, async (req, res) => {
    try {
        // req.user is set using verifyToken
        if (req.user._id !== req.params.userId){
            return res.status(401).json({ error: "Unauthorized"})
        }
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404)
            throw new Error('Profile not found.');
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            req.body,
            {new:true}
        )
        res.json(updatedUser);
    } catch (error) {
        if (res.statusCode === 404) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});


/*----------------------test route--------------------- */

// test on deleting all users comments
router.delete('/:userId/test', async (req, res) => {
    const posts = await Post.find({})
        
    //loops through comments in every post and delete all user comments

    posts.forEach( async (post,x) => {
        post.comments.forEach( async (com) => {
            if(com.author._id == req.params.userId){
                await post.comments.remove({ _id: com._id });
            } 
        })   
        await post.save();      
    })
    
    res.json(posts);
});

/*--------------------------------------------------------- */

// deletes the user 
router.delete('/:userId', verifyToken, async (req, res) => {
    try {
        // checks to see if current user is authorized 
        if (req.user._id !== req.params.userId){
            return res.status(401).json({ error: "Unauthorized"})
        }
        //checks to see if th user exists
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404)
            throw new Error('Profile not found.');
        }

        //gets all users posts
        const posts = await Post.find({})
        //filter all users posts to geet current user posts
        const delPost = await posts.filter((po) => po.author._id == req.params.userId)

        

        //deletes all posts from current user
        delPost.forEach( async (post) => {
            await Post.findByIdAndDelete(post._id)
        })

        //deletes the current user
        const deleteUser = await User.findByIdAndDelete(
            req.params.userId
        )
        res.status(200).json(deleteUser);
    } catch (error) {
        if (res.statusCode === 404) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;