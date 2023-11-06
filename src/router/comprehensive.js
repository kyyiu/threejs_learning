// import CarRace from '../practice/game/car_race/main'
import { lazy } from 'react'
import { createRouteItem } from './tools/createItem'

export const comprehensiveRoute = [
  createRouteItem("/city", lazy(() => import('../practice/comprehensive/city')), "城市", require('../assets/img/react_logo.png')),
]