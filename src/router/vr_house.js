// import VrHouse from '../practice/vr_house/vrHouse'
// import Hdr from '../practice/vr_house/hdr'
import { lazy } from 'react'

import { createRouteItem } from './tools/createItem'

export const vrHouseRoute = [
  createRouteItem("/vr_house", lazy(() => import('../practice/vr_house/vrHouse')), "使用图片生成3d全景效果", require('../assets/img/react_logo.png')),
  createRouteItem("/hdr",  lazy(() => import('../practice/vr_house/hdr')), "hdr文件使用，并生成3d球体全景效果", require('../assets/img/react_logo.png'))
]