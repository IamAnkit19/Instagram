let mongoose= require('mongoose')

let userSchema = mongoose.Schema({
    name:{
        type:String
    },
    userName:{
        type:String
    },
    email:{
        type:String
    },
    passWord:{
        type:String
    },
    // role:{
    //     type:String,
    //     enum:["user","admin","instructor"],
    //     default:"user"
    // },
    resetToken: String,
    resetTokenExpiry: Date
})

let User = mongoose.model("user",userSchema)
module.exports=User