import Router from 'koa-router'
import rp from 'request-promise'

import Ero from './models/eroshare'

import mongoose from 'mongoose'
mongoose.Promise = global.Promise;
mongoose.connection.on('error', function(err) {
    console.error('MongoDB error: %s', err);
});

let checkChanged = (bool) => isChanged = true || false
var isChanged = false;
let baseURL = 'https://api.eroshare.com/api/v1/albums/'

const router = new Router({ prefix: '/eropai'});

router.post('/', async (ctx, next) => {
    let idArray = await ctx.request.query.data;
    idArray.forEach((value, key) => {
        try { let eroJson = await rp(baseURL+value)} 
        catch (err) { console.error("Failed to send eroapi", baseURL+value)}
        updateDB(JSON.parse(eroJson))
    })
    await next()
    ctx.body = isChanged
    isChanged = false
})

async function updateDB(data) {
    if(data.items[0].type === 'Video') {
         try { let docs = Ero.find({videoId: data.id}) }
         catch(err) { console.error(err) }
         
         if(docs.length) { 
             console.error("exist or image")
         } else {
             let ero = await new Ero();
             let reddit = data.reddit_submission
             ero.thumbnail = data.items[0].url_thumb;
             ero.videoId = data.id
             ero.title = ""; //TODO
             ero.created_at = reddit.created_at;
             ero.score = reddit.score;
             ero.subreddit = reddit.subreddit;

             try {
                 let product = await ero.save()
             } catch (err) {
                  console.error("Failed to save mongo", err);
                  console.log("Thisis what i updated", product);
             }
             checkChanged(isChanged)
         }
    }
}

export default router