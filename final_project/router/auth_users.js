const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "Lalisa Bula", password: "1234A" }];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};
// Function to check if username and password match the records
const authenticatedUser = (username, password) => {
  const user = users.find((user) => user.username === username);
  if (user && user.password === password) {
    return true;
  }
  return false;
};

// Login route for registered users
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  // Check if the user is authenticated
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "access", { expiresIn: "1h" });
    req.session.authorization = {
      accessToken: token,
      user: {
        username: username,
      },
    };
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  console.log(review);
  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  // Add the review to the book's reviews object
  books[isbn].reviews[req.user] = review;
  console.log(books[isbn]);
  return res.status(201).json({ message: "Review added successfully" });
});
// Delete a review (only authorized customers can access this route)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!books[isbn].reviews[req.user]) {
    return res.status(404).json({ message: "No review found for this book" });
  }
  delete books[isbn].reviews[req.user];

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
