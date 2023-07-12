import { practiceRoute } from "./practice";
import { vrHouseRoute } from "./vr_house";
import { shaderRoute } from "./shader";
import { interactiveRoute } from "./interactive";
import { animationRoute } from "./animation";
import { materialRoute } from "./material";

export default [
  ...shaderRoute,
  ...materialRoute,
  ...interactiveRoute,
  ...vrHouseRoute,
  ...animationRoute,
  ...practiceRoute
]