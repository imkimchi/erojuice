const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./webpack.config.js');
const getdata = require('./routes/getData');
const rp = require('request-promise');
const eroapi = require('./routes/eroapi');
const CronJob = require('cron').CronJob;
const async = require('async');
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/scripts', express.static(__dirname + '/node_modules/bulma/css/'));

console.log("NODE_ENV: ", process.env.NODE_ENV);

db = mongoose.createConnection('mongodb://localhost/eroshare');
var Schema = mongoose.Schema;
var eroInfo = new Schema({
    videoUri: String,
    date: Number
});
var Ero = db.model('post', eroInfo);

let optForReddit = {
    method: 'GET',
    uri: 'https://www.reddit.com/domain/eroshare.com/new.json',
    json: true
}
/*
var job = new CronJob('* * * * *', function() {
  async.waterfall([
          function(waterFallcallback) {
              console.log("1");
            rp(optForReddit)
              .then(function(redditJSON) {
                let posts = redditJSON.data.children;
                let len = posts.length;
                let eroJson = [];
                //make Json inludes albumid and date
                async.eachSeries(posts, function(item, callback) {
                    if (isVideo(item.data.url)) {
                      eroJson.push(getAlbumId(item.data.url));
                    }
                    callback();
                  },
                  function() {
                      console.log("eroJson", eroJson);
                      waterFallcallback(null, eroJson);
                  });
              })
              .catch(function(err) {
                console.log("쎽스", err);
              })
          },
          function(redditJSON, waterFallcallback) {
              console.log("2");
            Ero.find({
                videoUri: redditJSON[0]
              }, function(err, docs) {
                if (!docs.length) {
                  console.log("업데이트 중이다 이기야");
                  let optForEroshare = {
                    method: 'POST',
                    uri: 'http://localhost:3000/eroapi',
                    body: {data: redditJSON},
                    json: true
                  };
                  waterFallcallback(null, optForEroshare);
                } else {console.log("업데이트 안됬따 이기");return;}
            })
        },
        function(optForEroshare, waterFallcallback) {
            console.log("3");
            console.log(optForEroshare);
              rp(optForEroshare)
                .then(function(status) {
                  console.log(status);
                  waterFallcallback(null);
                })
                .catch(function(err) {
                  console.log("업데이트 실패 띠용?!", err);
                })
        }],
        function(err) {
            console.log("4");
            //if(err) console.error(err);
            mongoose.connection.close();
        });
});

      job.start();
      */

if (isDeveloping) {
    console.log("[!] Running for Development");
    const compiler = webpack(config);
    const middleware = webpackMiddleware(compiler, {
        PublicPath: config.output.publicPath,
        contentBase: 'src',
        stats: {
            colors: true,
            has: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    });
    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    app.get('/', function response(req, res) {
        console.log("YES");
        res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
        res.end();
    });
    app.get('/getData', getdata);
    app.post('/eroapi', eroapi);
} else {
    console.log("[!] Running for Production");
    app.use(express.static(__dirname + '/dist'));
    app.get('/', function response(req, res) {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
    app.get('/getData', getData);
    app.post('/eroapi', eroapi);
}

function getAlbumId(str) {
    return str.split('/')[3];
}

function isVideo(str) {
    let lastString = str.split('/')[3];
    if (lastString === 'i' || lastString.split('.').length > 1) {
        return false;
    } else {
        return true;
    }
}
app.listen(3000, function() {
    console.log("[!] Running on 3000 port");
})