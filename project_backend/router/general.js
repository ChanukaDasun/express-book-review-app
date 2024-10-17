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
public_users.get('/', async function (req, res) {
  try {
    res.send(JSON.stringify(books, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    let isbn = req.params.isbn;
    if (books[isbn]) {
      res.send(books[isbn]);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    let author = req.params.author;

    // Return all books based on author
    const booksBasedonAuthor = () => {
      return new Promise((resolve) => {
        let bookNo = [];
        for (let key in books) {
          if (books[key].author === author) {
            bookNo.push(books[key]);
          }
        }
        resolve(bookNo.length > 0 ? bookNo : null);
      });
    };

    const result = await booksBasedonAuthor();
    
    if (result) {
      res.send(JSON.stringify(result, null, 4));
    } else {
      res.status(404).json({ message: "No books found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    let title = req.params.title;

    const booksBasedonTitle = () => {
      return new Promise((resolve) => {
        let bookNo = [];
        for (let key in books) {
          if (books[key].title === title) {
            bookNo.push(books[key]);
          }
        }
        resolve(bookNo.length > 0 ? bookNo : null);
      });
    };

    const result = await booksBasedonTitle();
    
    if (result) {
      res.send(JSON.stringify(result, null, 4));
    } else {
      res.status(404).json({ message: "No books found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
