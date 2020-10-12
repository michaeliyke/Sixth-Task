
!(function(space){
const mgr = require("./public/book-manager");
const NodeCache = require("node-cache");
const cache_ = new NodeCache();

const express = require("express");
const http = require("http");
const path = require("path");
const router = express.Router();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const hostname = "127.0.0.1";
const port = 4000;

const fs = require("fs");
mgr.books = [];

const app = express();
// app.use(morgan("dev"));
app.use(bodyParser.json());
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"));

// app.all(/\/books[\/\w+]*/, (request, response, next) =>{

//   fs.readFile(`${__dirname}/public/assets/books.json`, (error, data) =>{
//     if (error) {
//       response.statusCode = 503;
//       response.setHeader("Content-Type", "text/plain");
//       response.end();
//       throw new Error(`Internal server error. \n ${error} `);
//     }
//     books = JSON.parse(data);
//     response.statusCode = 200;
//     response.setHeader("Content-Type", "text/plain");
//     next();
//   });
// });

router.get("/about",function(req,res){
  res.sendFile(path.join(__dirname+"/about.html"));
});

router.get("/sitemap",function(req,res){
  res.sendFile(path.join(__dirname+"/sitemap.html"));
});

app.get("/books", (request, response, next) =>{
  response.send(mgr.books);
  response.end();
});

app.post("/books", (request, response, next) =>{
  console.log(request.body)
  // const book = JSON.parse(request);
  response.send(`{"received": "yes"}`);
  response.end();
});

app.get("/generate", (request, response, next) =>{
  fs.readFile(`${__dirname}/public/assets/books.json`, (error, data) =>{
    if (error) {
      throw new Error(`Internal server error. \n ${error} `);
    }
    mgr.books = JSON.parse(data);
  if (typeof cache_.get("id") !== "number" || cache_.get("status") == 1) {
    /*Status: 0 - unused, status: 1 - last used*/
    // The current numbers have been utilized. Get another
    //OR It"s the first request, so create the numbers
    console.log("This is here");
    let id = cache_.get("id");
    cache_.set("id", typeof id === "undefined" ? mgr.getLastId(): id++);
    cache_.set("ISBN", Math.floor(Math.random() * 1000000000));
    cache_.set("status", 0);
  }
  response.setHeader("Content-Type", "application/json");
  response.send(JSON.stringify([
    {"id": cache_.get("id"), "ISBN": cache_.get("ISBN")}
    ]));
  response.end();
});
});


app.get("/books/id", (request, response, next) =>{
  response.send(mgr.books);
  response.end();
});

app.get("/books/author", (request, response, next) =>{
  response.send(mgr.books);
  response.end();
});

app.get("/books/ISBN", (request, response, next) =>{
  response.send(mgr.books);
  response.end();
});

app.get("/books/id/:id", (request, response, next) =>{
  response.send(mgr.getBookById(request.params.id));
  response.end();
});

app.get("/books/id/:author", (request, response, next) =>{
  response.send(mgr.getBookByAuthor(request.params.author));
  response.end();
});

app.get("/books/id/:ISBN", (request, response, next) =>{
  response.send(mgr.getBookByISBN(request.params.ISBN));
  response.end();
});


const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Web server running on http://${hostname}:${port}`);
});

}(this));