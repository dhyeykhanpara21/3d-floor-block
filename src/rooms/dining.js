import * as THREE from 'three';

export function createDining(materials) {
  const group = new THREE.Group();
  group.name = 'Dining';

  // 1. OAK DINING TABLE
  const tableGroup = new THREE.Group();
  tableGroup.name = 'DiningTable';

  const topGeo = new THREE.BoxGeometry(2.3, 0.05, 1.15);
  const tabletop = new THREE.Mesh(topGeo, materials.naturalOak);
  tabletop.position.y = 0.74;
  tabletop.castShadow = true;
  tabletop.receiveShadow = true;
  tableGroup.add(tabletop);

  const legGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.72, 8);
  const legPositions = [
    { x: -0.95, z: -0.42, rx: -0.05, rz: 0.05 },
    { x: 0.95, z: -0.42, rx: -0.05, rz: -0.05 },
    { x: -0.95, z: 0.42, rx: 0.05, rz: 0.05 },
    { x: 0.95, z: 0.42, rx: 0.05, rz: -0.05 },
  ];
  legPositions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeo, materials.blackMetal);
    leg.position.set(pos.x, 0.36, pos.z);
    leg.rotation.x = pos.rx;
    leg.rotation.z = pos.rz;
    leg.castShadow = true;
    tableGroup.add(leg);
  });

  // Centerpiece: Low ceramic vase with white flowers (matching callout!)
  const vaseGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.14, 16);
  const vase = new THREE.Mesh(vaseGeo, materials.whitePorcelain);
  vase.position.set(0, 0.83, 0);
  vase.castShadow = true;
  tableGroup.add(vase);

  const flowerGeo = new THREE.DodecahedronGeometry(0.14, 1);
  const flowers = new THREE.Mesh(flowerGeo, materials.wallTop);
  flowers.position.set(0, 0.95, 0);
  tableGroup.add(flowers);

  tableGroup.position.set(-3.4, 0, -0.1);
  group.add(tableGroup);

  // 2. SIX SCANDINAVIAN DINING CHAIRS
  function createDiningChair(x, z, rotY) {
    const chairGroup = new THREE.Group();

    const seatGeo = new THREE.BoxGeometry(0.44, 0.06, 0.44);
    const seat = new THREE.Mesh(seatGeo, materials.darkFabric);
    seat.position.y = 0.45;
    seat.castShadow = true;
    chairGroup.add(seat);

    const backGeo = new THREE.BoxGeometry(0.42, 0.38, 0.05);
    const back = new THREE.Mesh(backGeo, materials.darkFabric);
    back.position.set(0, 0.65, -0.2);
    back.rotation.x = -0.1;
    back.castShadow = true;
    chairGroup.add(back);

    const legGeo = new THREE.CylinderGeometry(0.012, 0.008, 0.44, 8);
    const chairLegs = [
      { x: -0.18, z: -0.18 },
      { x: 0.18, z: -0.18 },
      { x: -0.18, z: 0.18 },
      { x: 0.18, z: 0.18 },
    ];
    chairLegs.forEach((l) => {
      const leg = new THREE.Mesh(legGeo, materials.blackMetal);
      leg.position.set(l.x, 0.22, l.z);
      leg.castShadow = true;
      chairGroup.add(leg);
    });

    chairGroup.position.set(x, 0, z);
    chairGroup.rotation.y = rotY;
    group.add(chairGroup);
  }

  createDiningChair(-4.0, -0.85, 0);
  createDiningChair(-2.8, -0.85, 0);
  createDiningChair(-4.0, 0.65, Math.PI);
  createDiningChair(-2.8, 0.65, Math.PI);
  createDiningChair(-4.75, -0.1, Math.PI / 2);
  createDiningChair(-2.05, -0.1, -Math.PI / 2);

  return group;
}
