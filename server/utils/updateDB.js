import Ero from '../models/Eroshare'
import isVideo from '../utils/isVideo'

import mongoose from 'mongoose'
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
    console.error('MongoDB error: %s', err);
});

let checkChanged = (bool) => isChanged = true || false

async function updateDB (data) {
    if(isVideo (data)) {        
        let query = { "videoId": data.id }
        let reddit = data.reddit_submission
        let update = {
            thumbnail: data.items[0].url_thumb,
            videoId: data.id,
            created_at: reddit.created_at,
            score: reddit.score,
            subreddit: reddit.subreddit,
            title: ""
        }
        let opt = { upsert: true }
        
        try {
            let product = await Ero.findOneAndUpdate(query, update, opt)
        } catch (err) {
            console.error("Failed to save mongo", err)
        }
        checkChanged(isChanged)
    }
}

export default updateDB