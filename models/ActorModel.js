var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActorSchema = new Schema({
    name: String,
    gender: String,
    age: String,
    persontype: String
});

module.exports = mongoose.model('Actor',ActorSchema);

