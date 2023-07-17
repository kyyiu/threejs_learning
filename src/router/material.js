// import VideoTexture from "../practice/material/videoTexture";
// import Graffiti from '../practice/interactive/graffiti'
import { lazy } from "react";
import { createRouteItem } from './tools/createItem'

export const materialRoute = [
  createRouteItem("/video_texture", lazy(() => import('../practice/material/videoTexture')), "vedio纹理", require('../assets/img/react_logo.png')),
  createRouteItem("/graffiti",lazy(() => import('../practice/interactive/graffiti')), "canvas纹理涂鸦板", require('../assets/img/react_logo.png'))
]