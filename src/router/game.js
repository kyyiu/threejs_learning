// import CarRace from '../practice/game/car_race/main'
import { lazy } from 'react'
import { createRouteItem } from './tools/createItem'

export const gameRoute = [
  createRouteItem("/car_race", lazy(() => import("../practice/game/car_race/main")), "obj、mtl文件使用", require('../assets/img/react_logo.png')),
  createRouteItem("/plane", lazy(() => import("../practice/game/plane/main")), "飞机", require('../assets/img/react_logo.png'))
]