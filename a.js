const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/eroshare');

var Schema = mongoose.Schema;
var eroInfo = new Schema({
  videoUri: String,
  date: Number
});

var Ero = mongoose.model('post', eroInfo);
var data;

Ero.find({}, function(err, docs) {
        console.log("DOCS", docs);
        module.exports = docs;
})