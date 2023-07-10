import * as Three from 'three'

/** 获取物体在画布上的浏览器界面坐标 */
export const getObjInCanvasCoordinate = function(object, renderer, camera) {
  // 参考 https://stackoverflow.com/questions/27409074/converting-3d-position-to-2d-screen-position-r69
  const v = new Three.Vector3();
  object.updateMatrixWorld();
  v.setFromMatrixPosition(object.matrixWorld)
  v.project(camera)
  var widthHalf = 0.5* renderer.domElement.width;
  var heightHalf = 0.5* renderer.domElement.height;

  // var eltx = (1 + projected.x) * container.current.offsetWidth / 2 ;
  // var elty = (1 - projected.y) * container.current.offsetHeight / 2;
  var eltx = ( v.x * widthHalf ) + widthHalf;
  var elty = - ( v.y * heightHalf ) + heightHalf;
  
  var offset = renderer.domElement;	
  eltx += offset.offsetLeft;
  elty += offset.offsetTop;
    
  return { x : eltx, y : elty };
}

export default {
  getObjInCanvasCoordinate
}