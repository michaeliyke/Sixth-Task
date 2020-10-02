const express = require("express");
const http = require("http");
// const morgan = require("morgan");
const hostname = "127.0.0.1";
const port = 3000;

const app = express();

// app.use(morgan("dev"));
app.use(express.static("public"));


app.get("/", (request, response) =>{
  response.sendFile("index.html", {root: __dirname});
});

app.use((request, response) =>{

});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Web server running on http://${hostname}:${port}`);
});