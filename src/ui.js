export function setupUI({
  controller,
  house,
  dimLabels,
  cameraPresets,
  renderer,
  scene,
  camera,
}) {
  // Preset buttons
  const presetContainer = document.getElementById('camera-presets');
  if (presetContainer) {
    Object.keys(cameraPresets).forEach((key) => {
      const preset = cameraPresets[key];
      const btn = document.createElement('button');
      btn.className = 'preset-btn';
      btn.dataset.key = key;
      btn.innerHTML = `<span class="btn-icon">${preset.icon}</span><span class="btn-label">${preset.name}</span>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        if (key === 'fps') {
          controller.enterFPSMode();
          showFPSNotice(true);
        } else {
          controller.exitFPSMode();
          showFPSNotice(false);
          controller.animateToCamera(
            preset.pos.x,
            preset.pos.y,
            preset.pos.z,
            preset.target.x,
            preset.target.y,
            preset.target.z
          );
        }
      });
      presetContainer.appendChild(btn);
    });

    // Set default active to Isometric
    const defaultBtn = presetContainer.querySelector('[data-key="iso"]');
    if (defaultBtn) defaultBtn.classList.add('active');
  }

  // Time of Day buttons
  const timeBtns = document.querySelectorAll('.time-btn');
  timeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      timeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      controller.setTimeOfDay(btn.dataset.mode);
    });
  });

  // Wall Height Slider
  const wallSlider = document.getElementById('wall-height-slider');
  const wallHeightVal = document.getElementById('wall-height-val');
  if (wallSlider) {
    wallSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (wallHeightVal) wallHeightVal.textContent = `${val.toFixed(1)}m`;
      house.setWallHeight(val);
    });
  }

  // Dimension Labels Toggle
  const dimToggle = document.getElementById('toggle-dimensions');
  if (dimToggle) {
    dimToggle.addEventListener('change', (e) => {
      dimLabels.visible = e.target.checked;
    });
  }

  // Screenshot Button
  const screenshotBtn = document.getElementById('btn-screenshot');
  if (screenshotBtn) {
    screenshotBtn.addEventListener('click', () => {
      takeScreenshot(renderer, scene, camera);
    });
  }

  // Room Quick Info Panel
  const roomCards = document.querySelectorAll('.room-card');
  roomCards.forEach((card) => {
    card.addEventListener('click', () => {
      const roomKey = card.dataset.room;
      if (cameraPresets[roomKey]) {
        const p = cameraPresets[roomKey];
        controller.animateToCamera(p.pos.x, p.pos.y, p.pos.z, p.target.x, p.target.y, p.target.z);
        document.querySelectorAll('.preset-btn').forEach((b) => {
          b.classList.toggle('active', b.dataset.key === roomKey);
        });
      }
    });
  });

  // FPS Mode Notice Helper
  function showFPSNotice(show) {
    const notice = document.getElementById('fps-instruction');
    if (notice) {
      notice.style.display = show ? 'flex' : 'none';
    }
  }

  // ESC to exit FPS
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && controller.isFPSMode) {
      controller.exitFPSMode();
      showFPSNotice(false);
      const isoBtn = presetContainer.querySelector('[data-key="iso"]');
      if (isoBtn) {
        document.querySelectorAll('.preset-btn').forEach((b) => b.classList.remove('active'));
        isoBtn.classList.add('active');
      }
    }
  });
}

function takeScreenshot(renderer, scene, camera) {
  // Render high-res frame
  renderer.render(scene, camera);
  const dataURL = renderer.domElement.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `3d-architectural-floor-plan-${Date.now()}.png`;
  link.href = dataURL;
  link.click();
}
