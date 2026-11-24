import * as THREE from 'three';

export class CameraLightingController {
  constructor(scene, camera, controls, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.renderer = renderer;

    this.isFPSMode = false;
    this.fpsVelocity = new THREE.Vector3();
    this.fpsDirection = new THREE.Vector3();
    this.fpsMoveState = { forward: false, backward: false, left: false, right: false };
    this.fpsEuler = new THREE.Euler(0, 0, 0, 'YXZ');

    this.isAnimatingCamera = false;
    this.camTargetPos = new THREE.Vector3();
    this.camTargetLookAt = new THREE.Vector3();
    this.animStartTime = 0;
    this.animDuration = 1200;
    this.camStartPos = new THREE.Vector3();
    this.camStartLookAt = new THREE.Vector3();

    this.setupLights();
    this.setupFPS();
  }

  setupLights() {
    // Soft ambient fill light (balanced so direct sunlight creates realistic 3D depth)
    this.ambientLight = new THREE.AmbientLight(0xfff8ee, 0.28);
    this.scene.add(this.ambientLight);

    // Subtle hemisphere sky/lawn bounce
    this.hemiLight = new THREE.HemisphereLight(0xdcebf8, 0x36501d, 0.22);
    this.scene.add(this.hemiLight);

    // Primary Directional Sun Light (Matching the photo shadow angle: shining from North-West to South-East)
    this.sunLight = new THREE.DirectionalLight(0xfffaec, 2.3);
    this.sunLight.position.set(-18, 28, -14);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 4096;
    this.sunLight.shadow.mapSize.height = 4096;
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 80;
    this.sunLight.shadow.camera.left = -22;
    this.sunLight.shadow.camera.right = 22;
    this.sunLight.shadow.camera.top = 22;
    this.sunLight.shadow.camera.bottom = -22;
    this.sunLight.shadow.bias = -0.0001;
    this.sunLight.shadow.normalBias = 0.02;
    this.sunLight.shadow.radius = 2.0;
    this.scene.add(this.sunLight);

    // Warm Interior Downlights (balanced)
    this.interiorLights = [];
    const intLightConfigs = [
      { x: -3.2, y: 2.2, z: -4.0, color: 0xffe2ad, intensity: 0.45, distance: 7 }, // Kitchen Island
      { x: -3.4, y: 2.2, z: -0.1, color: 0xffdfaa, intensity: 0.45, distance: 7 }, // Dining
      { x: 3.4, y: 2.2, z: -4.5, color: 0xffe0a3, intensity: 0.48, distance: 7 }, // Sunroom
      { x: 3.4, y: 2.1, z: -0.7, color: 0xffffff, intensity: 0.50, distance: 6 }, // Bathroom LED
      { x: -3.4, y: 2.2, z: 4.2, color: 0xffdfaa, intensity: 0.45, distance: 7 }, // Office
      { x: 2.1, y: 2.2, z: 3.8, color: 0xffe0a8, intensity: 0.50, distance: 8 }, // Living Room
    ];

    intLightConfigs.forEach((cfg) => {
      const pl = new THREE.PointLight(cfg.color, cfg.intensity, cfg.distance, 1.2);
      pl.position.set(cfg.x, cfg.y, cfg.z);
      this.interiorLights.push(pl);
      this.scene.add(pl);
    });

    this.setTimeOfDay('day');
  }

