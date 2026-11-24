import * as THREE from 'three';
import {
  createWoodFloorTexture,
  createWoodFloorBumpMap,
  createFoyerCheckerTexture,
  createStonePaverTexture,
  createMarbleTexture,
  createFabricBumpMap,
  createCarpetTexture,
  createGrassTexture,
  createBathroomTileTexture,
  createRoofAwningTexture,
} from './textures.js';

export function createMaterials() {
  const woodFloorTex = createWoodFloorTexture();
  const woodFloorBump = createWoodFloorBumpMap();
  const foyerCheckerTex = createFoyerCheckerTexture();
  const stonePaverTex = createStonePaverTexture();
  const marbleTex = createMarbleTexture();
  const fabricBump = createFabricBumpMap();
  const darkCarpetTex = createCarpetTexture(true);
  const lightCarpetTex = createCarpetTexture(false);
  const grassTex = createGrassTexture();
  const bathroomTileTex = createBathroomTileTexture();
  const roofAwningTex = createRoofAwningTexture();

  return {
    // 1. HONEY OAK HARDWOOD (Reflective Clearcoat + Micro Bump)
    woodFloor: new THREE.MeshPhysicalMaterial({
      map: woodFloorTex,
      bumpMap: woodFloorBump,
      bumpScale: 0.006,
      roughness: 0.32,
      metalness: 0.02,
      clearcoat: 0.26,
      clearcoatRoughness: 0.20,
    }),

    // 2. ENTRY FOYER CHECKERBOARD TILES
    foyerChecker: new THREE.MeshStandardMaterial({
      map: foyerCheckerTex,
      roughness: 0.20,
      metalness: 0.04,
    }),

    // 3. SLATE STONE PAVERS
    stonePaver: new THREE.MeshStandardMaterial({
      map: stonePaverTex,
      roughness: 0.72,
      metalness: 0.02,
    }),

    // 4. BATHROOM CERAMIC TILE
    bathroomTile: new THREE.MeshStandardMaterial({
      map: bathroomTileTex,
      roughness: 0.18,
      metalness: 0.05,
    }),

    // 5. WALLS (Warm Clean White Plaster)
    wall: new THREE.MeshStandardMaterial({
      color: 0xf5f4f0,
      roughness: 0.88,
      metalness: 0.01,
    }),
    wallTop: new THREE.MeshStandardMaterial({
      color: 0xeae8e2,
      roughness: 0.85,
    }),
    trim: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35,
    }),

    // 6. WINDOW FRAMES & CRYSTAL GLASS
    windowFrame: new THREE.MeshStandardMaterial({
      color: 0x22262b,
      roughness: 0.38,
      metalness: 0.45,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      roughness: 0.03,
      transmission: 0.96,
      ior: 1.5,
      thickness: 0.04,
    }),

    // 7. CALACATTA GOLD MARBLE (Clearcoat Sheen)
    marble: new THREE.MeshPhysicalMaterial({
      map: marbleTex,
      roughness: 0.10,
      metalness: 0.03,
      clearcoat: 0.88,
      clearcoatRoughness: 0.08,
    }),

    // 8. FABRICS WITH WEAVE BUMP
    creamFabric: new THREE.MeshStandardMaterial({
      color: 0xeeebe5,
      bumpMap: fabricBump,
      bumpScale: 0.003,
      roughness: 0.84,
      metalness: 0.0,
    }),
    lightGreyFabric: new THREE.MeshStandardMaterial({
      color: 0xd4d8de,
      bumpMap: fabricBump,
      bumpScale: 0.003,
      roughness: 0.84,
      metalness: 0.0,
    }),
    darkFabric: new THREE.MeshStandardMaterial({
      color: 0x26292e,
      bumpMap: fabricBump,
      bumpScale: 0.003,
      roughness: 0.82,
      metalness: 0.0,
    }),
    pillowCream: new THREE.MeshStandardMaterial({
      color: 0xf0eee8,
      bumpMap: fabricBump,
      bumpScale: 0.004,
      roughness: 0.84,
    }),
    pillowCamel: new THREE.MeshStandardMaterial({
      color: 0xb58256,
      bumpMap: fabricBump,
      bumpScale: 0.004,
      roughness: 0.84,
    }),
    leatherStool: new THREE.MeshStandardMaterial({
      color: 0x8a5229,
      roughness: 0.32,
      metalness: 0.06,
    }),

    // 9. RUGS
    darkCarpet: new THREE.MeshStandardMaterial({
      map: darkCarpetTex,
      roughness: 0.92,
      metalness: 0.0,
    }),
    lightCarpet: new THREE.MeshStandardMaterial({
      map: lightCarpetTex,
      roughness: 0.92,
      metalness: 0.0,
    }),

    // 10. WOOD FINISHES
    naturalOak: new THREE.MeshPhysicalMaterial({
      map: woodFloorTex,
      bumpMap: woodFloorBump,
      bumpScale: 0.005,
      roughness: 0.32,
      metalness: 0.02,
      clearcoat: 0.24,
      clearcoatRoughness: 0.20,
    }),
    darkWood: new THREE.MeshStandardMaterial({
      color: 0x201c18,
      roughness: 0.38,
      metalness: 0.03,
    }),

    // 11. METALS
    blackMetal: new THREE.MeshStandardMaterial({
      color: 0x18191b,
      roughness: 0.35,
      metalness: 0.82,
    }),
    chrome: new THREE.MeshStandardMaterial({
      color: 0xf5f5f7,
      roughness: 0.08,
      metalness: 0.96,
    }),
    brass: new THREE.MeshStandardMaterial({
      color: 0xcda052,
      roughness: 0.22,
      metalness: 0.88,
    }),
    blueAccent: new THREE.MeshStandardMaterial({
      color: 0x3d5a78,
      roughness: 0.35,
    }),

    // 12. SPECIAL LIGHTS & ACCENTS
    globeGlow: new THREE.MeshStandardMaterial({
      color: 0xfff3db,
      emissive: 0xffd999,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    }),

    // 13. NATURE & SITE (Lush Realistic Garden & Landscape)
    grass: new THREE.MeshStandardMaterial({
      map: grassTex,
      roughness: 0.88,
      metalness: 0.0,
    }),
    roofAwning: new THREE.MeshStandardMaterial({
      map: roofAwningTex,
      roughness: 0.42,
      metalness: 0.5,
    }),
    driveway: new THREE.MeshStandardMaterial({
      color: 0x2e3238,
      roughness: 0.78,
      metalness: 0.04,
    }),
    foliageGreen: new THREE.MeshStandardMaterial({
      color: 0x2b4919,
      roughness: 0.78,
    }),
    foliageGreenLight: new THREE.MeshStandardMaterial({
      color: 0x3d6624,
      roughness: 0.75,
    }),
    pinkFlowers: new THREE.MeshStandardMaterial({
      color: 0xd63d76,
      roughness: 0.72,
    }),
    mapleBurgundy: new THREE.MeshStandardMaterial({
      color: 0x55121c,
      roughness: 0.80,
    }),
    mapleBurgundyLight: new THREE.MeshStandardMaterial({
      color: 0x6e1824,
      roughness: 0.78,
    }),
    treeTrunk: new THREE.MeshStandardMaterial({
      color: 0x3d3028,
      roughness: 0.85,
    }),
    whitePorcelain: new THREE.MeshStandardMaterial({
      color: 0xfcfcfd,
      roughness: 0.12,
      metalness: 0.03,
    }),
  };
}
