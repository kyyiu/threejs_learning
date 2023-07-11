import VrHouse from '../practice/vr_house/vrHouse'
import Hdr from '../practice/vr_house/hdr'

import { createRouteItem } from './tools/createItem'

export const vrHouseRoute = [
  createRouteItem("/vr_house", <VrHouse/>, "使用图片生成3d全景效果", require('../assets/img/react_logo.png')),
  createRouteItem("/hdr", <Hdr/>, "hdr文件使用，并生成3d球体全景效果", require('../assets/img/react_logo.png'))
]