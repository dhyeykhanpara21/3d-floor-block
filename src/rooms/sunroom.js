import * as THREE from 'three';

export function createSunroom(materials) {
  const group = new THREE.Group();
  group.name = 'Sunroom';

  // 1. LIGHT AREA RUG
  const rugGeo = new THREE.BoxGeometry(3.6, 0.015, 2.8);
  const rug = new THREE.Mesh(rugGeo, materials.lightCarpet);
  rug.position.set(3.4, 0.008, -4.5);
  rug.receiveShadow = true;
  group.add(rug);

  // 2. 3-SEATER SOFA WITH 4 THROW PILLOWS (2 cream, 2 camel)
  const sofaGroup = new THREE.Group();
  sofaGroup.name = 'SunroomSofa';

  const baseGeo = new THREE.BoxGeometry(2.3, 0.26, 0.88);
  const base = new THREE.Mesh(baseGeo, materials.creamFabric);
  base.position.set(0, 0.22, 0);
  base.castShadow = true;
  sofaGroup.add(base);

  for (let i = 0; i < 3; i++) {
    const cushionGeo = new THREE.BoxGeometry(0.72, 0.14, 0.72);
    const cushion = new THREE.Mesh(cushionGeo, materials.creamFabric);
    cushion.position.set(-0.74 + i * 0.74, 0.38, 0.05);
    cushion.castShadow = true;
    sofaGroup.add(cushion);
  }

  const backGeo = new THREE.BoxGeometry(2.3, 0.45, 0.2);
  const back = new THREE.Mesh(backGeo, materials.creamFabric);
  back.position.set(0, 0.55, -0.36);
  back.castShadow = true;
  sofaGroup.add(back);

  // 4 Accent Pillows
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.1), materials.pillowCream);
  p1.position.set(-0.85, 0.52, -0.22);
  sofaGroup.add(p1);

  const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.1), materials.pillowCamel);
  p2.position.set(-0.45, 0.52, -0.22);
  sofaGroup.add(p2);

  const p3 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.1), materials.pillowCamel);
  p3.position.set(0.45, 0.52, -0.22);
  sofaGroup.add(p3);

  const p4 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.1), materials.pillowCream);
  p4.position.set(0.85, 0.52, -0.22);
  sofaGroup.add(p4);

  sofaGroup.position.set(3.4, 0, -5.4);
  group.add(sofaGroup);

  // 3. FLANKING SIDE TABLES WITH GLOWING GLOBE LAMPS
  for (let sx of [1.9, 4.9]) {
    const sideTable = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.5, 16), materials.darkWood);
    sideTable.position.set(sx, 0.25, -5.5);
    sideTable.castShadow = true;
    group.add(sideTable);

    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), materials.globeGlow);
    globe.position.set(sx, 0.62, -5.5);
    group.add(globe);
  }

  // 4. MARBLE COFFEE TABLE WITH SUCCULENT PLANTER & BOOKS
  const tableGroup = new THREE.Group();
  tableGroup.name = 'SunroomCoffeeTable';

  const tableTopGeo = new THREE.BoxGeometry(1.4, 0.06, 0.75);
  const tableTop = new THREE.Mesh(tableTopGeo, materials.marble);
  tableTop.position.y = 0.38;
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  tableGroup.add(tableTop);

  const basePlinthGeo = new THREE.BoxGeometry(1.2, 0.34, 0.55);
  const basePlinth = new THREE.Mesh(basePlinthGeo, materials.darkWood);
  basePlinth.position.y = 0.17;
  basePlinth.castShadow = true;
  tableGroup.add(basePlinth);

  // Book stack & Succulent
  const book = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.35), materials.darkFabric);
  book.position.set(-0.25, 0.43, 0);
  tableGroup.add(book);

  const succulent = new THREE.Mesh(new THREE.DodecahedronGeometry(0.1, 1), materials.foliageGreen);
  succulent.position.set(0.25, 0.45, 0);
  tableGroup.add(succulent);

  tableGroup.position.set(3.4, 0, -4.0);
  group.add(tableGroup);

  return group;
}
