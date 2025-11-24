// Day: 51
// Date: 19/11/2025
// Day: Wednesday

let express = require('express')
let mongoose = require('mongoose')
let cors = require('cors')
let jwt = require('jsonwebtoken')
let User = require('./user')
let bcrypt = require('bcrypt')
let crypto = require('crypto');
let {sendEmail} = require('./sendEmail')
let Upload = require('./Upload');

// npm i mongoose
// npm i bcrypt

let app = express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb://127.0.0.1:27017/Instagram").
   then(() => {
      console.log("db conneted...");
   })

function checkRole(role){
   return (req, res, next)=>{
      let token = req.headers.authorization;
      if(!token){
         return res.send("Unauthorized User!")
      }
      else{
         let decodedToken = jwt.verify(token, "PRIVATESTRING");
         if(role !== decodedToken.role){
            return res.send("Access Denied!")
         }
         else{
            next()
         }
      }
   }
}

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

app.get('/public', (req, res) => {
   res.send("Anyone can access it")
})
app.get('/private', checkRole('admin'), (req, res) => {
   res.send("This is protected")
})
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
   
      let userData = new User({
         name,
         userName,
         email,
         passWord: updatedP
      })
      await userData.save()
      res.status(200).send("Account created")
   }
})

app.post('/login',async (req, res)=>{
   let {email, passWord} = req.body
   let userInfo = await User.findOne({email})
   if(!userInfo){
      res.send("Account not found!");
   }
   else{
      let validPass = await bcrypt.compare(passWord,userInfo.passWord);
      if(validPass){
         let token = jwt.sign({ email: userInfo.email, userName:userInfo.userName }, "PRIVATESTRING");
         console.log(token);
         // res.send(`Login successfully... Your token is: ${token}`);
         res.status(200).send(`${token}`);
      }
      else{
         res.status(404).send("Wrong Password");
      }
   }
})

app.post('/upload', async (req,res)=>{
   let {imgUrl} = req.body;
   if(!imgUrl){
      return res.send("Url not found");
   }
   let uploadData = new Upload({
      imgUrl
   })
   await uploadData.save();
   return res.send("Image Uploaded");
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