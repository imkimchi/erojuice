import Router from 'koa-router'
import rp from 'request-promise'
import updateDB from '../utils/updateDB'

const router = new Router({ prefix: '/eroapi'})

router.post('/', async (ctx, next) => {
    let baseURL = 'https://api.eroshare.com/api/v1/albums/'
    let isChanged = false;
    let idArray = await ctx.request.body.data;

    idArray.forEach(async (value) => {
        try { 
            let eroJson = await rp(baseURL+value)
            updateDB(JSON.parse(eroJson), isChanged)
        } catch (err) { 
            console.error("Failed to send eroapi", baseURL+value)
        }
    })
    await next()
    ctx.body = isChanged
    isChanged = false
})

export default router