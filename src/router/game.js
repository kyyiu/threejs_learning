import CarRace from '../practice/game/car_race/main'

import { createRouteItem } from './tools/createItem'

export const gameRoute = [
  createRouteItem("/car_race", <CarRace/>, "直道赛车", require('../assets/img/react_logo.png'))
]