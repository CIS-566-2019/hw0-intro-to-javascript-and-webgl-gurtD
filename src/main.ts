import {vec3} from 'gl-matrix';
import {vec4} from 'gl-matrix'
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
let shader: number = 0;
let color: vec4 = vec4.fromValues(1, 0, 0, 1);
const controls = {
  tesselations: 5,
  'Load Scene': loadScene, // A function pointer, essentially
  'Change Shader': changeShader,
  'Make Blue': makeBlue,
  'Make Red': makeRed,
  'Make Green': makeGreen
};

let icosphere: Icosphere;
let cube: Cube;
let square: Square;
let prevTesselations: number = 5;


function loadScene() {
  icosphere = new Icosphere(vec3.fromValues(0, 0, 0), 1, controls.tesselations);
  icosphere.create();
  cube = new Cube(vec3.fromValues(0, 0, 0));
  cube.create();
  square = new Square(vec3.fromValues(0, 0, 0));
  square.create();
}

function changeShader() {
  if (shader == 0) {
    shader = 1
  } else {
    shader = 0;
  }
}

function makeRed() {
  color = vec4.fromValues(1, 0, 0, 1);
}

function makeBlue() {
  color = vec4.fromValues(0, 0, 1, 1);
}

function makeGreen() {
  color = vec4.fromValues(0, 1, 0, 1);
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  
  gui.add(controls, 'tesselations', 0, 8).step(1);
  gui.add(controls, 'Load Scene');
  gui.add(controls, 'Change Shader');
  gui.add(controls, 'Make Red');
  gui.add(controls, 'Make Green');
  gui.add(controls, 'Make Blue');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 0, 5), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  const gradient = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/gradient-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/gradient-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    if(controls.tesselations != prevTesselations)
    {
      prevTesselations = controls.tesselations;
      icosphere = new Icosphere(vec3.fromValues(0, 0, 0), 1, prevTesselations);
      icosphere.create();
    }
    if (shader == 0) {
      renderer.render(camera, lambert, [
        //icosphere,
        cube,
        // square,
      ], color);
    } else {
      renderer.render(camera, gradient, [
        //icosphere,
        cube,
        // square,
      ], vec4.fromValues(1, 0, 0, 1));
    }
    
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();
