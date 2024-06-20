require('dotenv').config()
const express = require('express')
const cors = require("cors");
const mongoose = require("mongoose");  
const app = express();
const User = require("./models/User")
const Post = require("./models/Post")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require('multer')
const uploadMiddleware = multer({ dest: 'uploads/'})
const secret = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);
const fs = require('fs');




app.use(cors({
    credentials:true, 
    origin: "https://reactgirlysocialnetwork-backend-dzs8.onrender.com",
}));
app.use(express.json())
app.use(cookieParser()); 
app.use('/uploads', express.static(__dirname + "/uploads"))


mongoose.connect(process.env.MONGO_URL);


app.get("/", (req, res) => {
    res.json("Vse rabotaet, privetiki!!!11")
})

app.post("/register", async (req, res) => {
    const {username, password} = req.body;
    try{
        const userDoc = await User.create({
            username,
            password:bcrypt.hashSync(password,salt),});
        res.json(userDoc);
    } catch(e) {
        res.status(400).json(e);
    }
});

app.post ("/login", async (req, res) => {
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        if (!passOk) {
            return res.status(400).json({error: "Invalid password"});
        } else 
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
            });
        })
    } else {
        res.status(400).json("Wrong!!!")
    }
});
 
app.get("/profile", (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            return res.json(err);
        } res.json(info); 
    })
})

app.post("/logout", (req, res) => {
    res.cookie('token', '').json("ok")
})

app.post("/post", uploadMiddleware.single('file'), async (req, res) => {
/*     const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length -1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath)  */

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        const {title, summary, content, image} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            image, 
            author:info.id,
        });
        res.json({postDoc});
    });

})


app.get("/post", async (req, res) => {
    res.json(
        await Post.find() 
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(30)
    );
})

app.get("/post/:id", async (req, res) => {
    id = req.params.id

    const postId = await Post.findById(id)
    res.json(postId);
})

app.get("/userProfile/:username", async (req, res) => { 
    const user = await User.findOne({ username: req.params.username})
    if (!user) {
        return res.status(404).json({message: "Ты дурашка та ещё!!!"});
    } 
    res.json({username: user.username});
})

app.get("/userProfile/posts/:User", async (req, res) => {
    const userId = req.params.User

    const posts = await Post.find({ User: userId});
    if (!posts) {
        return res.status(404).json({message: "Не правильно!!!"})
    }  
    res.json(posts);
})


app.listen(process.env.PORT, () => {
    console.log("Meeeeow");
});

