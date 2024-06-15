const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User=require("./models/User");
const bcrypt=require('bcryptjs');
const salt=bcrypt.genSaltSync(10);
const jwt=require('jsonwebtoken');
const secret="fasdfjao13rjofnawv342f";
const cookieParser=require('cookie-parser');
const Post=require('./models/Post');
const multer=require('multer');
const uploadMiddleware=multer({dest:'uploads/'});
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(cookieParser());

mongoose.connect(
  "mongourl"
);
app.use(cors({credentials:true,origin:'http://localhost:3000'}));

app.use(express.json());
app.post("/register", async(req, res) => {
  const {username,password } = req.body;
  try{
    const userDoc=await User.create({username,password:bcrypt.hashSync(password,salt)});
    res.json(userDoc);
  }catch(e){
    res.status(400).json(e);
  }
});

app.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    const userDoc=await User.findOne({username});
    const Userok=bcrypt.compareSync(password,userDoc.password);
    
    if(Userok){
        jwt.sign({username,id:userDoc._id},secret,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token',token).json({
              id:userDoc._id,
              username,
            });
        })
    }
});
app.get('/profile',(req,res)=>{
  const {token}=req.cookies;
  jwt.verify(token,secret,{},(err,info)=>{
    if(err) throw err;
    res.json(info);
  })
})
app.post('/logout',(req,res)=>{
  res.cookie('token','').json('ok');
});
const fs = require('fs').promises;

app.post('/post', uploadMiddleware.single('file'), (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.rename(path, newPath)
    .then(() => {
      const { title, summary, content } = req.body;

  const {token}=req.cookies;
  jwt.verify(token,secret,{},(err,info)=>{
    if (err) throw err;
    return Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author:info.id,
    });
  })
  .then(PostDoc => {
    // Handle success
    res.status(201).json(PostDoc);
  })
  .catch(error => {
    // Handle error
    res.status(500).json({ error: error.message });
  });
  })
  
      
      
});
app.get('/post',async(req,res)=>{
  res.json(await Post.find()
  .populate('author',['username'])
  .sort({createdAt:-1})
  .limit(20)

);
});

app.get('/post/:id',async(req,res)=>{
  const {id}=req.params;
  const postDoc=await Post.findById(id).populate("author",['username'])
  res.json(postDoc);
})
app.put('/post',uploadMiddleware.single('file'),async(req,res)=>{
  res.json({fileIs:req.file});
  let newPath=null;
  if(req.file){
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.rename(path, newPath);

  }
  const {token}=req.cookies;
  jwt.verify(token,secret,{},async(err,info)=>{
    if(err) throw err;
    const {id,title,summary,content}=req.body;
    const PostDoc=await Post.findById(id);
    const isAuthor=JSON.stringify(PostDoc.author)===JSON.stringify(info.id);
    if(!isAuthor){
      return res.status(400).json("You are not the author");
    }
    await PostDoc.update({title,summary,content,cover:newPath?newPath:PostDoc.cover,});
    res.json(PostDoc);


  })
})
app.listen(4000);
