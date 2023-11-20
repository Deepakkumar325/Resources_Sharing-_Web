
const express = require('express');
const router = express.Router();
const Questions = require('../models/questions').questions
const Answers = require('../models/questions').answers;
router.get('/', async (req, res) => {
    let questions = await Questions.find({});
    res.render('main/q&a', { user: req.user, questions: questions });

});
router.post('/', async (req, res) => {
    question = req.body.question;
    console.log("and" + question);
    const tags = req.body.tags.split(' ');
    const querry = new Questions({
        user: req.user.name,
        question: question,
        tags: tags
    });


    const response = await querry.save()
    console.log(response)
    req.flash('success_msg', "Question has been successfully posted");
    res.redirect('/qna');
});
router.post('/answers/:id&:comment', async (req, res) => {

    let post = await Questions.findById(req.params.id);
    try {
        console.log(post);
        let writer = req.user;
        let comment = new Answers({
            user: req.user.name,
            ans: req.params.comment,

        });
        post.answers.push(comment);
        post = await post.save();
        res.json({
            status: "success",
            username: comment.user,
            comment: comment.ans
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
router.post('/search', async (req, res) => {
    const tags = req.body.tags.split(' ');
    console.log(tags);
    reqPosts = [];
    const questions = await Questions.find({});
    tags.forEach(t => {
        t = t.toUpperCase();
        questions.forEach(q => {
            if (reqPosts.findIndex(r => r == q) == -1 && q.tags.findIndex(tag => tag == t) != -1)
                reqPosts.push(q);
        })
    })
    // console.log("reqPosts:" + reqPosts);
    res.render('main/q&a', { user: req.user, questions: reqPosts });




})
module.exports = router;
