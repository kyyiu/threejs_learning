import { lazy } from 'react'
import { createRouteItem } from './tools/createItem'

export const animationRoute = [
  createRouteItem("/music_visible", lazy(() => import("../practice/animation/musicVisible")), "音频可视化", require('../assets/img/react_logo.png'))
]