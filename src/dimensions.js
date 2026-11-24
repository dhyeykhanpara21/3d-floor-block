import * as THREE from 'three';

export function createDimensionLabels() {
  const group = new THREE.Group();
  group.name = 'DimensionLabels';

  const roomLabels = [
    { name: 'KITCHEN', area: '18.4 m² (198 sq ft)', x: -3.3, z: -4.5 },
    { name: 'DINING AREA', area: '15.2 m² (164 sq ft)', x: -3.4, z: -0.1 },
    { name: 'SUNROOM / LOUNGE', area: '19.8 m² (213 sq ft)', x: 3.4, z: -4.5 },
    { name: 'BATHROOM', area: '8.4 m² (90 sq ft)', x: 3.4, z: -0.7 },
    { name: 'MASTER STUDY / BEDROOM', area: '21.0 m² (226 sq ft)', x: -3.4, z: 4.2 },
    { name: 'MAIN LIVING ROOM', area: '26.5 m² (285 sq ft)', x: 2.1, z: 3.8 },
    { name: 'WEST PATIO', area: '28.8 m² (310 sq ft)', x: -7.7, z: -1.0 },
    { name: 'FRONT VERANDA', area: '23.1 m² (248 sq ft)', x: 6.7, z: 3.8 },
  ];

  roomLabels.forEach((room) => {
    const badge = createTextBadge(room.name, room.area);
    badge.position.set(room.x, 2.1, room.z);
    group.add(badge);
  });

  return group;
}

function createTextBadge(title, subtitle) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Pill rounded background
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  roundRect(ctx, 16, 20, 480, 216, 32);
  ctx.fill();

  // Subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 4;
  roundRect(ctx, 16, 20, 480, 216, 32);
  ctx.stroke();

  // Title text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 256, 105);

  // Subtitle (Area)
  ctx.fillStyle = '#94a3b8';
  ctx.font = '32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(subtitle, 256, 175);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false, depthWrite: false });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(2.4, 1.2, 1);
  return sprite;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
