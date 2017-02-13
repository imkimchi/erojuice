const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

db = mongoose.createConnection('mongodb://localhost/eroshare');

var Schema = mongoose.Schema;
var eroInfo = new Schema({
  videoUri: String,
  date: Number
});

var Ero = db.model('post', eroInfo);

router.get('/getdata', function(req, res) {
    Ero.find({}, function(err, docs) {
        res.json(docs);
        mongoose.connection.close(function(){
            console.log("씨빨됬따");
        });
    })
})


module.exports = router;