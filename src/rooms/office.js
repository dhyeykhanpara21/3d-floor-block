import * as THREE from 'three';

export function createOffice(materials) {
  const group = new THREE.Group();
  group.name = 'OfficeBedroom';

  // 1. BUILT-IN WARDROBE (Lower cabinet + Upper hanging clothes rail)
  const closetGroup = new THREE.Group();
  closetGroup.name = 'WardrobeCloset';

  // Lower cabinet base unit
  const lowerCabGeo = new THREE.BoxGeometry(1.85, 0.9, 0.6);
  const lowerCab = new THREE.Mesh(lowerCabGeo, materials.trim);
  lowerCab.position.set(0, 0.45, 0);
  lowerCab.castShadow = true;
  closetGroup.add(lowerCab);

  // Top storage shelf
  const shelfTop = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.04, 0.6), materials.wall);
  shelfTop.position.set(0, 1.55, 0);
  closetGroup.add(shelfTop);

  // Chrome Clothes Hanging Rail
  const rodGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.75, 12);
  const rod = new THREE.Mesh(rodGeo, materials.chrome);
  rod.rotation.z = Math.PI / 2;
  rod.position.set(0, 1.45, 0);
  closetGroup.add(rod);

  // Hanging Shirts & Jackets (blue, grey, white, emerald, camel)
  const clothColors = [0x2563eb, 0xf1f5f9, 0x64748b, 0x059669, 0xd97706, 0x3b82f6, 0x475569];
  const numClothes = 12;
  for (let c = 0; c < numClothes; c++) {
    const clothItem = new THREE.Group();

    const hanger = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.005, 4, 12, Math.PI), materials.blackMetal);
    hanger.position.set(0, 0.05, 0);
    hanger.rotation.y = Math.PI / 2;
    clothItem.add(hanger);

    const clothMat = new THREE.MeshStandardMaterial({
      color: clothColors[c % clothColors.length],
      roughness: 0.85,
    });
    const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.52, 0.42), clothMat);
    shirt.position.set(0, -0.26, 0);
    shirt.castShadow = true;
    clothItem.add(shirt);

    const xOffset = -0.72 + (c / (numClothes - 1)) * 1.44;
    clothItem.position.set(xOffset, 1.45, 0);
    closetGroup.add(clothItem);
  }

  closetGroup.position.set(-4.6, 0, 2.5);
  group.add(closetGroup);

  // 2. EXECUTIVE WORK DESK (Facing South Window)
  const deskGroup = new THREE.Group();
  deskGroup.name = 'OfficeDesk';

  const deskTopGeo = new THREE.BoxGeometry(1.8, 0.05, 0.85);
  const deskTop = new THREE.Mesh(deskTopGeo, materials.naturalOak);
  deskTop.position.y = 0.73;
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  deskGroup.add(deskTop);

  const legFrameGeo = new THREE.BoxGeometry(0.04, 0.7, 0.8);
  const leftLeg = new THREE.Mesh(legFrameGeo, materials.blackMetal);
  leftLeg.position.set(-0.84, 0.35, 0);
  leftLeg.castShadow = true;
  deskGroup.add(leftLeg);

  const rightLeg = leftLeg.clone();
  rightLeg.position.x = 0.84;
  deskGroup.add(rightLeg);

  // Laptop / Monitor & Desk Lamp
  const monitorScreen = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.35, 0.03), materials.blackMetal);
  monitorScreen.position.set(0, 1.05, 0.2);
  deskGroup.add(monitorScreen);

  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.015, 16), materials.brass);
  lampBase.position.set(-0.65, 0.76, 0.18);
  deskGroup.add(lampBase);

  deskGroup.position.set(-3.4, 0, 5.3);
  group.add(deskGroup);

  // 3. ERGONOMIC CHAIR WITH CURVED/SPINDLE BACK
  const chairGroup = new THREE.Group();
  chairGroup.name = 'OfficeChair';

  const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.46), materials.darkFabric);
  chairSeat.position.y = 0.46;
  chairSeat.castShadow = true;
  chairGroup.add(chairSeat);

  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.52, 0.05), materials.darkFabric);
  chairBack.position.set(0, 0.75, -0.22);
  chairBack.rotation.x = -0.12;
  chairBack.castShadow = true;
  chairGroup.add(chairBack);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 12), materials.chrome);
  stem.position.y = 0.22;
  chairGroup.add(stem);

  chairGroup.position.set(-3.4, 0, 4.4);
  chairGroup.rotation.y = Math.PI;
  group.add(chairGroup);

  return group;
}
