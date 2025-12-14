// Day: 57
// Date: 27/11/2025
// Day: Thursday

let express = require('express')
let mongoose = require('mongoose')
let cors = require('cors')
let jwt = require('jsonwebtoken')
let User = require('./user')
let bcrypt = require('bcrypt')
let crypto = require('crypto');
let {sendEmail} = require('./sendEmail')
let Upload = require('./Upload');
let Comment = require('./Comment');

// npm i mongoose
// npm i bcrypt

let app = express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb://127.0.0.1:27017/Instagram").
   then(() => {
      console.log("db conneted...");
   })

// function checkRole(role){
//    return (req, res, next)=>{
//       let token = req.headers.authorization;
//       if(!token){
//          return res.send("Unauthorized User!")
//       }
//       else{
//          let decodedToken = jwt.verify(token, "PRIVATESTRING");
//          if(role !== decodedToken.role){
//             return res.send("Access Denied!")
//          }
//          else{
//             next()
//          }
//       }
//    }
// }
function auth(req, res, next) {
    const token = req.headers.authorization;
   //  console.log("hello",token);
    if(!token) return res.status(401).json({ message: "Login first!" });

    try {
        const decoded = jwt.verify(token, "PRIVATESTRING");
        req.user = decoded;   // IMPORTANT: req.user yahi se aata hai
        console.log("decoded",decoded);
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

app.post('/reset-password', async (req, res)=>{
   const {email} = req.body;
   try{
      const user = await User.findOne({email});
      if(!user){
         return res.status(404).send('User Not Found');
      }
      const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 3600000;
      await user.save()

      // const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
      const resetUrl = `http://localhost:5173/reset/${resetToken}`
      await sendEmail(
         user.email,
         'Password Reset Request',
         `Click the link below to reset your password:\n\n${resetUrl}`
      );

      res.status(200).send('Password reset email sent');
   }
   catch(error){
      res.status(500).send('Error sending password reset email: ' + error.message);
   }
})

app.post('/reset-password/:token', async (req, res) => {
   const { token } = req.params;
   const { newPassword } = req.body;

   try {
   const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Check token validity
   });

   if (!user) {
      return res.status(400).send('Invalid or expired token');
   }

   // Hash the new password
   const hashedPassword = await bcrypt.hash(newPassword, 10);
   user.passWord = hashedPassword;
   user.resetToken = undefined;
   user.resetTokenExpiry = undefined;
   await user.save();

   res.status(200).send('Password reset successfully');
   } catch (error) {
   res.status(500).send('Error resetting password: ' + error.message);
   }
});

// app.get('/public', (req, res) => {
//    res.send("Anyone can access it")
// })
// app.get('/private', checkRole('admin'), (req, res) => {
//    res.send("This is protected")
// })
app.post('/create', async (req, res) => {
   let { name, userName, email, passWord } = req.body
   console.log(userName, email, "heheh");

   let user = await User.findOne({ email })
   console.log(user, "hiiii");

   if (user) {
      res.status(200).send("User already have an account")
   }
   else{
      let updatedP = await bcrypt.hash(passWord, 10)
      // console.log(updatedP, "HEH");
      let firstLetter = name[0].toUpperCase();
      const dp = `https://placehold.co/150x150/505050/ffffff?text=${firstLetter}`;
   
      let userData = new User({
         name,
         userName,
         email,
         passWord: updatedP,
         dp: dp
      })
      await userData.save()
      res.status(200).send("Account created")
   }
})

app.post('/login',async (req, res)=>{
   let {email, passWord} = req.body
   let userInfo = await User.findOne({email})
   if(!userInfo){
      res.status(402).send("Account not found!");
   }
   else{
      let validPass = await bcrypt.compare(passWord,userInfo.passWord);
      if(validPass){
         let token = jwt.sign({_id:userInfo._id, email: userInfo.email, userName:userInfo.userName }, "PRIVATESTRING");
         console.log(token);
         // res.send(`Login successfully... Your token is: ${token}`);
         res.status(200).send(`${token}`);
      }
      else{
         res.status(404).send("Wrong Password");
      }
   }
})

app.post('/upload', auth, async (req,res)=>{
   const userId = req.user._id;
   let {imgUrl} = req.body;
   if(!imgUrl){
      return res.send("Url not found");
   }
   let uploadData = new Upload({
      imgUrl,
      user: userId,
      likedBy: []
   })
   await uploadData.save();
   return res.send("Image Uploaded");
})

app.get('/posts', auth, async(req, res)=>{
   // console.log("Arrived here");
   try{
      let data = await Upload.find().populate('user', 'userName dp');
      // res.json(data);
      // for(let i=0; i<data.length; i++){
      //    // console.log(data[i].user);
      //    let userName = await User.findById(data[i].user);
      //    data[i].userName = userName.userName;
      //    console.log(data[i]);
      // }
      res.send(data);
   }
   catch(error){
      console.log(error);
      res.status(500).send("Server Error!");
   }
})

