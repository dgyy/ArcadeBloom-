import { vec2, setGravity, engineInit, mainContext, setCanvasFixedSize, mainCanvas } from './littlejs';

import { drawTouchLine, updateMouseControls } from './inputUtils';
import { black } from './colors';
import { emit } from './gameEvents';
import { SceneManager } from './SceneManager';
import { renderBackgroundScroll } from './backgroundScroll';

// const kabutoEmblem =
//   'M51.793,70.012C46.372,73.975 22.116,73.975 16.695,70.012C13.893,67.963 7.256,48.475 7.695,25.012C8.135,1.549 -2.816,-0.175 0.695,0.012C13.195,0.679 20.862,5.679 28.695,20.012C28.695,20.012 17.792,18.522 16.695,32.012C16.321,36.618 17.862,54.512 20.695,61.012C22.499,65.149 45.99,65.149 47.793,61.012C50.626,54.512 52.167,36.618 51.793,32.012C50.697,18.522 39.793,20.012 39.793,20.012C47.626,5.679 55.293,0.679 67.793,0.012C71.304,-0.175 60.354,1.549 60.793,25.012C61.233,48.475 54.595,67.963 51.793,70.012Z';
// const kabutoHelmFront =
//   'M30.55,6.889C36.139,-2.296 62.99,-2.296 68.579,6.889C74.168,16.074 103.016,61.023 98.55,63.889C94.084,66.755 91.403,58.877 73.256,56.939C66.873,56.352 59.08,55.939 49.66,55.888C49.596,55.888 49.532,55.888 49.469,55.888C40.048,55.939 32.256,56.352 25.872,56.939C7.726,58.877 5.624,63.729 0.579,61.889C-4.466,60.049 24.961,16.074 30.55,6.889Z';
// const kabutoHelmBack =
//   'M89.861,33.262C88.905,23.605 81.516,7.936 70.934,4.045C52.566,-2.709 29.23,0.112 18.201,4.411C7.577,8.552 3.118,22.96 0,31.137C3.487,30.202 8.346,27.444 20.971,26.096C27.355,25.508 35.147,25.095 44.567,25.045C44.631,25.045 44.695,25.045 44.759,25.045C54.179,25.095 61.972,25.508 68.355,26.096C81.324,27.48 86.394,31.899 89.861,33.262Z';
// const kabutoEarL =
//   'M7.343,21.62C10.545,21.62 17.455,4.029 15.343,1.62C13.23,-0.788 2.151,-0.277 1.343,1.62C0.535,3.517 -0.568,13.099 0.343,13.62C1.254,14.141 6.843,21.62 7.343,21.62Z';
// const kabutoEarR =
//   'M8.394,21.62C5.193,21.62 -1.718,4.029 0.394,1.62C2.507,-0.788 13.587,-0.277 14.394,1.62C15.202,3.517 16.306,13.099 15.394,13.62C14.483,14.141 8.894,21.62 8.394,21.62Z';
// const kabutoCap =
//   'M26.448,0.401C4.138,0.69 3.298,-2.068 0.448,4.401C-2.402,10.87 8.62,15.563 25.997,15.401C44.354,15.23 54.61,12.374 52.448,5.373C50.286,-1.628 48.757,0.112 26.448,0.401Z';
let sceneManager: SceneManager;
function gameInit() {
  setGravity(-0.01);
  setCanvasFixedSize(vec2(640, 1136)); // iPhone SE resolution
  sceneManager = new SceneManager();
  // const bambooSvg = new MySvg(bambooPath, null, 'green', 'green', vec2(222, 222));
  // const mongolHelmTop = new MySvg(mongolHemlTopPath, null, red, red, vec2(383, 116));
  // const mongolHelmMain = new MySvg(mongolHemlMainPath, null, '#D6D6D6', '#D6D6D6', vec2(333, 156));
  // const bambooSvg2 = new MySvg(bambooPath, null, 'green', 'green', vec2(244, 252));
  // const bambooSvg3 = new MySvg(bambooPath, null, 'green', 'green', vec2(255, 200));
  // const kabutoEmblemSvg = new MySvg(kabutoEmblem, null, 'gold', 'gold', vec2(115, 100));
  // const kabutoHelmFrontSvg = new MySvg(kabutoHelmFront, null, 'white', 'white', vec2(100, 135));
  // const kabutoHelmBackSvg = new MySvg(kabutoHelmBack, null, 'gray', 'gray', vec2(105, 166));
  // const kabutoEarLSvg = new MySvg(kabutoEarL, null, 'gold', 'gold', vec2(174, 155));
  // const kabutoEarRSvg = new MySvg(kabutoEarR, null, 'gold', 'gold', vec2(110, 155));
  // const kabutoCapSvg = new MySvg(kabutoCap, null, 'orange', 'orange', vec2(123, 166));
}

function gameUpdate() {
  emit('tick');
  updateMouseControls();
  sceneManager.update();
}

function gameUpdatePost() {
  // called after physics and objects are updated
  // setup camera and prepare for render
}

function gameRender() {
  // called before objects are rendered
  // draw any background effects that appear behind objects

  const ctx = mainContext;
  mainCanvas.style.background = black;
  renderBackgroundScroll(ctx);
  sceneManager.render(ctx);
  drawTouchLine(ctx);
}

function gameRenderPost() {
  // called after objects are rendered
  // draw effects or hud that appear above all objects
}
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
