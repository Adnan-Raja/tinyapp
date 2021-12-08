const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
function generateRandomString() {
  let result = '';
  let length = 6;
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = length; i > 0; --i)
  result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca/",
  "9sm5xK": "http://www.google.com/"
};
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);         
});
// Long URL redirect 
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
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
// URLS page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});