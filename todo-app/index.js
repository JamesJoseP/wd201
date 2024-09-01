const express = require("express");
const app = express();

// define a route for this express.js application
app.get("/", (request, response) => {
  response.send("hello world");
});

app.listen(3000, () => {
  console.log("Started express server at port 3000.");
});

console.log("Log some text");
