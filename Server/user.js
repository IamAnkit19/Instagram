let mongoose= require('mongoose')

let userSchema = mongoose.Schema({
    name:{
        type:String
    },
    userName:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    passWord:{
        type:String
    },
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dp:{
        type:String
    },
    closeFriends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    // posts:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Upload"
    // }],
    resetToken: String,
    resetTokenExpiry: Date
})

let User = mongoose.model("User",userSchema)
module.exports=User