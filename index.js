var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Connected to MongoDB");
});

mongoose.connect('mongodb://localhost/truelies');

var Book = require('./models/BookModel');
var Character = require('./models/CharacterModel');
var Actor = require('./models/ActorModel');
var Movie = require('./models/MovieModel');

var port = process.env.PORT || 3000;

var router = require('./router/main') (app, Book, Character, Actor, Movie);

var server = app.listen(port, function() {
    console.log("Express on port",port);
});
