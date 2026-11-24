import * as THREE from 'three';

export function createBathroom(materials) {
  const group = new THREE.Group();
  group.name = 'Bathroom';

  // Position within room: X: 1.8 to 4.9, Z: -2.2 to 0.8

  // 1. MODERN WHITE TOILET (Positioned against West interior wall)
  const toiletGroup = new THREE.Group();
  toiletGroup.name = 'Toilet';

  // Toilet Tank
  const tankGeo = new THREE.BoxGeometry(0.24, 0.72, 0.45);
  const tank = new THREE.Mesh(tankGeo, materials.whitePorcelain);
  tank.position.set(-0.2, 0.42, 0);
  tank.castShadow = true;
  toiletGroup.add(tank);

  // Flush button (chrome)
  const buttonGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.015, 12);
  const button = new THREE.Mesh(buttonGeo, materials.chrome);
  button.position.set(-0.2, 0.785, 0);
  toiletGroup.add(button);

  // Toilet Bowl
  const bowlGeo = new THREE.BoxGeometry(0.48, 0.4, 0.38);
  const bowl = new THREE.Mesh(bowlGeo, materials.whitePorcelain);
  bowl.position.set(0.12, 0.22, 0);
  bowl.castShadow = true;
  toiletGroup.add(bowl);

  // Toilet Seat & Lid
  const seatGeo = new THREE.BoxGeometry(0.46, 0.03, 0.36);
  const seat = new THREE.Mesh(seatGeo, materials.whitePorcelain);
  seat.position.set(0.12, 0.43, 0);
  toiletGroup.add(seat);

  toiletGroup.position.set(2.4, 0, -0.4);
  group.add(toiletGroup);

  // 2. FLOATING VANITY & VESSEL SINK (Along North wall of bathroom: Z = -2.0)
  const vanityGroup = new THREE.Group();
  vanityGroup.name = 'Vanity';

  // Floating Cabinet
  const cabGeo = new THREE.BoxGeometry(0.95, 0.42, 0.52);
  const cab = new THREE.Mesh(cabGeo, materials.trim);
  cab.position.set(0, 0.55, 0);
  cab.castShadow = true;
  vanityGroup.add(cab);

  // Countertop & Integrated Sink
  const sinkCounterGeo = new THREE.BoxGeometry(0.98, 0.04, 0.54);
  const sinkCounter = new THREE.Mesh(sinkCounterGeo, materials.whitePorcelain);
  sinkCounter.position.set(0, 0.78, 0);
  sinkCounter.castShadow = true;
  vanityGroup.add(sinkCounter);

  // Chrome Faucet
  const faucetBase = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.12, 12), materials.chrome);
  faucetBase.position.set(0, 0.86, -0.16);
  vanityGroup.add(faucetBase);

  const faucetSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.14, 8), materials.chrome);
  faucetSpout.rotation.x = Math.PI / 3;
  faucetSpout.position.set(0, 0.94, -0.1);
  vanityGroup.add(faucetSpout);

  // LED Backlit Mirror on Wall
  const mirrorFrameGeo = new THREE.BoxGeometry(0.75, 0.95, 0.03);
  const mirrorFrame = new THREE.Mesh(mirrorFrameGeo, materials.chrome);
  mirrorFrame.position.set(0, 1.45, -0.23);
  mirrorFrame.castShadow = true;
  vanityGroup.add(mirrorFrame);

  vanityGroup.position.set(3.8, 0, -1.9);
  group.add(vanityGroup);

  // 3. WALK-IN SHOWER GLASS PARTITION
  const showerGlassGeo = new THREE.BoxGeometry(0.02, 1.8, 1.2);
  const showerGlass = new THREE.Mesh(showerGlassGeo, materials.glass);
  showerGlass.position.set(4.0, 0.9, 0.0);
  group.add(showerGlass);

  // Shower fixtures (Chrome column and rain showerhead)
  const showerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.6, 8), materials.chrome);
  showerPipe.position.set(4.7, 1.1, 0.0);
  group.add(showerPipe);

  const rainHead = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16), materials.chrome);
  rainHead.position.set(4.5, 1.85, 0.0);
  group.add(rainHead);

  return group;
}
