import Basic from '../practice/basic'
import BufferGem from '../practice/bufferGem'
import BasicMaterial from '../practice/material/basic'

import { createRouteItem } from './tools/createItem'

export const practiceRoute = [
  createRouteItem("/basic", <Basic/>, "threejs基础使用", require('../assets/img/react_logo.png')),
  createRouteItem("/buffer_gem", <BufferGem/>, "bufferGem对象使用", require('../assets/img/react_logo.png')),
  createRouteItem("/basic_material", <BasicMaterial/>, "基础材质的使用", require('../assets/img/react_logo.png')),
]