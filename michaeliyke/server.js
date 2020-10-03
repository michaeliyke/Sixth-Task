
!(function(space){

const NodeCache = require("node-cache");
const cache_ = new NodeCache();

const express = require("express");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const hostname = "127.0.0.1";
const port = 3000;

const fs = require("fs");
let books = null;

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(express.static("public"));

function getLastId() {
  return books.length;
}

function getById(id) {
  let bookItem = {};
  for(book of books) {
    if(book.id == id) {
      bookItem = book;
      break;
    }
  }
  return bookItem;
}

function getByAuthor(author) {
  let bookItem = {};
  for(book of books) {
    if(book.author == author) {
      bookItem = book;
      break;
    }
  }
  return bookItem;
}

function getByISBN(ISBN) {
  let bookItem = {};
  for(book of books) {
    if(book.ISBN == ISBN) {
      bookItem = book;
      break;
    }
  }
  return bookItem;
}

app.all(/\/books[\/\w+]*/, (request, response, next) =>{

  fs.readFile(`${__dirname}/public/assets/books.json`, (error, data) =>{
    if (error) {
      response.statusCode = 503;
      response.setHeader("Content-Type", "text/plain");
      // response.end();
      throw new Error(`Internal server error. \n ${error} `);
    }
    books = JSON.parse(data);
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/plain");
    next();
  });
});

app.get("/books", (request, response, next) =>{
  response.send(books);
  response.end();
});

app.get("/generate", (request, response, next) =>{
  fs.readFile(`${__dirname}/public/assets/books.json`, (error, data) =>{
    if (error) {
      throw new Error(`Internal server error. \n ${error} `);
    }
    books = JSON.parse(data);
  if (typeof cache_.get("id") !== "number" || cache_.get("status") == 1) {
    /*Status: 0 - unused, status: 1 - last used*/
    // The current numbers have been utilized. Get another
    //OR It's the first request, so create the numbers
    console.log("This is here");
    let id = cache_.get("id");
    cache_.set("id", typeof id === "undefined" ? getLastId(): id++);
    cache_.set("ISBN", Math.floor(Math.random() * 1000000000));
    cache_.set("status", 0);
  }
});
});

app.get("/books/id", (request, response, next) =>{
  response.send(books);
  response.end();
});

app.get("/books/author", (request, response, next) =>{
  response.send(books);
  response.end();
});

app.get("/books/ISBN", (request, response, next) =>{
  response.send(books);
  response.end();
});

app.get("/books/id/:id", (request, response, next) =>{
  response.send(getById(request.params.id));
  response.end();
});

app.get("/books/id/:author", (request, response, next) =>{
  response.send(getByAuthor(request.params.author));
  response.end();
});

app.get("/books/id/:ISBN", (request, response, next) =>{
  response.send(getByISBN(request.params.ISBN));
  response.end();
});

app.get("/", (request, response) =>{
  response.sendFile("index.html", {root: __dirname});
});

app.use((request, response) =>{

});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Web server running on http://${hostname}:${port}`);
});

}(this));