const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const fs = require("fs");
const PDFDocument = require("pdfkit-table");

var session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.use(session({
  secret: "success",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// mongoose.connect("mongodb://localhost:27017/userDB");
mongoose.connect("mongodb+srv://sinehan001:%40Mongodb001@cluster0.3y9rlfp.mongodb.net/Users?retryWrites=true&w=majority");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  secret: String
}, 
{ collection : 'Users' });

const userSchema1 = new mongoose.Schema({
  _id: String,
  floor: String,
  garbage: String,
  status: String
}, 
{ collection : 'Garbage' });

userSchema.plugin(passportLocalMongoose);


const User = mongoose.model("User", userSchema)
const Garbage = mongoose.model("Garbage", userSchema1)

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
  res.render("register");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});

// Sending the response for '/' path
app.get('/data' , (req,res)=>{
  Garbage.find({}, function (err, docs) {
  if (err){
      console.log(err);
  }
  else{
    res.send(docs);
  }
}).sort({floor: 1, garbage: 1});
});
app.get("/home", function(req, res) {
  res.render('index');
});

app.get("/data", function(req, res) {
  res.render('data');
  if(req.isAuthenticated()) {
    res.render('data');
  }
  else {
    res.redirect("/login");
  }
});

app.get("/secrets", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/footer1", function(req, res) {
  res.render("footer1");
});

app.get("/home", function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.isAuthenticated()) {
  } else {
    res.redirect("/login");
  }

});

app.get("/submit", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.get('/logout', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});


app.post("/register", function(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/login")
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/home");
      });
    }
  })

});
app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/home");
      })
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
