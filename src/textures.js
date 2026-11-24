import * as THREE from 'three';

// 1. HONEY GOLDEN OAK HARDWOOD (Horizontal Planks matching photo!)
export function createWoodFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Rich warm golden honey oak base
  ctx.fillStyle = '#ba8d58';
  ctx.fillRect(0, 0, 1024, 1024);

  const plankH = 40; // Height of horizontal planks
  const plankLengths = [180, 280, 420, 240, 360, 310];

  for (let y = 0; y < 1024; y += plankH) {
    let x = (y * 97) % 180 - 180;
    while (x < 1024) {
      const len = plankLengths[Math.floor(Math.random() * plankLengths.length)];
      const w = Math.min(len, 1024 - x + 100);

      // Natural blonde-honey oak plank variations
      const toneOffset = (Math.random() - 0.5) * 32;
      const r = Math.min(235, Math.max(165, 198 + toneOffset));
      const g = Math.min(185, Math.max(120, 150 + toneOffset * 0.88));
      const b = Math.min(130, Math.max(75, 96 + toneOffset * 0.62));

      ctx.fillStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
      ctx.fillRect(x + 1, y + 1, w - 2, plankH - 2);

      // Fine longitudinal wood grain running horizontally along the plank
      ctx.strokeStyle = `rgba(${Math.round(r * 0.78)}, ${Math.round(g * 0.76)}, ${Math.round(b * 0.7)}, 0.28)`;
      ctx.lineWidth = 1;
      for (let gStep = 3; gStep < plankH - 2; gStep += 3 + Math.random() * 4) {
        ctx.beginPath();
        ctx.moveTo(x, y + gStep);
        ctx.bezierCurveTo(
          x + w * 0.33, y + gStep + (Math.random() - 0.5) * 2.5,
          x + w * 0.66, y + gStep + (Math.random() - 0.5) * 2.5,
          x + w, y + gStep
        );
        ctx.stroke();
      }

      // Micro bevel top highlight
      ctx.strokeStyle = 'rgba(255, 235, 205, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 1, y + 1);
      ctx.lineTo(x + w - 1, y + 1);
      ctx.stroke();

      // Crisp dark shadow seam between planks
      ctx.strokeStyle = 'rgba(48, 30, 14, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(x, y, w, plankH);

      x += w;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.anisotropy = 16;
  return texture;
}

export function createWoodFloorBumpMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  const plankH = 20;
  for (let y = 0; y < 512; y += plankH) {
    // Deep dark seam line
    ctx.strokeStyle = '#2b2b2b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    // Wood grain bump variations
    ctx.strokeStyle = '#9c9c9c';
    ctx.lineWidth = 0.8;
    for (let i = 2; i < plankH; i += 3) {
      ctx.beginPath();
      ctx.moveTo(0, y + i);
      ctx.lineTo(512, y + i);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

// 2. CALACATTA GOLD MARBLE
export function createMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fafbfa';
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft cloudy underlying tone
  for (let c = 0; c < 12; c++) {
    const cx = Math.random() * 1024;
    const cy = Math.random() * 1024;
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 220);
    grad.addColorStop(0, 'rgba(235, 230, 222, 0.25)');
    grad.addColorStop(1, 'rgba(250, 251, 250, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 220, 0, Math.PI * 2);
    ctx.fill();
  }

  // Branching golden and smoke veins
  for (let v = 0; v < 14; v++) {
    let startX = Math.random() * 1024;
    let startY = 0;
    const isGold = Math.random() < 0.45;
    ctx.strokeStyle = isGold ? 'rgba(182, 150, 110, 0.42)' : 'rgba(135, 142, 150, 0.40)';
    ctx.lineWidth = 1.6 + Math.random() * 3.0;

    ctx.beginPath();
    ctx.moveTo(startX, startY);

    while (startY < 1024) {
      startX += (Math.random() - 0.49) * 60;
      startY += 15 + Math.random() * 40;
      ctx.lineTo(startX, startY);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  return texture;
}

// 3. DIAGONAL CHECKERBOARD TILES FOR ENTRY FOYER (High Contrast Diamond Pattern)
export function createFoyerCheckerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#181b20'; // Slate black
  ctx.fillRect(0, 0, 512, 512);

  const step = 64;
  ctx.fillStyle = '#f0f2f5'; // Crisp ivory white

  for (let x = -512; x < 1024; x += step * 2) {
    for (let y = -512; y < 1024; y += step * 2) {
      ctx.beginPath();
      ctx.moveTo(x + step, y);
      ctx.lineTo(x + step * 2, y + step);
      ctx.lineTo(x + step, y + step * 2);
      ctx.lineTo(x, y + step);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Fine grout lines
  ctx.strokeStyle = 'rgba(80, 88, 98, 0.45)';
  ctx.lineWidth = 1.5;
  for (let x = -512; x < 1024; x += step * 2) {
    for (let y = -512; y < 1024; y += step * 2) {
      ctx.strokeRect(x, y, step * 2, step * 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = 16;
  return texture;
}

// 4. RICH SLATE COBBLESTONE PAVERS (West Patio)
export function createStonePaverTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#30343a'; // Dark mortar
  ctx.fillRect(0, 0, 1024, 1024);

  const tileSize = 64;
  for (let x = 0; x < 1024; x += tileSize) {
    for (let y = 0; y < 1024; y += tileSize) {
      const tone = 125 + Math.floor((Math.random() - 0.5) * 36);
      ctx.fillStyle = `rgb(${tone}, ${tone + 3}, ${tone + 6})`;
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

      // Micro stone texture speckles
      for (let i = 0; i < 18; i++) {
        const nx = x + 3 + Math.random() * (tileSize - 6);
        const ny = y + 3 + Math.random() * (tileSize - 6);
        ctx.fillStyle = `rgba(${tone + (Math.random() - 0.5) * 24}, ${tone}, ${tone}, 0.35)`;
        ctx.fillRect(nx, ny, 2 + Math.random() * 5, 2 + Math.random() * 5);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.anisotropy = 16;
  return texture;
}

// 5. FABRIC WEAVE BUMP MAP
export function createFabricBumpMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  for (let x = 0; x < 256; x += 4) {
    ctx.fillStyle = (x % 8 === 0) ? '#949494' : '#6c6c6c';
    ctx.fillRect(x, 0, 2, 256);
  }
  for (let y = 0; y < 256; y += 4) {
    ctx.fillStyle = (y % 8 === 0) ? '#949494' : '#6c6c6c';
    ctx.fillRect(0, y, 2, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

// 6. LUSH MANICURED LAWN TURF (Deep rich green matching photo!)
export function createGrassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep forest-olive lawn base
  ctx.fillStyle = '#324e1a';
  ctx.fillRect(0, 0, 1024, 1024);

  // 70,000 fine organic grass blade flecks
  for (let i = 0; i < 70000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const rand = Math.random();
    if (rand < 0.35) {
      ctx.fillStyle = '#263d14'; // Dark shadow blade
    } else if (rand < 0.70) {
      ctx.fillStyle = '#416624'; // Mid green blade
    } else if (rand < 0.90) {
      ctx.fillStyle = '#4d782b'; // Sunlit blade
    } else {
      ctx.fillStyle = '#203310'; // Deep turf root
    }
    ctx.fillRect(x, y, 1.5 + Math.random() * 2, 2 + Math.random() * 3.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 24);
  texture.anisotropy = 16;
  return texture;
}

// 7. CARPET WEAVE TEXTURE (Distressed Vintage Charcoal Rug & Warm Oatmeal Rug)
export function createCarpetTexture(isDark = true) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (isDark) {
    // Distressed vintage dark charcoal/navy oriental rug (matching photo!)
    ctx.fillStyle = '#2a2e35';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle distressed washed pattern
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      ctx.fillStyle = Math.random() < 0.6 ? 'rgba(68, 76, 88, 0.35)' : 'rgba(25, 28, 33, 0.4)';
      ctx.fillRect(rx, ry, 3 + Math.random() * 8, 3 + Math.random() * 8);
    }

    // Outer and inner border
    ctx.strokeStyle = '#1b1d22';
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, 500, 500);

    ctx.strokeStyle = 'rgba(78, 88, 102, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(22, 22, 468, 468);
  } else {
    // Warm oatmeal / greige woven wool rug for sunroom
    ctx.fillStyle = '#d4cfc6';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      ctx.fillStyle = Math.random() < 0.5 ? 'rgba(235, 230, 222, 0.4)' : 'rgba(185, 178, 168, 0.3)';
      ctx.fillRect(rx, ry, 3 + Math.random() * 6, 3 + Math.random() * 6);
    }

    ctx.strokeStyle = '#bebaa1';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 504, 504);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  return texture;
}

// 8. BATHROOM TILES (Neutral Porcelain Grid)
export function createBathroomTileTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#a8b0b8';
  ctx.fillRect(0, 0, 512, 512);

  const size = 64;
  for (let x = 0; x < 512; x += size) {
    for (let y = 0; y < 512; y += size) {
      const isAlt = ((x / size) + (y / size)) % 2 === 0;
      ctx.fillStyle = isAlt ? '#f0f3f6' : '#dde3e9';
      ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.anisotropy = 16;
  return texture;
}

// 9. ROOF AWNING & PERGOLA SLATS
export function createRoofAwningTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1c1f24';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = '#0f1114';
  for (let x = 0; x < 512; x += 24) {
    ctx.fillRect(x, 0, 4, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 6);
  texture.anisotropy = 16;
  return texture;
}
