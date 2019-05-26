const axios = require("axios");
const cheerio = require("cheerio");
const mongojs = require("mongojs");
const databaseUrl = "scraperHWdb";
const collections = ["scraperHW"];
// Hook mongojs configuration to the db variable
const db = mongojs(databaseUrl, collections);



db.on("error", function (error) {
    console.log("Database Error:");
});

module.exports = function (app) {
    app.get("/", function (req, res) {
        // Find all results from the scraperHW collection in the db
        res.render('home');
    });

    app.get('/all', (req, res) => {
        db.scraperHW.find({}, (err, data) => {
            if (err) {
                console.log('line 24: extract error');
            }
            else {

                let dataObject = { articles: data };
                res.render('index', dataObject);
            }
        })
    });

    // Scrape data from one site and place it into the mongodb db
    app.get("/scrape", function (req, res) {
        // Make a request via axios for the news section of `ycombinator`
        axios.get("https://www.huffpost.com/").then(function (response) {
            // Load the html body from axios into cheerio
            let $ = cheerio.load(response.data);
            // For each element with a "title" class
            $(".card--twilight").each(function (i, element) {
                let cardContent = $(element).children('.card__content');

                let cardDetails = $(cardContent).children('.card__details');
                let cardImgWrapper = $(cardContent).children('.card__image__wrapper');


                let cardHeadlines = $(cardDetails).children('.card__headlines');
                let cardImgHolder = $(cardImgWrapper).children('.card__image');

                let cardImg = $(cardImgHolder).children('img').attr('src');
                let headline = $(cardHeadlines).children('.card__headline').text();
                let headlineURL = $(cardImgWrapper).attr('href');

                let cardDescription = $(cardHeadlines).children('.card__description');
                let description = $(cardDescription).children('a').text();


                // If this found element had both a title and a link
                if (headline) {
                    db.scraperHW.insert(
                        {
                            title: headline,
                            link: headlineURL,
                            photo: cardImg,
                            description: description
                        },
                        function (err, inserted) {
                            if (err) {
                                // Log the error if one is encountered during the query
                                console.log('line 53: insert error');
                            }
                            else {
                                // Otherwise, log the inserted data


                            }
                        }
                    );
                }
            });
            res.redirect('/all');
        });
    });
}