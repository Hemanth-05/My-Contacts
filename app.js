//jshint esversion:6
const express = require('express');
const mongoose = require("mongoose");
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect(process.env.URI , { useNewUrlParser : true, useUnifiedTopology : true})
.then((res)=>console.log('Mongodb connnected'))
.catch(err=>console.log("Error connecting mondodb"));

const userSchema = {
   email: String,
   password: String,
}
const User = new mongoose.model("User", userSchema);

/* 
Routes
/ -> Home page route
/login -> login page route
/register -> register page route
*/ 
// Home route
app.get('/' , (req , res)=>{
   res.render("Home");
})


// Register route
app.get('/register', (req, res) => {
   res.render("register");
});
app.post('/register', (req, res) => {
   const newUser = new User({
      email: req.body.email,
      password: req.body.password
   });
   newUser.save(function(err){
      if(err)
      console.log(err);
      else
      res.render('profile');
   })
});

// Login route
app.get('/login', (req, res) => {
   res.render("login");
});
app.post('/login', (req, res) => {
   const email = req.body.email;
   const password = req.body.password;
   
   User.findOne({email: email}, function(err, foundUser) {
      if(err) {
         console.log(err);
      } else{
         if(foundUser.password === password ) {
            res.redirect("/contact");
         }
      }
   })
});

// contact route

const contactSchema = {
   username: String,
   phone: String,
   email: String
}
const Contact = new mongoose.model("Contact", contactSchema);

app.get('/contact', (req, res) => {
   Contact.find({}, function (err, foundItems) {
		res.render("contact", { contactList: foundItems }); // Pass the data to the list.ejs
	});
});
app.post('/contact', (req, res) => {
   const newContact = new Contact({
      username : req.body.name,
      phone : req.body.phone,
      email: req.body.email
   });
   newContact.save(function(err){
      if(err)
      console.log(err);
      else
      res.redirect('/contact');
   })
});

app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))