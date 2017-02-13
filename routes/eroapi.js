const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const mongoose = require('mongoose');
const async = require('async');

mongoose.connect('mongodb://localhost/eroshare');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;
var eroInfo = new Schema({
  videoUri: String,
  date: Number
});
var Ero = mongoose.model('post', eroInfo);
let baseURL = 'https://api.eroshare.com/api/v1/albums/';
var isChanged = false;

router.post('/eroapi', function(req, res) {
  var idArray = req.body.data;
  async.forEachOf(idArray, function(value, key, cb) {
    rp(baseURL + value)
      .then(function(json) {
          var jsn = JSON.parse(json);
          updateDB(jsn);
        })
    .catch(function(err) {
      console.error(err);
    })
    cb();
  }, function() {
      res.send(isChanged);
      console.log("Real value", isChanged);
      isChanged = false;
  });
});

function updateDB(data){
  async.waterfall([
      function(wfcallback) {
          if (data.items[0].type === 'Video') {
              Ero.find({videoUri: data.items[0].url_mp4}, function(err, docs) {
                  wfcallback(null, err, docs);
              });
          } else {
              wfcallback(null, "", [1,2]);
          }
      },
      function(err, docs, wfcallback) {
          if(docs.length) {
              wfcallback(null, false, "exist or image");
          } else {
              var ero = new Ero();
              ero.videoUri = data.items[0].url_mp4;
              ero.date = Date.now();
              ero.save();
              wfcallback(null, true, "Not exists");
          }
      }
  ], function(err, isChanged, comment) {
      console.log(isChanged)
      checkChanged(isChanged);
  });
}

function checkChanged(bool) {
    if(bool) isChanged = true;
}

module.exports = router;