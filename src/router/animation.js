import { lazy } from 'react'
import { createRouteItem } from './tools/createItem'

export const animationRoute = [
  createRouteItem("/music_visible", lazy(() => import("../practice/animation/musicVisible")), "音频可视化", require('../assets/img/react_logo.png')),
  createRouteItem("/gltf_module_ani", lazy(() => import("../practice/animation/moduleAni")), "gltf模型动画", require('../assets/img/react_logo.png'))
]