import utils from './pushifVideo'
import optForReddit from './requestOpt'

async function crawler(){
    new CronJob('*/20 * * * * *', () => {
        async () => {
            try { let redditJSON = await rp(optForReddit) }
            catch(err) { console.error(err) }
            let redditJSON = await rp(optForReddit)
            let posts = redditJSON.data.children
            let eroJson = await pushifVideo(posts)
            
            const optForEroshare = {
                method: 'POST',
                uri: 'http://localhost:3000/eroapi',
                body: {data: redditJSON},
                json: true
            }
            
            try { 
                let status = await rp(optForEroshare)
                if(status) console.log("[!] Updated Completed!")
                else console.log("[!] There's nothing new.")
            } catch(err) { console.error(err) }
            
            mongoose.connection.close();
        }
    }).start();
}

export default crawler