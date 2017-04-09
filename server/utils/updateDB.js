import Ero from '../models/Eroshare'
import isVideo from '../utils/isVideo'

import mongoose from 'mongoose'
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
    console.error('MongoDB error: %s', err);
});

function makeParam(data) {
    if(isVideo (data)) {
        const reddit = data.reddit_submission
        return {
            query: { videoId: data.id },
            update: {
                thumbnail: data.items[0].url_thumb,
                videoId: data.id,
                created_at: reddit.created_at,
                score: reddit.score,
                subreddit: reddit.subreddit,
                title: ""
            },
            opt: { upsert: true }
        }
    }
}

async function updateDB (data, isChanged) {
    let checkChanged = (bool) => isChanged = true || false
    const param = makeParam(data)
    
    if (param) {
        try {
            await Ero.findOneAndUpdate(param.query, param.update, param.opt)
        } catch (err) {
            console.error("Failed to save mongo", err)
        }
        checkChanged(isChanged)
    }
}

export default updateDB