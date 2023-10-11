const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  } else if (users.some((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "Customer registered successfully" });
});

public_users.get("/", function (req, res) {
  // Check if there are books available
  if (!(Object.keys(books).length === 0)) {
    return res.status(200).json({ books: books });
  } else {
    return res.status(404).json({ message: "No books available" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const isbNumbers = Object.keys(books);
  if (!isbNumbers.includes(isbn)) {
    return res
      .status(404)
      .json({ message: "No book available with this isbn" });
  }
  return res.status(200).json({
    status: "sucess",
    book: books[isbn],
  });
});

// Get books by author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const bookList = Object.values(books).filter(
    (book) => book.author === author
  );
  if (bookList.length === 0) {
    return res
      .status(404)
      .json({ message: "No books available by this author" });
  }

  return res.status(200).json({
    status: "success",
    books: bookList,
  });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const bookList = Object.values(books).filter((book) => book.title === title);
  if (bookList.length === 0) {
    return res
      .status(404)
      .json({ message: "No books available by this author" });
  }

  return res.status(200).json({
    status: "success",
    books: bookList,
  });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;
  if (!Object.keys(books).includes(isbn)) {
    return res
      .status(404)
      .json({ message: "No books is found with this ISBN!" });
  } else
    return res.status(200).json({
      status: "success",
      reviews: reviews,
    });
});
module.exports.general = public_users;
