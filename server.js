const express = require("express");
// Require axios and cheerio. This makes the scraping possible
const mongoose = require("mongoose");
const bodyparser = require('body-parser');



const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/MongoArticles";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    // useMongoClient: true
});

const exphbs = require('express-handlebars');

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

require("./routes/api-routes")(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});

module.exports = app;