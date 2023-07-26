// import Kaleidoscope from '../practice/shader/kaleidoscope/kaleidoscope'
// import FireWork from '../practice/shader/fireWork/fireWork'
import { lazy } from 'react'
import { createRouteItem } from './tools/createItem'

export const shaderRoute = [
  createRouteItem("/kaleidoscope", lazy(() => import('../practice/shader/kaleidoscope/kaleidoscope')), "shader实现万花筒效果", require('../assets/img/react_logo.png')),
  createRouteItem("/fire_work", lazy(() => import('../practice/shader/fireWork/fireWork')), "shader实现烟火效果", require('../assets/img/react_logo.png'))
]