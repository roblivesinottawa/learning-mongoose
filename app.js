const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Book = require("./Book.model");

const db = "mongodb://localhost/example";

mongoose.connect(db);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const port = 8080;

app.get("/", (req, res) => {
  res.send("happy to be here");
});
app.get("/books", (req, res) => {
  res.send("getting all books");
  Book.find({}).exec((err, books) => {
    if (err) {
      res.send("error has occured");
    } else {
      console.log(books);
      res.json(books);
    }
  });
});

// getting one specific book

app.get("/books/:id", (req, res) => {
  console.log("getting one book");
  Book.find({
    _id: req.params.id,
  }).exec((err, book) => {
    if (err) {
      res.send("error occured");
    } else {
      console.log(book);
      res.json(book);
    }
  });
});

// add a post route
app.post("/book", (req, res) => {
  let newBook = new Book();

  newBook.title = req.body.title;
  newBook.authot = req.body.author;
  newBook.category = req.body.category;

  newBook.save((err, book) => {
    if (err) {
      res.send("error saving book");
    } else {
      console.log(book);
      res.send(book);
    }
  });
});

// update method
app.put("/book/:id", (req, res) => {
  Book.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    { $set: { title: req.body.title } },
    { upsert: true },
    (err, newBook) => {
      if (err) {
        console.log("error occured");
      } else {
        console.log(newBook);
        res.send(newBook);
      }
    }
  );
});
// delete a book
app.delete("/book/:id", (req, res) => {
  Book.findOneAndRemove(
    {
      _id: req.params.id,
    },
    (err, book) => {
      if (err) {
        console.log("error deleting");
      } else {
        console.log(book);
        res.status(204);
      }
    }
  );
});

app.listen(port, () => console.log(`listening on port ${port}`));
