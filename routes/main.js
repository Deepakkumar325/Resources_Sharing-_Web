const express = require('express');
const router = express.Router();
const upload = require('../utils/fileStore');
const Posts = require('../models/Post').Posts;
const Voter = require('../models/Post').Voters;
const Comments = require('../models/Post').Comments;
const sendMail = require('../services/emailService');
const Post = require('../models/Post');
const User = require('../models/Users')
const mongoose = require('mongoose')
 
const ensureAuthenticated = require('../config/auth')

router.get('/', async (req, res) => {
    let posts = await Posts.find({});
    console.log(posts);
    // Posts.deleteMany()
    res.render('main/dashboard', { user: req.user.name, posts: posts });
});
router.get('/new', (req, res) => {
    res.render('main/new', { user: req.user });
});


 
  
router.post('/new', upload.single('file'), async (req, res) => {
    try {
        const tags = req.body.tags.split(' ');

        const newPost =   new Posts({
            title: req.body.title,
            sum: req.body.sum,
            author: req.user.name,
            tags: tags,
            authorEmail: req.user.email,
            filename: req.file.filename,
            visibility: req.body.visibility, // Add this line to capture visibility
            id: req.user._id
        });

        const savedPost = await newPost.save();

         await User.findByIdAndUpdate(
            req.user._id,
            { $push: { files: savedPost._id } },
            { new: true }
        );

        
        req.flash('success_msg', 'Post added successfully.');
        res.redirect('/myfile');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error adding post.');
        res.redirect('main/new'); // Redirect to the dashboard or handle the error appropriately
    }
});
 








router.post('/toggleLikes/:id', async (req, res) => {
    const id = req.params.id;
    console.log("id is: " + id);
    const post = await Posts.findById(id);
    console.log("post is: " + post);

    if (post == null) {
        console.log('null');
        res.json({
            status: "error",
            status: "error",
            message: "Post does not exist"
        });
    }
    else {

        let upvoters = post.likes;
        console.log("upvoters are" + upvoters)
        let index = upvoters.findIndex(upvoter => {
            console.log(upvoter.email);
            console.log(req.user.email);
            return upvoter.email == req.user.email
        });
        console.log(index + " is the index ");
        if (index == -1) {

            let voter = new Voter({
                email: req.user.email,
                name: req.user.name
            });
            post.likes.push(voter);

            await post.save();
            console.log(post.likes);
            res.json({
                status: 'like',
                message: "Post has been liked"
            });
        }
        else {

            post.likes.splice(index, 1);

            await post.save();
            console.log(post.likes);
            res.json({
                status: 'unlike',
                message: "Post has been unliked"
            });
        }
    }


});
router.post('/:id&:comment', async (req, res) => {

    let post = await Posts.findById(req.params.id);
    try {
        console.log(post);
        let writer = req.user;
        let comment = new Comments({
            name: req.user.name,
            comment: req.params.comment,
            email: req.user.email
        });
        post.comments.push(comment);
        post = await post.save();
        res.json({
            status: "success",
            username: comment.name,
            comment: comment.comment
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            status: "failure",

            message: "Comment was not posted"
        });
    }

});
router.post('/search',ensureAuthenticated, async (req, res) => {
    const tags = req.body.tags.split(' ');
    console.log(tags);
    reqPosts = [];
    const posts = await Posts.find({});
    tags.forEach(t => {
        t = t.toUpperCase();
        posts.forEach(p => {
            if (reqPosts.findIndex(r => r == p) == -1 && p.tags.findIndex(tag => tag.toUpperCase() == t) != -1)
                reqPosts.push(p);
        })


    })
    // console.log("reqPosts:" + reqPosts);
    res.render('main/dashboard', { user: req.user.name, posts: reqPosts });

});

router.post('/sendmail/:id', async (req, res) => {
    const id = req.params.id;
    let post = await Posts.findById(id);
    let link = `${process.env.baseurl}/docs/${post.filename}`;
    console.log(link);
    await sendMail({
        to: req.user.email, subject: 'File request', text: 'Do not reply', html: require('../services/emailTemplate')(
            {
                emailFrom: process.env.MAIL_USER,
                downloadLink: link
            }
        )
    });
    res.json({
        status: "success",
        message: "Mail sent succesfully..."
    });
 
})




module.exports = router;