  setTimeOfDay(mode) {
    if (mode === 'day') {
      this.renderer.toneMappingExposure = 1.0;
      this.sunLight.color.setHex(0xfffaec);
      this.sunLight.intensity = 2.3;
      this.sunLight.position.set(-18, 28, -14);
      this.ambientLight.intensity = 0.28;
      this.hemiLight.intensity = 0.22;
      this.scene.background = new THREE.Color(0x2d4718);
      this.interiorLights.forEach((pl) => (pl.intensity = 0.35));
    } else if (mode === 'sunset') {
      this.renderer.toneMappingExposure = 1.02;
      this.sunLight.color.setHex(0xff9840);
      this.sunLight.intensity = 2.4;
      this.sunLight.position.set(-24, 10, -18);
      this.ambientLight.intensity = 0.24;
      this.hemiLight.intensity = 0.20;
      this.scene.background = new THREE.Color(0x522818);
      this.interiorLights.forEach((pl) => (pl.intensity = 1.2));
    } else if (mode === 'night') {
      this.renderer.toneMappingExposure = 0.95;
      this.sunLight.color.setHex(0x406090);
      this.sunLight.intensity = 0.35;
      this.sunLight.position.set(-14, 22, -10);
      this.ambientLight.intensity = 0.12;
      this.hemiLight.intensity = 0.10;
      this.scene.background = new THREE.Color(0x0a1014);
      this.interiorLights.forEach((pl) => (pl.intensity = 1.8));
    }
  }

  animateToCamera(targetX, targetY, targetZ, lookX, lookY, lookZ, duration = 1200) {
    this.isFPSMode = false;
    this.controls.enabled = true;

    this.camStartPos.copy(this.camera.position);
    this.camStartLookAt.copy(this.controls.target);

    this.camTargetPos.set(targetX, targetY, targetZ);
    this.camTargetLookAt.set(lookX, lookY, lookZ);

    this.animDuration = duration;
    this.animStartTime = performance.now();
    this.isAnimatingCamera = true;
  }

  setupFPS() {
    window.addEventListener('keydown', (e) => {
      if (!this.isFPSMode) return;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.fpsMoveState.forward = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.fpsMoveState.backward = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.fpsMoveState.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.fpsMoveState.right = true;
    });

    window.addEventListener('keyup', (e) => {
      if (!this.isFPSMode) return;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.fpsMoveState.forward = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.fpsMoveState.backward = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.fpsMoveState.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.fpsMoveState.right = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isFPSMode || document.pointerLockElement !== this.renderer.domElement) return;
      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      this.fpsEuler.y -= movementX * 0.0022;
      this.fpsEuler.x -= movementY * 0.0022;
      this.fpsEuler.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.fpsEuler.x));

      this.camera.quaternion.setFromEuler(this.fpsEuler);
    });
  }

  enterFPSMode() {
    this.isFPSMode = true;
    this.controls.enabled = false;
    this.camera.position.set(0, 1.45, 1.2);
    this.fpsEuler.set(0, 0, 0, 'YXZ');
    this.camera.quaternion.setFromEuler(this.fpsEuler);
    this.renderer.domElement.requestPointerLock?.();
  }

  exitFPSMode() {
    this.isFPSMode = false;
    this.controls.enabled = true;
    if (document.pointerLockElement === this.renderer.domElement) {
      document.exitPointerLock?.();
    }
  }

  update(delta) {
    if (this.isAnimatingCamera) {
      const elapsed = performance.now() - this.animStartTime;
      const progress = Math.min(elapsed / this.animDuration, 1);
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(this.camStartPos, this.camTargetPos, ease);
      this.controls.target.lerpVectors(this.camStartLookAt, this.camTargetLookAt, ease);

      if (progress >= 1) {
        this.isAnimatingCamera = false;
      }
    }

    if (this.isFPSMode) {
      const speed = 4.2;
      this.fpsVelocity.set(0, 0, 0);

      const moveForward = (this.fpsMoveState.forward ? 1 : 0) - (this.fpsMoveState.backward ? 1 : 0);
      const moveRight = (this.fpsMoveState.right ? 1 : 0) - (this.fpsMoveState.left ? 1 : 0);

      if (moveForward !== 0 || moveRight !== 0) {
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
        right.y = 0;
        right.normalize();

        this.fpsVelocity.addScaledVector(forward, moveForward * speed * delta);
        this.fpsVelocity.addScaledVector(right, moveRight * speed * delta);

        this.camera.position.add(this.fpsVelocity);
        this.camera.position.y = 1.45; // Fixed architectural eye level
      }
    }
  }
}
