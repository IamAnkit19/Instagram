let mongoose = require('mongoose');
let commentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   // reference to user model
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Upload",   // reference to upload model
        required: true
    },
    text:{
        type: String,
        required: true
    }
})

let Comment = mongoose.model('Comment',commentSchema);
module.exports = Comment;