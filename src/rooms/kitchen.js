import * as THREE from 'three';

export function createKitchen(materials) {
  const group = new THREE.Group();
  group.name = 'Kitchen';

  // 1. BASE CABINETS & MARBLE WORKTOP
  const backCounterGeo = new THREE.BoxGeometry(4.6, 0.88, 0.7);
  const backCounter = new THREE.Mesh(backCounterGeo, materials.trim);
  backCounter.position.set(-3.3, 0.44, -6.15);
  backCounter.castShadow = true;
  backCounter.receiveShadow = true;
  group.add(backCounter);

  const backTopGeo = new THREE.BoxGeometry(4.64, 0.05, 0.74);
  const backTop = new THREE.Mesh(backTopGeo, materials.marble);
  backTop.position.set(-3.3, 0.905, -6.15);
  backTop.castShadow = true;
  group.add(backTop);

  // Tall Cabinet Unit with Refrigerator insert
  const westTallGeo = new THREE.BoxGeometry(0.7, 1.8, 1.8);
  const westTall = new THREE.Mesh(westTallGeo, materials.trim);
  westTall.position.set(-5.35, 0.9, -5.3);
  westTall.castShadow = true;
  group.add(westTall);

  const fridgeGeo = new THREE.BoxGeometry(0.04, 1.6, 0.85);
  const fridge = new THREE.Mesh(fridgeGeo, materials.chrome);
  fridge.position.set(-4.98, 0.9, -5.2);
  group.add(fridge);

  // 2. STAINLESS STEEL SINK & FAUCET UNDER WINDOW
  const sinkBasinGeo = new THREE.BoxGeometry(0.75, 0.35, 0.45);
  const sinkBasin = new THREE.Mesh(sinkBasinGeo, materials.chrome);
  sinkBasin.position.set(-3.3, 0.75, -6.15);
  group.add(sinkBasin);

  const faucetBase = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.12, 12), materials.chrome);
  faucetBase.position.set(-3.3, 0.98, -6.32);
  group.add(faucetBase);

  // 3. APPLIANCES & CALLOUT ACCESSORIES
  // Espresso machine in corner
  const espressoGeo = new THREE.BoxGeometry(0.28, 0.34, 0.32);
  const espresso = new THREE.Mesh(espressoGeo, materials.blackMetal);
  espresso.position.set(-4.8, 1.07, -6.15);
  espresso.castShadow = true;
  group.add(espresso);

  // Wooden cutting board & knife block
  const boardGeo = new THREE.BoxGeometry(0.35, 0.025, 0.28);
  const board = new THREE.Mesh(boardGeo, materials.naturalOak);
  board.position.set(-2.2, 0.94, -6.15);
  group.add(board);

  const knifeGeo = new THREE.BoxGeometry(0.16, 0.24, 0.18);
  const knifeBlock = new THREE.Mesh(knifeGeo, materials.darkWood);
  knifeBlock.position.set(-1.6, 1.05, -6.22);
  knifeBlock.castShadow = true;
  group.add(knifeBlock);

  // Cooktop & Stainless Hood
  const cooktopGeo = new THREE.BoxGeometry(0.75, 0.02, 0.5);
  const cooktop = new THREE.Mesh(cooktopGeo, materials.blackMetal);
  cooktop.position.set(-4.6, 0.935, -6.15);
  group.add(cooktop);

  const hoodBaseGeo = new THREE.BoxGeometry(0.85, 0.12, 0.55);
  const hoodBase = new THREE.Mesh(hoodBaseGeo, materials.chrome);
  hoodBase.position.set(-4.6, 1.65, -6.15);
  hoodBase.castShadow = true;
  group.add(hoodBase);

  // 4. WATERFALL MARBLE ISLAND WITH CITRUS FRUIT BOWL
  const islandGroup = new THREE.Group();
  islandGroup.name = 'KitchenIsland';

  const islandBaseGeo = new THREE.BoxGeometry(1.2, 0.88, 2.2);
  const islandBase = new THREE.Mesh(islandBaseGeo, materials.trim);
  islandBase.position.set(0, 0.44, 0);
  islandBase.castShadow = true;
  islandBase.receiveShadow = true;
  islandGroup.add(islandBase);

  const islandTopGeo = new THREE.BoxGeometry(1.35, 0.06, 2.3);
  const islandTop = new THREE.Mesh(islandTopGeo, materials.marble);
  islandTop.position.set(-0.06, 0.91, 0);
  islandTop.castShadow = true;
  islandGroup.add(islandTop);

  const waterFallNorthGeo = new THREE.BoxGeometry(1.35, 0.9, 0.06);
  const waterFallNorth = new THREE.Mesh(waterFallNorthGeo, materials.marble);
  waterFallNorth.position.set(-0.06, 0.45, -1.13);
  waterFallNorth.castShadow = true;
  islandGroup.add(waterFallNorth);

  const waterFallSouthGeo = new THREE.BoxGeometry(1.35, 0.9, 0.06);
  const waterFallSouth = new THREE.Mesh(waterFallSouthGeo, materials.marble);
  waterFallSouth.position.set(-0.06, 0.45, 1.13);
  waterFallSouth.castShadow = true;
  islandGroup.add(waterFallSouth);

  // Fruit bowl with lemons and oranges on the island
  const bowlGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.06, 16);
  const bowl = new THREE.Mesh(bowlGeo, materials.whitePorcelain);
  bowl.position.set(-0.06, 0.96, 0.2);
  islandGroup.add(bowl);

  const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 });
  const lemonMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.6 });
  for (let f = 0; f < 4; f++) {
    const fAngle = f * (Math.PI / 2);
    const fruit = new THREE.Mesh(new THREE.DodecahedronGeometry(0.04, 1), f % 2 === 0 ? orangeMat : lemonMat);
    fruit.position.set(-0.06 + Math.cos(fAngle) * 0.06, 1.01, 0.2 + Math.sin(fAngle) * 0.06);
    islandGroup.add(fruit);
  }

  islandGroup.position.set(-3.2, 0, -4.0);
  group.add(islandGroup);

  // 5. THREE COGNAC LEATHER BAR STOOLS
  const stoolZPositions = [-4.7, -4.0, -3.3];
  stoolZPositions.forEach((sz) => {
    const stoolGroup = new THREE.Group();

    const seatGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.07, 24);
    const seat = new THREE.Mesh(seatGeo, materials.leatherStool);
    seat.position.y = 0.65;
    seat.castShadow = true;
    stoolGroup.add(seat);

    const legGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.62, 8);
    const legOffsets = [
      { x: -0.12, z: -0.12 },
      { x: 0.12, z: -0.12 },
      { x: -0.12, z: 0.12 },
      { x: 0.12, z: 0.12 },
    ];
    legOffsets.forEach((off) => {
      const leg = new THREE.Mesh(legGeo, materials.blackMetal);
      leg.position.set(off.x, 0.31, off.z);
      leg.castShadow = true;
      stoolGroup.add(leg);
    });

    const ringGeo = new THREE.TorusGeometry(0.14, 0.008, 6, 16);
    const ring = new THREE.Mesh(ringGeo, materials.blackMetal);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.25;
    stoolGroup.add(ring);

    stoolGroup.position.set(-2.25, 0, sz);
    group.add(stoolGroup);
  });

  // 6. BUILT-IN PANTRY / STORAGE UNIT (Matching Callout: Double Shelf with Spice Jars & Canisters)
  const pantryGroup = new THREE.Group();
  pantryGroup.name = 'PantryStorage';

  const pantryFrame = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.4, 1.2), materials.wall);
  pantryFrame.position.set(0, 0.9, 0);
  pantryFrame.castShadow = true;
  pantryGroup.add(pantryFrame);

  // Shelves with wooden trim
  for (let sy of [0.65, 1.05]) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.03, 1.15), materials.naturalOak);
    shelf.position.set(0.02, sy, 0);
    pantryGroup.add(shelf);

    // Row of spice jars with wooden lids
    for (let j = 0; j < 7; j++) {
      const jz = -0.45 + (j / 6) * 0.9;
      const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.12, 12), materials.whitePorcelain);
      jar.position.set(0.04, sy + 0.07, jz);
      pantryGroup.add(jar);

      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.02, 12), materials.naturalOak);
      lid.position.set(0.04, sy + 0.14, jz);
      pantryGroup.add(lid);
    }
  }

  pantryGroup.position.set(-5.35, 0, -3.2);
  group.add(pantryGroup);

  return group;
}
