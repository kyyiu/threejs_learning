import Kaleidoscope from '../practice/shader/kaleidoscope/kaleidoscope'
import FireWork from '../practice/shader/fireWork/fireWork'

import { createRouteItem } from './tools/createItem'

export const shaderRoute = [
  createRouteItem("/kaleidoscope", <Kaleidoscope/>, "shader实现万花筒效果", require('../assets/img/react_logo.png')),
  createRouteItem("/fire_work", <FireWork/>, "shader实现烟火效果", require('../assets/img/react_logo.png'))
]