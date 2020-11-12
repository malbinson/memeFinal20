const express = require('express');
const ejs = require('ejs');
const app = express()
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', ejs)
app.use(express.static("public"))

var Meme = require('./models/meme')
var Comment = require('./models/comment')

mongoose.connect("mongodb+srv://malbinson:berkeley01@cluster0.cvp0r.mongodb.net/hl_2020?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("db connected")
})

app.get("/", (req,res) => {
  Meme.find({isActive:true},(err,memes) => {
    res.render("list.ejs", {memes:memes})
  })
})

app.get("/add", (req,res) => {
  res.render("add.ejs")
})

app.post("/save", (req,res) => {
  var r = req.body;
  var o = {
    title:r.title,
    submittedBy:r.submittedBy,
    image:r.image,
    isSpicy:r.isSpicy == "on",
    isActive: true
  }
  var d = new Meme(o);
  d.save((err,meme) => {
    console.log(err)
    console.log(meme)
    res.redirect("/")
  })
})

app.post("/edit", (req,res) => {
  var r = req.body;
  var o = {
    title:r.title,
    submittedBy:r.submittedBy,
    image:r.image,
    isSpicy:r.isSpicy == "on"
  }
  Meme.findOneAndUpdate(r.id,o,{new:true},(err,meme) => {
    res.render("detail.ejs",{meme:meme})
  })
})


app.get("/detail/:id", (req,res) => {
  var id = req.params.id;
  Meme.findById(id,(err,meme) => {
    res.render("detail.ejs",{meme:meme})
  })
})

app.get("/edit/:id", (req,res) => {
  var id = req.params.id;
  Meme.findById(id,(err,meme) => {
    res.render("edit.ejs",{meme:meme})
  })
})

app.post("/comment/:id", (req,res) => {
  var id = req.params.id;
  console.log(req.body)
  var c = {
    name:req.body.name, 
    comment:req.body.comment,
    score:req.body.score,
    description: convertScore(req.body.score)  
  }
  console.log(c)
  var comment = new Comment(c)
  Meme.findById(id,(err,meme) => {
    meme.comments.push(comment);
    meme.save((err,meme) => {
      res.render("detail.ejs",{meme:meme});
    })
  })
})

function convertScore(score) {
  switch(score) {
    case '5': 
      return "A+";
      break;
    case '4': 
      return "solid";
      break;
    case '3': 
      return "tee hee";
      break;
    case '2': 
      return "meh";
      break;
    case '1': 
      return "weak";
      break;
    case '0': 
      return "wt heck?";
      break;
  }

}

app.listen(3000, () => {
  console.log('Server listening on port 3000...');
})