import mongoose from 'mongoose'

const schema = mongoose.Schema({
    thumbnail: String,
    videoId: String,
    title: String,
    created_at: String,
    score: Number,
    subreddit: String
});

export default mongoose.model('post', schema);