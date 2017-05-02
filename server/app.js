import path from 'path'
import Koa from 'koa'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'
import rp from 'request-promise'
import logger from 'koa-logger'
import {cronJob as CronJob} from 'cron'

import config from './config'
import routes from './routes'
import crawler from './utils/crawler'

import mongoose from 'mongoose'
mongoose.Promise = global.Promise

mongoose
  .connect(config.MONGODB_URI)
  .then(startApp).catch(::console.error)


function startApp() {
    const app = new Koa()
    const port = process.env.PORT || 3000
    const dist = path.join(__dirname, '..', 'dist')
    const bpOption = {extendTypes: {json: ['application/x-javascript']}}

    crawler()

    app
      .use(logger())
      .use(bodyParser(bpOption))
      .use(routes())
      .use(serve(dist))

    app.listen(port, () => console.log(`Listening on port ${port}`))
}
