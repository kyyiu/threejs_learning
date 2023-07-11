import ClickItem from '../practice/interactive/clickItem'
import PopDialog from '../practice/interactive/popDialog'
import Graffiti from '../practice/interactive/graffiti'

import { createRouteItem } from './tools/createItem'

export const interactiveRoute = [
  createRouteItem("/click_item", <ClickItem/>, "物体点击", require('../assets/img/react_logo.png')),
  createRouteItem("/pop_dialog", <PopDialog/>, "鼠标处理物体检测", require('../assets/img/react_logo.png')),
  createRouteItem("/graffiti", <Graffiti/>, "canvas纹理涂鸦板", require('../assets/img/react_logo.png'))
]