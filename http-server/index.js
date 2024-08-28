const http = require("http");
const fs = require("fs");
const readline = require("readline");
const args = require("minimist")(process.argv.slice(2));

const lineDetail = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

lineDetail.question("Enter port number - ", (portNumber) => {
  return portNumber;
});

let homeContent = "";
let projectContent = "";

// fs.readFile("home.html", (err, home) => {
//   console.log(home.toString());
// });

// fs.readFile("home.html", (err, home) => {
//   if (err) throw err;
//   http
//     .createServer((request, response) => {
//       response.writeHeader(200, { "Content-Type": "text/html" });
//       response.write(home);
//       response.end();
//     })
//     .listen(3000);
// });

fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  homeContent = home;
});

fs.readFile("project.html", (err, project) => {
  if (err) throw err;
  projectContent = project;
});

fs.readFile("registration.html", (err, registration) => {
  if (err) throw err;
  registrationContent = registration;
});

http
  .createServer((request, response) => {
    let url = request.url;
    response.writeHeader(200, { "Content-Type": "text/html" });
    switch (url) {
      case "/project":
        response.write(projectContent);
        response.end();
        break;
      case "/registration":
        response.end();
        break;
      default:
        response.write(homeContent);
        response.end();
        break;
    }
  })
  .listen(3000);
