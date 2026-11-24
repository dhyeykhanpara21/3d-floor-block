import * as THREE from 'three';

export function createLiving(materials) {
  const group = new THREE.Group();
  group.name = 'LivingRoom';

  // 1. LARGE CHARCOAL AREA RUG
  const rugGeo = new THREE.BoxGeometry(3.8, 0.015, 3.2);
  const rug = new THREE.Mesh(rugGeo, materials.darkCarpet);
  rug.position.set(2.0, 0.008, 4.0);
  rug.receiveShadow = true;
  group.add(rug);

  // 2. LARGE CREAM MODULAR SECTIONAL SOFA
  const sofaGroup = new THREE.Group();
  sofaGroup.name = 'SectionalSofa';

  const mainBaseGeo = new THREE.BoxGeometry(1.0, 0.28, 3.2);
  const mainBase = new THREE.Mesh(mainBaseGeo, materials.creamFabric);
  mainBase.position.set(0, 0.2, 0);
  mainBase.castShadow = true;
  mainBase.receiveShadow = true;
  sofaGroup.add(mainBase);

  for (let s = 0; s < 3; s++) {
    const seatCushionGeo = new THREE.BoxGeometry(0.88, 0.16, 0.98);
    const seatCushion = new THREE.Mesh(seatCushionGeo, materials.creamFabric);
    seatCushion.position.set(0.04, 0.38, -1.0 + s * 1.0);
    seatCushion.castShadow = true;
    sofaGroup.add(seatCushion);
  }

  const mainBackGeo = new THREE.BoxGeometry(0.24, 0.5, 3.2);
  const mainBack = new THREE.Mesh(mainBackGeo, materials.creamFabric);
  mainBack.position.set(-0.38, 0.56, 0);
  mainBack.castShadow = true;
  sofaGroup.add(mainBack);

  sofaGroup.position.set(0.4, 0, 3.8);
  group.add(sofaGroup);

  // 3. DARK STONE COFFEE TABLE WITH WHITE FLOWERS & ART BOOKS
  const coffeeTableGroup = new THREE.Group();
  coffeeTableGroup.name = 'LivingCoffeeTable';

  const tableTopGeo = new THREE.BoxGeometry(1.5, 0.06, 0.8);
  const tableTop = new THREE.Mesh(tableTopGeo, materials.darkWood);
  tableTop.position.y = 0.34;
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  coffeeTableGroup.add(tableTop);

  const tableBaseGeo = new THREE.BoxGeometry(1.3, 0.31, 0.6);
  const tableBase = new THREE.Mesh(tableBaseGeo, materials.blackMetal);
  tableBase.position.y = 0.155;
  tableBase.castShadow = true;
  coffeeTableGroup.add(tableBase);

  // White flower vase on coffee table
  const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.14, 16), materials.whitePorcelain);
  vase.position.set(0, 0.44, 0);
  coffeeTableGroup.add(vase);

  const flowers = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12, 1), materials.wallTop);
  flowers.position.set(0, 0.54, 0);
  coffeeTableGroup.add(flowers);

  // Art books stack
  const books = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.03, 0.32), materials.marble);
  books.position.set(-0.35, 0.38, 0);
  coffeeTableGroup.add(books);

  coffeeTableGroup.position.set(2.0, 0, 3.8);
  group.add(coffeeTableGroup);

  // 4. DESIGNER ACCENT LOUNGE CHAIR (Dark grey fabric with angled legs)
  const chairGroup = new THREE.Group();
  chairGroup.name = 'AccentLoungeChair';

  const seatGeo = new THREE.BoxGeometry(0.72, 0.14, 0.68);
  const seat = new THREE.Mesh(seatGeo, materials.darkFabric);
  seat.position.y = 0.36;
  seat.castShadow = true;
  chairGroup.add(seat);

  const backGeo = new THREE.BoxGeometry(0.7, 0.48, 0.12);
  const back = new THREE.Mesh(backGeo, materials.darkFabric);
  back.position.set(0, 0.58, -0.32);
  back.rotation.x = -0.22;
  back.castShadow = true;
  chairGroup.add(back);

  const legGeo = new THREE.CylinderGeometry(0.016, 0.012, 0.36, 8);
  for (let cp of [
    { x: -0.3, z: -0.25 }, { x: 0.3, z: -0.25 },
    { x: -0.3, z: 0.25 }, { x: 0.3, z: 0.25 },
  ]) {
    const leg = new THREE.Mesh(legGeo, materials.chrome);
    leg.position.set(cp.x, 0.16, cp.z);
    chairGroup.add(leg);
  }

  chairGroup.position.set(3.4, 0, 5.1);
  chairGroup.rotation.y = -Math.PI / 4 - 0.2;
  group.add(chairGroup);

  // 5. ROUND BLUE ACCENT PEDESTAL TABLE (Near Hallway)
  const blueTable = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.7, 24), materials.blueAccent);
  blueTable.position.set(1.8, 0.35, 1.8);
  blueTable.castShadow = true;
  group.add(blueTable);

  // 6. LOW MEDIA CONSOLE / SIDEBOARD (East wall)
  const consoleGroup = new THREE.Group();
  consoleGroup.name = 'MediaConsole';

  const consoleMesh = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.52, 1.8), materials.wall);
  consoleMesh.position.y = 0.32;
  consoleMesh.castShadow = true;
  consoleGroup.add(consoleMesh);

  const consoleTop = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 1.84), materials.naturalOak);
  consoleTop.position.y = 0.6;
  consoleTop.castShadow = true;
  consoleGroup.add(consoleTop);

  consoleGroup.position.set(4.65, 0, 2.8);
  group.add(consoleGroup);

  return group;
}
