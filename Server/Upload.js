let mongoose = require('mongoose');
let imageSchema = mongoose.Schema({
    // name:{
    //     type:String
    // },
    imgUrl:{
        type:String,
        required:true
    },
    likesCount:{
        type:Number,
        default:0
    }
})

let Upload = mongoose.model('UploadImage',imageSchema);
module.exports = Upload;