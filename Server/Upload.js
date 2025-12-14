let mongoose = require('mongoose');
let imageSchema = mongoose.Schema({
    // owner:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    imgUrl:{
        type:String,
        required:true
    },
    likesCount:{
        type:Number,
        default:0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   // reference to user model
        required: true
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
})

let Upload = mongoose.model('UploadImage',imageSchema);
module.exports = Upload;