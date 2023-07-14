import { practiceRoute } from "./practice";
import { vrHouseRoute } from "./vr_house";
import { shaderRoute } from "./shader";
import { interactiveRoute } from "./interactive";
import { animationRoute } from "./animation";
import { materialRoute } from "./material";
import { gameRoute } from "./game";

export default [
  {
    title: 'Game',
    children: gameRoute
  },
  {
    title: 'Shader',
    children: shaderRoute
  },
  {
    title: 'Material',
    children: materialRoute
  },
  {
    title: 'Interactive',
    children: interactiveRoute
  },
  {
    title: 'vrHouse',
    children: vrHouseRoute
  },
  // {
  //   title: 'Animation',
  //   children: animationRoute
  // },
  {
    title: 'Practice',
    children: practiceRoute
  }
]