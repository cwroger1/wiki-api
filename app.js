
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

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// this goes at the bottom to ensure proper configuration before allowing connections
app.listen(3000, () => {
    console.log("Server has started on port 3000");
});