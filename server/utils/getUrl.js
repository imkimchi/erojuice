import fagSubs from './FaggotSubReddits'

const getAlbumId = str => str.split('/')[3]
const isExist = (idArray, videoId) => !idArray.includes(videoId)
const isFag = sub => !fagSubs.includes(sub)

function filter (item, idArray) {
    let videoId = getAlbumId(item.data.url)
    let subreddit = item.data.subreddit
    if(isExist(idArray, videoId) && isFag(subreddit)){
        if(videoId.length === 8) return true
        else return false
    } else {
        return false
    }
}


async function getUrl (posts) {
    let idArray = []
    await posts.forEach((item) => {
        if(filter(item, idArray)) {
            idArray.push(getAlbumId(item.data.url))
        }
    })
    return idArray
}

export default getUrl