import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

// Physical Sky & Ground HDR Environment Generator
export function setupEnvironment(renderer, scene) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Realistic architectural sky & garden bounce gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0.0, '#7baee2');  // Sky Zenith
  gradient.addColorStop(0.48, '#c2d8ed'); // Soft Horizon
  gradient.addColorStop(0.52, '#a5a092'); // Ground transition
  gradient.addColorStop(1.0, '#36531d');  // Deep garden bounce
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 512);

  const envTex = new THREE.CanvasTexture(canvas);
  envTex.colorSpace = THREE.SRGBColorSpace;
  envTex.mapping = THREE.EquirectangularReflectionMapping;

  const envMap = pmremGenerator.fromEquirectangular(envTex).texture;
  scene.environment = envMap;
  scene.background = new THREE.Color(0x2d4718); // Deep garden green perimeter

  envTex.dispose();
  pmremGenerator.dispose();
}

// Commercial-Grade Post-Processing Pipeline (GTAO + OutputPass ACES Filmic + FXAA)
export function createPostProcessing(renderer, scene, camera) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const composer = new EffectComposer(renderer);

  // 1. Scene Render Pass
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // 2. Ground Truth Ambient Occlusion (GTAO) - Rich, realistic contact shadows
  let gtaoPass = null;
  try {
    gtaoPass = new GTAOPass(scene, camera, width, height);
    gtaoPass.output = GTAOPass.OUTPUT.Default;
    gtaoPass.blendIntensity = 0.85;
    gtaoPass.scale = 1.0;
    gtaoPass.radius = 0.45;
    gtaoPass.distanceFallOff = 0.9;
    composer.addPass(gtaoPass);
  } catch (err) {
    console.warn('GTAOPass fallback:', err);
  }

  // 3. Output Pass (ACES Filmic Tone Mapping & sRGB conversion)
  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  // 4. Anti-Aliasing (FXAA using standard Three.js ShaderPass & FXAAShader)
  const fxaaPass = new ShaderPass(FXAAShader);
  const pixelRatio = renderer.getPixelRatio();
  fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
  fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);
  composer.addPass(fxaaPass);

  function resize(w, h) {
    composer.setSize(w, h);
    if (gtaoPass) gtaoPass.setSize(w, h);
    const pr = renderer.getPixelRatio();
    fxaaPass.material.uniforms['resolution'].value.x = 1 / (w * pr);
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (h * pr);
  }

  return { composer, resize };
}
