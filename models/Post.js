const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true
    },

    comment: {
        type: String,
        required: true
    }

})
const voterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,

    },
    name: {
        type: String,
        required: true,

    },
})
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
    },
    authorEmail: {
        type: String,
        required: true,
    },
    sum: {
        type: String,
        required: true
    },
    filename: {
        type: 'string'
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public', // Set the default visibility to private
    },
    tags: [String],
    likes: [voterSchema],
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }

});

const Posts = mongoose.model('Post', postSchema);
const Voters = mongoose.model('Voter', voterSchema);
const Comments = mongoose.model('Comment', commentSchema);
module.exports = { Posts, Voters, Comments };