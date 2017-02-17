const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const mongoose = require('mongoose');
const async = require('async');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/eroshare');
mongoose.connection.on('error', function(err) {
    console.error('MongoDB error: %s', err);
});

let baseURL = 'https://api.eroshare.com/api/v1/albums/';
var isChanged = false;


db = mongoose.createConnection('mongodb://localhost/eroshare');
const Schema = mongoose.Schema;
const eroInfo = new Schema({
  videoUri: String,
  postUri: String,
  date: Number,
});
const Ero = db.model('post', eroInfo);

router.post('/eroapi', function(req, res) {
  var idArray = req.body.data;
  async.forEachOf(idArray, function(value, key, cb) {
    rp(baseURL + value)
      .then(function(json) {
          //var jsn = JSON.parse(json);
          updateDB(JSON.parse(json));
        })
      .catch(function(err) {
          console.error("Failed to send eroapi", baseURL+value);
        })
    cb();
  }, function() {
      res.send(isChanged);
      isChanged = false;
  });
});

function updateDB(data){
  async.waterfall([
      function(wfcallback) {
          console.log("wf works!");
          if (data.items[0].type === 'Video') {
              Ero.find({videoUri: data.items[0].url_mp4}, function(err, docs) {
                  console.log("Find workls!");
                  if(err) console.error(err);
                  wfcallback(null, err, docs);
              });
          } else {
              wfcallback(null, "", [1,2]);
          }
      }, 
      function(err, docs, wfcallback) {
          console.log(docs);
          if(docs.length) {
              wfcallback(null, false, "exist or image");
          } else {
              var ero = new Ero();
              ero.videoUri = data.items[0].url_mp4;
              ero.postUri = data.url;
              ero.date = Date.now();
              ero.save(function(err, product) {
                  if(err) console.error("Failed to save mongo", err);
                  console.log("Thisis what i updated", product);
              });
              wfcallback(null, true, "Not exists");
          }
      }
  ], function(err, isChanged, comment) {
      checkChanged(isChanged);
  });
}

function checkChanged(bool) {
    if(bool) isChanged = true;
}

module.exports = router;