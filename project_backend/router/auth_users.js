const express = require('express');
const JWT = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  let usersWithSameName = users.filter((user) => {user.username === username});
  if (usersWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  let authUsers = users.filter((user) => {return user.username === username && user.password === password});
  if (authUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log(`Received username: ${username}, password: ${password}`);

  if (!username && !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = JWT.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  // extract username from the session
  let username = req.session.authorization['username'];
  let review = req.body.review;

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  let reviewsBasedonISBN = books[isbn].reviews;

  if (!reviewsBasedonISBN[username]){
    // Add new review
    reviewsBasedonISBN[username] = review;
    res.status(201).json({ message: "review successfully added", data: {username: review} });
  } else {
    // current user update review
    books[isbn].reviews[username] = review;
    res.status(200).json({ message: "new review successfully updated", data: review });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (isbn) {
    delete books[isbn];
    res.send("successfully delete");
  }
  return res.status(400).json({message: "not found required parameres"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
