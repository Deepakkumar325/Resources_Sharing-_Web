const mongoose = require("mongoose");
const { schema } = require("./Users");
const Schema = mongoose.Schema;
const answerSchema = new Schema({
    ans: { type: String, required: true },
    user: { type: String, required: true }
});
const answers = mongoose.model('Answers', answerSchema);
const questionSchema = new Schema({
    user: { type: String, required: true },
    question: { type: String, required: true },
    answers: [answerSchema],
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const questions = mongoose.model('Question', questionSchema)
module.exports = { questions, answers };