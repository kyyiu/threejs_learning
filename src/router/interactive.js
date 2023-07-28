// import ClickItem from '../practice/interactive/clickItem'
// import PopDialog from '../practice/interactive/popDialog'
import { lazy } from 'react'
import { createRouteItem } from './tools/createItem'

export const interactiveRoute = [
  createRouteItem("/click_item", lazy(() => import("../practice/interactive/clickItem")), "物体点击", require('../assets/img/react_logo.png')),
  createRouteItem("/pop_dialog", lazy(() => import("../practice/interactive/popDialog")), "鼠标处理物体检测", require('../assets/img/react_logo.png')),
  createRouteItem("/canvas_pen", lazy(() => import("../practice/interactive/drawOnCanvas")), "画笔", require('../assets/img/react_logo.png'))
]