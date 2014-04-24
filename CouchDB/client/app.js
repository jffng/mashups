// Declare Requirements, load packages and set the package to a variable name
var express = require("express");

// Create the app.
// `express` is a function, we need to call this function to create the web
// server.
var app = express();

// Set up the public directory to serve our Javascript file.
// `__dirname` is a special variable in Node.js for the folder where the file
// you are running is.
app.use(express.static(__dirname + '/public'));

// Set EJS as templating language and say that the views will be in a folder
// named 'views'
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Set up Express error handling, because.
app.use(express.errorHandler());

// ROUTES
app.get("/", function(request, response) {
  // render the index with no variables.
  response.render('index');
});

// Start the server
app.listen(3000);
console.log('Express started on port 3000');