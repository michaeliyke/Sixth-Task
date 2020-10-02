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

app.all("/books", (request, response, next) =>{

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

app.get("/", (request, response) =>{
  response.sendFile("index.html", {root: __dirname});
});

app.use((request, response) =>{

});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Web server running on http://${hostname}:${port}`);
});