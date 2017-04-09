function isVideo (str) {
    let lastString = str.split('/')[3];
    if (lastString === 'i' || lastString.split('.').length > 1) {
        return false;
    } else if(lastString.length > 7){
        return true;
    }
}

function getAlbumId (str) {
    return str.split('/')[3];
}

async function getUrl (posts) {
    let eroJson = [];
    await posts.forEach((item) => {
        if(!eroJson.includes(item)) {
            if(isVideo(item.data.url)) {
                eroJson.push(getAlbumId(item.data.url));
            }
        }
    })
    return eroJson;
}

export default getUrl