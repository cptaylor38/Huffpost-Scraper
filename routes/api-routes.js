const axios = require("axios");
const cheerio = require("cheerio");
const mongojs = require("mongojs");

// Hook mongojs configuration to the db variable
const db = require("../models");

module.exports = function (app) {
    app.get("/", function (req, res) {
        // Find all results from the scraperHW collection in the db
        res.render('home');
    });

    app.get('/all', (req, res) => {
        db.Article.find({}).populate('note').exec(function (err, data) {
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

                newARticle = {
                    title: headline,
                    link: headlineURL,
                    photo: cardImg,
                    description: description
                };

                // If this found element had both a title and a link
                if (headline) {
                    db.Article.create(newARticle, (err, inserted) => {
                        if (err) {
                            // Log the error if one is encountered during the query
                            console.log('line 53: insert error');
                        }
                    }
                    );
                }
            });
            res.redirect('/all');
        });
    });

    app.put("/delete/note/:id", function (req, res) {
        db.Note.remove(
            { _id: req.params.id }
        )
            .then(function (result) {
                res.json(result)
            })

    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        console.log(`
        Article Id: ${req.params.id}
        User: ${req.body.user}
        Body: ${req.body.body}
        `);
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

}

