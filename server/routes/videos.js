import Router from 'koa-router'
import mongoose from 'mongoose'

import Ero from '../models/Eroshare'

const router = new Router({ prefix: '/videos' })

router.get('/', async(ctx, next) => 
    (ctx.body = await Ero.find({}).sort({$natural:-1})))

export default router