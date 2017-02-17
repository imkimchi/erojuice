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
mongoose.Promise = global.Promise;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/scripts', express.static(__dirname + '/node_modules/bulma/css/'));

console.log("NODE_ENV: ", process.env.NODE_ENV);

let optForReddit = {
    method: 'GET',
    uri: 'https://www.reddit.com/domain/eroshare.com/new.json',
    json: true
}

db = mongoose.createConnection('mongodb://localhost/eroshare');
const Schema = mongoose.Schema;
const eroInfo = new Schema({
  videoUri: String,
  postUri: String,
  date: Number,
});
const Ero = db.model('post', eroInfo);

new CronJob('*/20 * * * * *', () => {
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
        const optForEroshare = {
            method: 'POST',
            uri: 'http://localhost:3000/eroapi',
            body: {data: redditJSON},
            json: true,
          };
          console.log(optForEroshare);
        rp(optForEroshare).then((status) => {
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
    } else if(lastString.length > 7){
        return true;
    }
}
app.listen(3000, function() {
    console.log("[!] Running on 3000 port");
})