import Router from 'koa-router'
import mongoose from 'mongoose'

import Ero from '../models/Eroshare'

const router = new Router({ prefix: '/video' })

router.get('/', async(ctx, next) => {
    try {
        let everyData = await Ero.find({})
        ctx.body = everyData
        mongoose.connection.close(() => {
            console.error("sucksex")
        })
    } catch(err) {
        console.error(err);
    }
})

export default router