var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CharacterSchema = new Schema({
    bookid: String,
    name: String,
    gender: String,
    age: String,
    persontype: String,
})

module.exports = mongoose.model("Character", CharacterSchema);