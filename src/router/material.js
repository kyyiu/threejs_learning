import VideoTexture from "../practice/material/videoTexture";
import Graffiti from '../practice/interactive/graffiti'

import { createRouteItem } from './tools/createItem'

export const materialRoute = [
  createRouteItem("/video_texture", <VideoTexture/>, "vedio纹理", require('../assets/img/react_logo.png')),
  createRouteItem("/graffiti", <Graffiti/>, "canvas纹理涂鸦板", require('../assets/img/react_logo.png'))
]