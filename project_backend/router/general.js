const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      return res.status(409).json({message: "user already exist!"});
    } else {
      // Add the new user to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
  }

  return res.status(400).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;

  // return all bookNo based on author
  let booksBasedonAuthor = () => {
    let bookNo = [] 
    for (let key in books) {
      if (books[key].author === author) {
        bookNo.push(books[key]);
      }
    }
    return bookNo.length > 0 ? bookNo : null;
  }

  if (booksBasedonAuthor().length > 0) {
    res.send(JSON.stringify(booksBasedonAuthor(), null, 4));
  } else {
    res.status(404).json({ message: "no books founded! "});
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let booksBasedonTitle = () => {
    let bookNo = [] 
    for (let key in books) {
      if (books[key].title === title) {
        bookNo.push(books[key]);
      }
    }
    return bookNo.length > 0 ? bookNo : null;
  }
  if (booksBasedonTitle().length > 0) {
    res.send(JSON.stringify(booksBasedonTitle(), null, 4));
  } else {
    res.status(404).json({ message: "no books founded! "});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
