let FaggotSubReddit = [
    'RedditorCum',
    'Jerking',
    'MassiveCock',
    'ratemycock',
    'ladybonersgw',
    'PissOn',
    'NSFW_DICK_and_Cock',
    'tinydick',
    'penis',
    'FemBoys',
    'GayWatersports',
    'jacking',
    'GayButtsOnly',
    'CubsGoneWild',
    'NSFW_Tributes',
    'AnimeCumtributes'
]

const getAlbumId = str => str.split('/')[3]

function isExist (item, eroJson) {
    let lastString = getAlbumId(item.data.url)
    let subreddit = item.data.subreddit
    if(!eroJson.includes(lastString) && !FaggotSubReddit.includes(subreddit)) {
        if(lastString.length === 8) return true
    } else {
        return false
    }
}

async function getUrl (posts) {
    let eroJson = []
    await posts.forEach((item) => {
        if(isExist(item, eroJson)) {
            eroJson.push(getAlbumId(item.data.url))
            console.log(item.data.subreddit)
        }
    })
    return eroJson
}

export default getUrl