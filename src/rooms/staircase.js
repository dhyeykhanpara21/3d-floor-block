import * as THREE from 'three';

export function createStaircase(materials) {
  const group = new THREE.Group();
  group.name = 'Staircase';

  // Middle landing platform at Z = -1.8, Y = 0.85
  const landingGeo = new THREE.BoxGeometry(1.6, 0.1, 1.1);
  const landing = new THREE.Mesh(landingGeo, materials.woodFloor);
  landing.position.set(0.65, 0.85, -1.8);
  landing.castShadow = true;
  landing.receiveShadow = true;
  group.add(landing);

  // Lower Flight: Ascending from Hallway (Z = -0.5) to Landing (Z = -1.8)
  for (let st = 0; st < 5; st++) {
    const sy = (st + 1) * 0.17;
    const sz = -0.5 - st * 0.26;

    const block = new THREE.Mesh(new THREE.BoxGeometry(0.8, sy, 0.26), materials.wall);
    block.position.set(0.25, sy / 2, sz);
    block.castShadow = true;
    group.add(block);

    const tread = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.035, 0.29), materials.naturalOak);
    tread.position.set(0.25, sy + 0.018, sz);
    tread.castShadow = true;
    group.add(tread);

    const picket = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.85, 8), materials.blackMetal);
    picket.position.set(0.65, sy + 0.44, sz);
    picket.castShadow = true;
    group.add(picket);
  }

  // Upper Flight: Ascending from Landing (Z = -1.6) to Sunroom Level (Z = -0.6)
  for (let st = 0; st < 4; st++) {
    const sy = 0.95 + (st + 1) * 0.17;
    const sz = -1.6 + st * 0.26;

    const block = new THREE.Mesh(new THREE.BoxGeometry(0.8, sy, 0.26), materials.wall);
    block.position.set(1.05, sy / 2, sz);
    block.castShadow = true;
    group.add(block);

    const tread = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.035, 0.29), materials.naturalOak);
    tread.position.set(1.05, sy + 0.018, sz);
    tread.castShadow = true;
    group.add(tread);

    const picket = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.85, 8), materials.blackMetal);
    picket.position.set(0.65, sy + 0.44, sz);
    picket.castShadow = true;
    group.add(picket);
  }

  // Blonde Oak Handrail capping the balustrade
  const railGeo = new THREE.BoxGeometry(0.05, 0.04, 1.8);
  const rail = new THREE.Mesh(railGeo, materials.naturalOak);
  rail.position.set(0.65, 1.35, -1.1);
  rail.castShadow = true;
  group.add(rail);

  return group;
}