app.post("/like/:id", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Upload.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

   
    post.likedBy = post.likedBy.filter(id => id !== null);


    const alreadyLiked = post.likedBy.some(
      id => id.toString() === userId.toString()
    );

    // --------------------------------
    // 🔴 UNLIKE (agar like kiya hua hai)
    // --------------------------------
    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());
      post.likesCount = Math.max(0, post.likesCount - 1);

      await post.save();
      return res.json({
        success: true,
        message: "Disliked",
        likesCount: post.likesCount
      });
    }

    // --------------------------------
    // 🟢 LIKE (agar pehle like nahi kiya)
    // --------------------------------
    post.likedBy.push(userId);
    post.likesCount += 1;

    await post.save();
    return res.json({
      success: true,
      message: "Liked",
      likesCount: post.likesCount
    });

  } catch (err) {
    console.log("LIKE API ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post('/follow/:id',auth,async (req, res)=>{
   let targetUserId = req.params.id;
   let currentUserId = req.user._id;
   if(targetUserId == currentUserId){
      return res.status(402).json({msg:"Are you joking..."});
   }
   let targetUser = await User.findById(targetUserId);
   let currentUser = await User.findById(currentUserId);
   if(!currentUser || !targetUser){
      return res.status(404).send({msg:"User not found"})
   }
   let alreadyFollow = currentUser.following.includes(targetUserId);
   // Unfollow
   if(alreadyFollow){
      currentUser.following = currentUser.following.filter(
         id => id.toString() !== targetUserId.toString()
      );

      targetUser.followers = targetUser.followers.filter(
         id => id.toString() !== currentUserId.toString()
      );
      await currentUser.save();
      await targetUser.save();
      return res.status(200).json({msg:"Unfollowed"});
   }

   // Follow
   currentUser.following.push(targetUserId);
   targetUser.followers.push(currentUserId);
   await currentUser.save();
   await targetUser.save();
   return res.status(200).json({msg:"Followed"});
})

// Search user
app.post("/search", async (req,res)=>{
   let query = req.query.q;
   if(!query){
      return res.send("Query Not Found!");
   }
   let isMatch = await User.find({
      $or:[
         {name:{$regex:query, $options:"i"}},
         {email:{$regex:query, $options:"i"}}
      ]
   }).select("-passWord").limit(5)  // Here - denotes that it is not sent
   console.log(isMatch);
   return res.json({msg:isMatch});
})

// Comment
app.post('/comment/:id', auth, async (req, res)=>{
   try {
      const postId = req.params.id;
      const userId = req.user._id;
      const {text} = req.body;

      if(!text || !userId || !postId){
         return res.status(400).json({msg: "text, userId, postId required"})
      }
      const post = await Upload.findById(postId);
      if(!post){
         return res.status(402).json({msg: "Post Not Found!"});
      }
      const newComment = new Comment({
         text,
         postId,
         userId
      });
      console.log(newComment._id);
      
      await newComment.save();

      post.comments.push(newComment._id);
      await post.save();
      return res.status(201).json({msg:"Commented", comment: newComment})
   }
   catch(error){
      return res.status(404).send(error);
   }
})

app.post('/deleteComment/:commentId', auth, async (req, res)=>{
   try{
      const commentId = req.params.commentId;
      const currentUserId = req.user._id;
      if(!commentId){
         return res.status(400).json({msg:"commentId required"});
      }
      const comment = await Comment.findById(commentId);
      if(!comment){
         return res.status(404).json({msg:"Comment not found!"});
      }
      if(comment.userId.toString() !== currentUserId.toString()){
         return res.status(403).json({msg: "You can only delete your own comment!"});
      }
      let post = await Upload.findById(comment.postId);
      if(!post){
         return res.status(401).json({msg: "Post Not found!"});
      }
      post.comments = post.comments.filter((a)=>{
         return a.toString() !== commentId.toString();
      })
      await post.save();
      await Comment.deleteOne({_id: commentId});
      return res.status(200).json({msg: "Comment Deleted!", postId: post._id})
   }
   catch(error){
      return res.send(error);
   }
})

app.get('/getComments/:postId', auth, async(req, res)=>{
   const postId = req.params.postId;
   if(!postId){
      return res.status(403).json({msg: "postId required!"});
   }
   let post = await Upload.findById(postId);
   if(!post){
      return res.status(402).json({msg: "Post Not Found!"});
   }
   let comments = await Comment.find({postId:postId}).populate('userId', 'userName dp');
   // console.log(comments);
   return res.status(200).send(comments);
})

app.get('/myProfile', auth, async (req, res)=>{
   const userId = req.user._id;
   if(!userId){
      return res.status(401).send("Invalid User!");
   }
   const data = await User.findById(userId).select("-passWord");
   // console.log(data);
   return res.status(200).send(data);
})

app.get('/myPosts', auth, async (req, res)=>{
   const userId = req.user._id;
   if(!userId){
      return res.status(401).send("Invalid User!");
   }
   const data = await Upload.find({user:userId});
   // console.log(data);
   return res.status(200).send(data);
})

app.listen(4000, () => {
   console.log("server running on port no 4000");
})

// use dbs


// Commands:
// npm init
// npm i express
// npm i -g nodemon
// npx nodemon start
// mongosh
// npm i mongoose