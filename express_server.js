const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require('bcryptjs');
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");


app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: [
    "This one a secure key",
    "This is more secure"
  ],
   maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

function generateRandomString() {
  let result = '';
  let length = 6;
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = length; i > 0; --i)
  result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};


// helper function to authnticate user
const confirmPassword = (password, db) => {
  for(let key in db) {
    const passwordMatch = bcrypt.compareSync(password, db[key]["password"]);
    if (passwordMatch) {
    return true
    }
  }
  return false;
};

// helper function to see if email already registered
const getUserByEmail = (email, db) => {
  for(let key in db) {
    if (db[key]["email"] === email) {
    return true
    }
  }
  return false;
};

const fetchUserInformationID = (email, db) => {
  for(let key in db) {
    if (db[key]["email"] === email) {
    return db[key]
    }
  }
  return false;
};

const urlsForUserId = function(id) {
  const result = {};
  for (const shortURL in urlDatabase) {
    const urlObj = urlDatabase[shortURL];
    if (urlObj.userID === id) {
      result[shortURL] = urlObj;
    }
  }
  return result;
}

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

// Delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  //console.log(req.params.shortURL);
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls/");         // Redirect client to URLS page
});

// Change URL
app.post("/urls/:shortURL", (req, res) => {
  
  urlDatabase[req.params.shortURL]["longURL"] = req.body.longURL;
  //console.log(urlDatabase[req.params.shortURL["longURL"]])
  
  res.redirect("/urls/");         // Redirect client to URLS page
});

// Add new URL key:value pair
app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  shortURL = generateRandomString();
//console.log(req.body.longURL);
  urlDatabase[shortURL] = {
    shortURL,
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  
  res.redirect(`/urls/${shortURL}`);         
});

// Set cookie from login form
app.get("/login", (req, res) => {
  const templateVars = { 
   //urls: urlsForUser(urlDatabase, req.session.user_id),
    user: users[req.session.user_id]
  };
 res.render("urls_login", templateVars);
});


app.post("/login", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  
  const authenticPass = confirmPassword(password, users)
  const potentialUser = getUserByEmail(email, users);
  //check if user exists in database
  if (!potentialUser) {
    res.status(403);
    res.send('Error: User doesnt exists.');
  //checks if user enters correct password
  } else if (!authenticPass) {
    res.status(403);
    res.send('Error: Wrong password.');
    return res.redirect("/");
  } else {
  const realUserID = fetchUserInformationID(email, users);
  req.session.user_id = realUserID["id"];
  res.redirect("/urls");   
  }      
});

// Clear username cookie
app.post("/logout", (req, res) => {
  delete req.session.user_id
  res.redirect("/login")
});

// Long URL redirect 
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

// Homepage 
app.get("/", (req,res) => {
  res.send("hello!")
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</></body></html>\n");
});

// URLS pages
app.get("/urls", (req, res) => {
  const id = req.session.user_id;
 const user = users[id];
//  console.log(user)
//  console.log(id)
 if (!user) {
   return res.status(401).send(`You must login first <a href=/login>Click to Login </a>`);
 }
 const urls = urlsForUserId(id);
 

 const templateVars = {
   urls, 
   user,
   };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
const id = req.session.user_id;
const user = users[id];

 if(!user) {
 return res.redirect("/login") //access denied and redirected to login if user doesn't exit
} 
const urls = urlsForUserId(id);
const templateVars = { 
    urls,
    user: user};
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
 const id = req.session.user_id;
 const user = users[id];
 const templateVars = { 
  shortURL: req.params.shortURL, 
  longURL: urlDatabase[req.params.shortURL]["longURL"],
  user: user};
  res.render("urls_show", templateVars);
});

// Registration page
app.get("/register", (req, res) => {
  if(req.session.user_id) {
    res.redirect("/urls")
  }
    res.render("urls_register", {user:null});
});

//To register new users:
app.post("/register", (req, res) => {

const email = req.body.email;
const password = req.body.password;
const hashedPassword = bcrypt.hashSync(password, 10);
  
// check if email and password field is empty or not
  if (!email || !password) {
    res.status(400).send('Enter email and password to register.');
    res.redirect("/");
    return 
  }

  // Check if there is already a user with email
  const currentUser = getUserByEmail(email, users);
  if (currentUser) {
    res.status(400);
    res.send('Error: User already exists.');
    return 
  } else {

  const id = generateRandomString();
 
  //creating new user to register and add into users object
 
  users[id] = {
       id: id,
       email: req.body.email,
       password: bcrypt.hashSync(password, 10)
     //  hashedPassword: bcrypt.hashSync(password, 10) 
  };
   //console.log(users); // check
  // Add cookie for email
  req.session.user_id = id;
  res.redirect("/urls")    
}
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});