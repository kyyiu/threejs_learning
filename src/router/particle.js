// import VideoTexture from "../practice/material/videoTexture";
// import Graffiti from '../practice/interactive/graffiti'
import { lazy } from "react";
import { createRouteItem } from './tools/createItem'

export const particleRoute = [
  createRouteItem("/sprite", lazy(() => import('../practice/particle/sprite')), "sprite粒子", require('../assets/img/react_logo.png'))
]