const express = require("express");

// Require axios and cheerio. This makes the scraping possible


const exphbs = require('express-handlebars');

// Initialize Express
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");
// Database configuration


// Main route (simple Hello World Message)
require("./routes/api-routes")(app);


// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});


module.exports = app;