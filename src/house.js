import * as THREE from 'three';

export function createHouseArchitecture(materials) {
  const houseGroup = new THREE.Group();
  houseGroup.name = 'HouseArchitecture';

  const wallsGroup = new THREE.Group();
  wallsGroup.name = 'Walls';
  houseGroup.add(wallsGroup);

  let currentWallHeight = 1.8;
  const wallThickness = 0.22;

  // 1. EXTENSIVE GROUND PLANE (Lush Green Lawn)
  const lawnGeo = new THREE.PlaneGeometry(160, 160, 32, 32);
  const lawn = new THREE.Mesh(lawnGeo, materials.grass);
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.y = -0.05;
  lawn.receiveShadow = true;
  houseGroup.add(lawn);

  // 2. MAIN INTERIOR FLOOR SLAB (Honey Oak Hardwood)
  const mainFloorGeo = new THREE.BoxGeometry(11.2, 0.2, 13.2);
  const mainFloor = new THREE.Mesh(mainFloorGeo, materials.woodFloor);
  mainFloor.position.set(-0.2, -0.1, 0.0);
  mainFloor.receiveShadow = true;
  houseGroup.add(mainFloor);

  // 3. ENTRY FOYER FLOOR (Black & White Diagonal Diamond Checkerboard Tiles!)
  const foyerGeo = new THREE.BoxGeometry(1.8, 0.22, 1.5);
  const foyer = new THREE.Mesh(foyerGeo, materials.foyerChecker);
  foyer.position.set(4.1, -0.09, 1.5);
  foyer.receiveShadow = true;
  houseGroup.add(foyer);

  // 4. BATHROOM FLOOR (Ceramic Tile Inset)
  const bathFloorGeo = new THREE.BoxGeometry(3.0, 0.22, 3.0);
  const bathFloor = new THREE.Mesh(bathFloorGeo, materials.bathroomTile);
  bathFloor.position.set(3.4, -0.09, -0.7);
  bathFloor.receiveShadow = true;
  houseGroup.add(bathFloor);

  // 5. WEST PATIO FLOOR SLAB (Slate Pavers)
  const patioGeo = new THREE.BoxGeometry(3.8, 0.18, 7.6);
  const patio = new THREE.Mesh(patioGeo, materials.stonePaver);
  patio.position.set(-7.7, -0.09, -1.0);
  patio.receiveShadow = true;
  houseGroup.add(patio);

  // 6. EAST FRONT PORCH & VERANDA SLAB (Slate Pavers)
  const porchGeo = new THREE.BoxGeometry(3.4, 0.18, 6.8);
  const porch = new THREE.Mesh(porchGeo, materials.stonePaver);
  porch.position.set(6.7, -0.09, 3.4);
  porch.receiveShadow = true;
  houseGroup.add(porch);

  // Porch Steps
  for (let s = 0; s < 2; s++) {
    const stepGeo = new THREE.BoxGeometry(1.6, 0.08, 0.4);
    const step = new THREE.Mesh(stepGeo, materials.stonePaver);
    step.position.set(6.7, -0.12 - s * 0.06, 6.95 + s * 0.35);
    step.receiveShadow = true;
    step.castShadow = true;
    houseGroup.add(step);
  }

  // Stepping Stones Pathway (5 rectangular stone pads matching photo callout)
  const stones = [
    { x: 6.7, z: 8.0, w: 1.1, d: 0.65 },
    { x: 7.2, z: 9.0, w: 1.0, d: 0.65 },
    { x: 8.2, z: 9.7, w: 0.95, d: 0.65 },
    { x: 9.3, z: 9.9, w: 0.90, d: 0.65 },
    { x: 10.3, z: 10.0, w: 0.85, d: 0.65 },
  ];
  stones.forEach((st) => {
    const stoneGeo = new THREE.BoxGeometry(st.w, 0.06, st.d);
    const stone = new THREE.Mesh(stoneGeo, materials.stonePaver);
    stone.position.set(st.x, -0.02, st.z);
    stone.receiveShadow = true;
    houseGroup.add(stone);
  });

  // East Driveway Area (Matching photo driveway)
  const driveGeo = new THREE.BoxGeometry(4.4, 0.04, 8.8);
  const drive = new THREE.Mesh(driveGeo, materials.driveway);
  drive.position.set(7.6, -0.04, -3.2);
  drive.receiveShadow = true;
  houseGroup.add(drive);

  // Top-Right Stone Retaining Wall & Garden Planter along Driveway (matching photo)
  const retainingWallGeo = new THREE.BoxGeometry(0.35, 0.85, 8.8);
  const retainingWall = new THREE.Mesh(retainingWallGeo, materials.stonePaver);
  retainingWall.position.set(9.9, 0.42, -3.2);
  retainingWall.castShadow = true;
  retainingWall.receiveShadow = true;
  houseGroup.add(retainingWall);

  // Solid Wall Segment with clean cap
  function createWallSegment(x, z, length, rotationY = 0, height = currentWallHeight) {
    const wallSegGroup = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(length, height, wallThickness);
    const body = new THREE.Mesh(bodyGeo, materials.wall);
    body.position.y = height / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    wallSegGroup.add(body);

    const capGeo = new THREE.BoxGeometry(length, 0.03, wallThickness + 0.02);
    const cap = new THREE.Mesh(capGeo, materials.wallTop);
    cap.position.y = height + 0.015;
    cap.castShadow = true;
    wallSegGroup.add(cap);

    wallSegGroup.position.set(x, 0, z);
    wallSegGroup.rotation.y = rotationY;
    wallSegGroup.userData = { body, cap, initialLength: length };
    return wallSegGroup;
  }

  // Architectural Window Wall: Hollow Perimeter Frame + Glass Pane + Divider Muntins
  function createWindowWall(x, z, length, height = currentWallHeight, rotationY = 0, panels = 3) {
    const group = new THREE.Group();
    const sillHeight = 0.55;
    const windowH = Math.max(0.6, height - sillHeight);

    // 1. Solid lower wall sill
    const sillGeo = new THREE.BoxGeometry(length, sillHeight, wallThickness);
    const sill = new THREE.Mesh(sillGeo, materials.wall);
    sill.position.y = sillHeight / 2;
    sill.castShadow = true;
    sill.receiveShadow = true;
    group.add(sill);

    // 2. Interior and exterior sill cap trim
    const sillCapGeo = new THREE.BoxGeometry(length, 0.03, wallThickness + 0.04);
    const sillCap = new THREE.Mesh(sillCapGeo, materials.wallTop);
    sillCap.position.y = sillHeight + 0.015;
    sillCap.castShadow = true;
    group.add(sillCap);

    // 3. Hollow Architectural Window Frame
    const frameThickness = 0.05;
    const frameDepth = wallThickness * 0.75;
    const frameY = sillHeight + windowH / 2;

    // Top horizontal bar
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(length, frameThickness, frameDepth), materials.windowFrame);
    topBar.position.set(0, sillHeight + windowH - frameThickness / 2, 0);
    topBar.castShadow = true;
    group.add(topBar);

    // Bottom horizontal bar
    const btmBar = new THREE.Mesh(new THREE.BoxGeometry(length, frameThickness, frameDepth), materials.windowFrame);
    btmBar.position.set(0, sillHeight + frameThickness / 2, 0);
    btmBar.castShadow = true;
    group.add(btmBar);

    // Left vertical stile
    const leftBar = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, windowH, frameDepth), materials.windowFrame);
    leftBar.position.set(-length / 2 + frameThickness / 2, frameY, 0);
    leftBar.castShadow = true;
    group.add(leftBar);

    // Right vertical stile
    const rightBar = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, windowH, frameDepth), materials.windowFrame);
    rightBar.position.set(length / 2 - frameThickness / 2, frameY, 0);
    rightBar.castShadow = true;
    group.add(rightBar);

    // Vertical Divider Muntins
    for (let p = 1; p < panels; p++) {
      const px = -length / 2 + (length / panels) * p;
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.04, windowH, frameDepth * 0.9), materials.windowFrame);
      mullion.position.set(px, frameY, 0);
      mullion.castShadow = true;
      group.add(mullion);
    }

    // 4. Clean transparent architectural glass pane
    const glassPane = new THREE.Mesh(new THREE.BoxGeometry(length - 0.06, windowH - 0.06, 0.03), materials.glass);
    glassPane.position.set(0, frameY, 0);
    group.add(glassPane);

    group.position.set(x, 0, z);
    group.rotation.y = rotationY;
    return group;
  }

  // --- EXTERIOR ENVELOPE WALLS ---
  // North Wall (Kitchen window + Sunroom window)
  wallsGroup.add(createWallSegment(-5.6, -6.6, 0.4));
  wallsGroup.add(createWindowWall(-3.3, -6.6, 2.8, currentWallHeight, 0, 3)); // Kitchen Window
  wallsGroup.add(createWallSegment(-0.8, -6.6, 2.0));
  wallsGroup.add(createWindowWall(3.4, -6.6, 3.8, currentWallHeight, 0, 4)); // Sunroom Panoramic Window
  wallsGroup.add(createWallSegment(5.4, -6.6, 0.6));

  // West Wall (Facing Slate Patio)
  wallsGroup.add(createWallSegment(-5.8, -4.5, 4.2, Math.PI / 2));
  wallsGroup.add(createWindowWall(-5.8, -0.6, 3.4, currentWallHeight, Math.PI / 2, 3)); // Patio Slider Window
  wallsGroup.add(createWallSegment(-5.8, 3.8, 5.4, Math.PI / 2));

  // East Wall (Facing Driveway & Porch)
  wallsGroup.add(createWallSegment(5.4, -4.4, 4.4, Math.PI / 2));
  wallsGroup.add(createWallSegment(5.4, 0.3, 2.2, Math.PI / 2));
  wallsGroup.add(createWallSegment(5.4, 4.2, 4.6, Math.PI / 2));

  // South Wall (Office & Living Room Windows)
  wallsGroup.add(createWallSegment(-5.2, 6.6, 1.2));
  wallsGroup.add(createWindowWall(-3.4, 6.6, 2.6, currentWallHeight, 0, 3)); // Office Window
  wallsGroup.add(createWallSegment(-1.3, 6.6, 1.4));
  wallsGroup.add(createWindowWall(2.1, 6.6, 4.2, currentWallHeight, 0, 4)); // Living Room Window
  wallsGroup.add(createWallSegment(4.8, 6.6, 1.2));

  // --- INTERIOR PARTITION WALLS ---
  // Kitchen-Dining dividing partition
  wallsGroup.add(createWallSegment(-5.1, -2.4, 1.4));

  // North-South Main Spine Wall (Left of Stairs & Entry Hall)
  wallsGroup.add(createWallSegment(-0.4, -4.2, 3.4, Math.PI / 2));
  wallsGroup.add(createWallSegment(-0.4, 3.8, 4.4, Math.PI / 2));

  // Office North Dividing Wall (Closet Backing)
  wallsGroup.add(createWallSegment(-3.1, 1.6, 5.0));

  // Sunroom South Partition (North wall of Bathroom & Stairs)
  wallsGroup.add(createWallSegment(3.2, -2.4, 4.4));

  // Bathroom South Wall / Entry Foyer Dividing Wall
  wallsGroup.add(createWallSegment(3.4, 0.8, 4.0));

  // Bathroom West Wall
  wallsGroup.add(createWallSegment(1.8, -0.8, 3.2, Math.PI / 2));

  // Foyer West Wall
  wallsGroup.add(createWallSegment(3.1, 1.6, 1.4, Math.PI / 2));

  // --- ARCHITECTURAL ENTRANCE DETAILS ---
  // Front entrance door (Solid Oak, pivoted ajar)
  const doorGroup = new THREE.Group();
  doorGroup.name = 'FrontDoor';
  const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.05, 0.05), materials.naturalOak);
  doorLeaf.position.set(0.42, 1.025, 0);
  doorLeaf.castShadow = true;
  doorGroup.add(doorLeaf);

  const doorHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 12), materials.chrome);
  doorHandle.position.set(0.75, 1.0, 0.05);
  doorGroup.add(doorHandle);

  doorGroup.position.set(4.9, 0, 1.6);
  doorGroup.rotation.y = -Math.PI / 3.5;
  houseGroup.add(doorGroup);

  // Black Iron Entry Gates & Stone Gateposts
  const gateGroup = new THREE.Group();
  gateGroup.name = 'EntranceGate';

  // Left & Right Stone Gateposts
  for (let gx of [5.2, 8.2]) {
    const postGeo = new THREE.BoxGeometry(0.38, 1.45, 0.38);
    const post = new THREE.Mesh(postGeo, materials.wall);
    post.position.set(gx, 0.725, 6.7);
    post.castShadow = true;
    gateGroup.add(post);

    const postCap = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.08, 0.44), materials.wallTop);
    postCap.position.set(gx, 1.49, 6.7);
    postCap.castShadow = true;
    gateGroup.add(postCap);
  }

  // Wrought iron gate panels
  for (let gy = 0.2; gy <= 1.25; gy += 0.12) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.02, 0.02), materials.blackMetal);
    rail.position.set(6.7, gy, 6.7);
    gateGroup.add(rail);
  }
  for (let gx = 5.5; gx <= 7.9; gx += 0.2) {
    const picket = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.15, 8), materials.blackMetal);
    picket.position.set(gx, 0.725, 6.7);
    picket.castShadow = true;
    gateGroup.add(picket);
  }
  houseGroup.add(gateGroup);

  // Pergola / Awning over Driveway / Entry Path (Black steel slats)
  const pergolaGroup = new THREE.Group();
  pergolaGroup.name = 'PergolaAwning';

  const pergolaPosts = [
    { x: 5.4, z: -6.4 },
    { x: 9.6, z: -6.4 },
    { x: 5.4, z: 0.2 },
    { x: 9.6, z: 0.2 },
  ];
  pergolaPosts.forEach((pp) => {
    const pMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.6, 0.1), materials.blackMetal);
    pMesh.position.set(pp.x, 1.3, pp.z);
    pMesh.castShadow = true;
    pergolaGroup.add(pMesh);
  });

  // Longitudinal steel beams
  for (let x = 5.4; x <= 9.6; x += 4.2) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 6.8), materials.blackMetal);
    beam.position.set(x, 2.6, -3.1);
    beam.castShadow = true;
    pergolaGroup.add(beam);
  }

  // Cross slats casting realistic pergola shadows onto driveway!
  for (let z = -6.4; z <= 0.2; z += 0.45) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.08, 0.04), materials.blackMetal);
    slat.position.set(7.5, 2.7, z);
    slat.castShadow = true;
    pergolaGroup.add(slat);
  }
  houseGroup.add(pergolaGroup);

  return {
    mesh: houseGroup,
    setCutawayHeight(h) {
      currentWallHeight = h;
      wallsGroup.children.forEach((w) => {
        if (w.userData.body && w.userData.cap) {
          w.userData.body.scale.y = h / 1.8;
          w.userData.body.position.y = h / 2;
          w.userData.cap.position.y = h + 0.015;
        }
      });
    },
  };
}
