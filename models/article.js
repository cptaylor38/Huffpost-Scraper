const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: { type: String, unique: true },
    link: { type: String },
    photo: { type: String },
    description: { type: String },
    note: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
})


const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;


