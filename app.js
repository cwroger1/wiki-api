
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/wiki-db')
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + 'mongodb://127.0.0.1:27017/wiki-db');
  });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// schemas and models

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// functions

app.route("/articles")
    .get((req, res) => {
        Article.find().then((results) => {
            res.send(results);
        }).catch((err) => {
            res.send(err);
        });
    })
    .post((req, res) => {
        const title = req.body.title;
        const content = req.body.content;
        const newArticle = new Article({
            title: title,
            content: content 
        });
        newArticle.save().then((result) => {
            res.send(result);
        });
    });

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle})
        .then((foundArticle) => {
            res.send(foundArticle);
        }).catch((err) => {
            res.send(err);
        });
    })
    .put((req, res) => {
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true, new: true}) // 'new' returns updated doc instead of original
        .then((message) => {
            res.send(message);
        }).catch((err) => {
            res.send(err);
        });
    })
    .patch((req, res) => {
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {$set: req.body},
            {new: true}) // 'new' returns updated doc instead of original
        .then((message) => {
            res.send(message);
        }).catch((err) => {
            res.send(err);
        });
    })
    .delete((req, res) => {
        Article.findOneAndDelete(
            {title: req.params.articleTitle},)
        .then((message) => {
            res.send(message);
        }).catch((err) => {
            res.send(err);
        });
    });

// this goes at the bottom to ensure proper configuration before allowing connections
app.listen(3000, () => {
    console.log("Server has started on port 3000");
});