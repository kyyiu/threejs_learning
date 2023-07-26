// import Basic from '../practice/basic'
// import BufferGem from '../practice/bufferGem'
// import BasicMaterial from '../practice/material/basic'
import { lazy } from 'react'
import { createRouteItem } from './tools/createItem'

export const practiceRoute = [
  createRouteItem("/basic", lazy(() => import('../practice/basic')), "threejs基础使用", require('../assets/img/react_logo.png')),
  createRouteItem("/buffer_gem", lazy(() => import('../practice/bufferGem')), "bufferGem对象使用", require('../assets/img/react_logo.png')),
  createRouteItem("/basic_material", lazy(() => import('../practice/material/basic')), "基础材质的使用", require('../assets/img/react_logo.png')),
]