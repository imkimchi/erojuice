import compose from 'koa-compose'

import videoRouter from './videos.js'
import eroRouter from './eroapi.js'

const routes = [
    videoRouter,
    eroRouter
]

export default () => compose([].concat(
  ...routes.map(r => [r.routes(), r.allowedMethods()])
))