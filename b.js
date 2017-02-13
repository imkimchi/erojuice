const rp = require('request-promise');
const async = require('async');
const mongoose = require('mongoose');
const CronJob = require('cron').CronJob;
mongoose.Promise = global.Promise;
const optForReddit = {
  method: 'GET',
  uri: 'https://www.reddit.com/domain/eroshare.com/new.json',
  json: true,
};
db = mongoose.createConnection('mongodb://localhost/eroshare');
const Schema = mongoose.Schema;
const eroInfo = new Schema({
  videoUri: String,
  date: Number,
});
const Ero = db.model('post', eroInfo);

new CronJob('*/45 * * * * *', () => {
  async.waterfall([
    function(waterFallcallback) {
      rp(optForReddit).then((redditJSON) => {
        const posts = redditJSON.data.children;
        const len = posts.length;
        const eroJson = [];
        // make Json inludes albumid and date
        async.eachSeries(posts, (item, callback) => {
          if (isVideo(item.data.url)) {
            eroJson.push(getAlbumId(item.data.url));
          }
          callback();
        }, () => {
          waterFallcallback(null, eroJson);
        });
      }).catch((err) => {
        console.log('Failed to send request to reddit API', err);
      });
    },
    function(redditJSON, waterFallcallback) {
      Ero.find({
        videoUri: redditJSON[0],
      }, (err, docs) => {
        if (!docs.length) {
          console.log('[!] Check Update...');
          const optForEroshare = {
            method: 'POST',
            uri: 'http://localhost:3000/eroapi',
            body: {
              data: redditJSON
            },
            json: true,
          };
          waterFallcallback(null, optForEroshare);
        } else {
          console.log("[!] There's nothing new [first]");
        }
      });
    },
    function(optForEroshare, waterFallcallback) {
      rp(optForEroshare).then((status) => {
        console.log(status);
        if(status) console.log("[!] Updated Completed!");
        else console.log("[!] There's nothing new.")
        waterFallcallback(null);
      }).catch((err) => {
        console.log("[!] Failed to send request to eroshare API", err);
      });
    }
  ], (err) => {
    mongoose.connection.close();
  });
}).start();

function getAlbumId(str) {
  return str.split('/')[3];
}

function isVideo(str) {
  const lastString = str.split('/')[3];
  if (lastString === 'i' || lastString.split('.').length > 1) {
    return false;
  }
  return true;
}