// import CarRace from '../practice/game/car_race/main'
import { lazy } from 'react'
import { createRouteItem } from './tools/createItem'

export const gameRoute = [
  createRouteItem("/car_race", lazy(() => import("../practice/game/car_race/main")), "直道赛车", require('../assets/img/react_logo.png'))
]