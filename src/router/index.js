import { practiceRoute } from "./practice";
import { vrHouseRoute } from "./vr_house";
import { shaderRoute } from "./shader";
import { interactiveRoute } from "./interactive";
import { animationRoute } from "./animation";

export default [
  ...shaderRoute,
  ...interactiveRoute,
  ...vrHouseRoute,
  ...animationRoute,
  ...practiceRoute
]