import { practiceRoute } from "./practice";
import { vrHouseRoute } from "./vr_house";
import { shaderRoute } from "./shader";
import { interactiveRoute } from "./interactive";
import { animationRoute } from "./animation";
import { materialRoute } from "./material";

export default [
  {
    title: "SHADER",
    children: shaderRoute
  },
  {
    title: "MATERIAL",
    children: materialRoute
  },
  {
    title: "INTERACTIVE",
    children: interactiveRoute
  },
  {
    title: "VRHOUSE",
    children: vrHouseRoute
  },
  // {
  //   title: "ANIMATION",
  //   children: animationRoute
  // },
  {
    title: "PRACTICE",
    children: practiceRoute
  }
]