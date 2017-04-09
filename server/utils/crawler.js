import getUrl from './getUrl'
import rp from 'request-promise'
import optForReddit from './requestOpt'
import {CronJob} from 'cron'

export default () => {
    console.log("[!] Just started to crawl ")
    new CronJob('*/20 * * * * *', async () => {
        try { 
            let redditJSON = await rp(optForReddit)
            let posts = redditJSON.data.children
            let eroJson = await getUrl(posts)

            const optForEroshare = {
                method: 'POST',
                uri: 'http://localhost:3000/eroapi',
                body: {data: eroJson},
                json: true
            }
            
            try { 
                let status = await rp(optForEroshare)
                //if(status) console.log("[!] Updated Completed!")
                //else console.log("[!] There's nothing new.")
            } catch(err) { 
                console.error("failed to eroshare")
            }
        } catch(err) { 
            console.error("failed to reddit api", err) 
        }
    }).start();
}