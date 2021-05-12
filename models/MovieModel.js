var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
    bookid: String,
    title: String,
    author: String,
    character: String,
    actor: String
})

module.exports = mongoose.model("Movie", MovieSchema);