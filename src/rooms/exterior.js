import * as THREE from 'three';

export function createExterior(materials) {
  const group = new THREE.Group();
  group.name = 'ExteriorLandscaping';

  // 1. WEST PATIO ORGANIC PINK FLOWERING BUSHES
  function createFlowerBush(x, z, radius = 0.45) {
    const bush = new THREE.Group();
    const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(radius, 2), materials.foliageGreen);
    foliage.scale.set(1.15, 0.78, 1.15);
    foliage.position.y = radius * 0.65;
    foliage.castShadow = true;
    bush.add(foliage);

    for (let f = 0; f < 6; f++) {
      const fAngle = (f / 6) * Math.PI * 2 + Math.random() * 0.2;
      const fDist = radius * (0.35 + Math.random() * 0.35);
      const flower = new THREE.Mesh(new THREE.DodecahedronGeometry(radius * 0.3, 1), materials.pinkFlowers);
      flower.position.set(Math.cos(fAngle) * fDist, radius * 0.82 + (f % 2) * 0.08, Math.sin(fAngle) * fDist);
      flower.castShadow = true;
      bush.add(flower);
    }
    bush.position.set(x, 0, z);
    return bush;
  }

  for (let z = -4.5; z <= 2.5; z += 0.85) {
    group.add(createFlowerBush(-9.75, z, 0.45));
  }
  for (let x = -9.2; x <= -6.0; x += 0.85) {
    group.add(createFlowerBush(x, -4.8, 0.42));
  }
  for (let x = -9.2; x <= -6.0; x += 0.85) {
    group.add(createFlowerBush(x, 2.8, 0.42));
  }

  // 2. BURGUNDY JAPANESE MAPLE TREE (Top Right, matching photo!)
  const mapleGroup = createRealisticTree({
    trunkHeight: 2.8,
    foliageRadius: 2.8,
    matDark: materials.mapleBurgundy,
    matLight: materials.mapleBurgundyLight,
    trunkMaterial: materials.treeTrunk,
  });
  mapleGroup.position.set(7.8, 0, -8.2);
  group.add(mapleGroup);

  // 3. PERIMETER GREEN DECIDUOUS TREES
  const treePositions = [
    { x: -11.0, z: -8.8, s: 1.15 },
    { x: -11.8, z: 2.2, s: 1.2 },
    { x: -10.8, z: 8.8, s: 1.05 },
    { x: -4.8, z: -10.8, s: 1.1 },
    { x: 1.8, z: -10.8, s: 1.2 },
    { x: 11.2, z: -10.5, s: 1.1 },
    { x: 12.0, z: 7.2, s: 1.05 },
  ];

  treePositions.forEach((tp) => {
    const tree = createRealisticTree({
      trunkHeight: 2.6 * tp.s,
      foliageRadius: 2.3 * tp.s,
      matDark: materials.foliageGreen,
      matLight: materials.foliageGreenLight,
      trunkMaterial: materials.treeTrunk,
    });
    tree.position.set(tp.x, 0, tp.z);
    group.add(tree);
  });

  // 4. FOUNDATION SHRUBBERY
  const bushPositions = [
    { x: -6.4, z: 6.8, r: 0.65 },
    { x: -4.8, z: 7.2, r: 0.6 },
    { x: -1.2, z: 7.0, r: 0.55 },
    { x: 5.6, z: 7.6, r: 0.55 },
    { x: 8.8, z: 7.2, r: 0.7 },
    { x: 9.2, z: 4.5, r: 0.6 },
    { x: 9.0, z: 1.2, r: 0.65 },
    { x: 6.8, z: -6.8, r: 0.6 },
  ];

  bushPositions.forEach((bp) => {
    const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(bp.r, 2), materials.foliageGreen);
    bush.position.set(bp.x, bp.r * 0.72, bp.z);
    bush.scale.set(1.15, 0.82, 1.15);
    bush.castShadow = true;
    bush.receiveShadow = true;
    group.add(bush);
  });

  return group;
}

function createRealisticTree({ trunkHeight, foliageRadius, matDark, matLight, trunkMaterial }) {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.32, trunkHeight, 12), trunkMaterial);
  trunk.position.y = trunkHeight / 2;
  trunk.castShadow = true;
  tree.add(trunk);

  const branchConfigs = [
    { len: 1.4, rad: 0.09, rx: 0.35, rz: 0.4, y: trunkHeight * 0.68 },
    { len: 1.5, rad: 0.09, rx: -0.3, rz: -0.35, y: trunkHeight * 0.72 },
    { len: 1.3, rad: 0.08, rx: 0.25, rz: -0.4, y: trunkHeight * 0.75 },
    { len: 1.2, rad: 0.07, rx: -0.35, rz: 0.3, y: trunkHeight * 0.8 },
  ];

  branchConfigs.forEach((b) => {
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(b.rad * 0.6, b.rad, b.len, 8), trunkMaterial);
    branch.position.y = b.y;
    branch.rotation.x = b.rx;
    branch.rotation.z = b.rz;
    branch.castShadow = true;
    tree.add(branch);
  });

  const canopyGroup = new THREE.Group();
  const clusters = [
    { x: 0, y: 0.2, z: 0, r: foliageRadius, isLight: false },
    { x: foliageRadius * 0.48, y: -0.15, z: foliageRadius * 0.38, r: foliageRadius * 0.76, isLight: true },
    { x: -foliageRadius * 0.44, y: -0.12, z: -foliageRadius * 0.32, r: foliageRadius * 0.78, isLight: false },
    { x: -foliageRadius * 0.38, y: 0.35, z: foliageRadius * 0.42, r: foliageRadius * 0.68, isLight: true },
    { x: foliageRadius * 0.34, y: 0.42, z: -foliageRadius * 0.38, r: foliageRadius * 0.72, isLight: true },
    { x: 0, y: foliageRadius * 0.55, z: 0, r: foliageRadius * 0.62, isLight: true },
    { x: -foliageRadius * 0.22, y: -0.32, z: foliageRadius * 0.48, r: foliageRadius * 0.65, isLight: false },
    { x: foliageRadius * 0.32, y: -0.28, z: -foliageRadius * 0.45, r: foliageRadius * 0.68, isLight: false },
  ];

  clusters.forEach((cl) => {
    const cluster = new THREE.Mesh(new THREE.DodecahedronGeometry(cl.r, 2), cl.isLight ? matLight : matDark);
    cluster.position.set(cl.x, cl.y, cl.z);
    cluster.scale.set(1.12, 0.9, 1.12);
    cluster.castShadow = true;
    cluster.receiveShadow = true;
    canopyGroup.add(cluster);
  });

  canopyGroup.position.y = trunkHeight + foliageRadius * 0.25;
  tree.add(canopyGroup);

  return tree;
}
