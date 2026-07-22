/**
 * stripRenderer.js
 * Canvas-based rendering engine for photobooth strip templates.
 * Converts template data + captured photos → a downloadable PNG image.
 */

// ─── image loader ─────────────────────────────────────────────────────────────
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    if (src && !src.startsWith('blob:') && !src.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

// ─── canvas helpers ───────────────────────────────────────────────────────────
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

function scallop(ctx, x, y, w, h, r = 10) {
  // draw a scalloped/wavy border rectangle
  const steps = Math.floor(w / (r * 2));
  const stepW = w / steps;
  ctx.beginPath();
  ctx.moveTo(x, y + r);
  // top edge
  for (let i = 0; i < steps; i++) {
    ctx.arc(x + stepW * i + stepW / 2, y, stepW / 2, Math.PI, 0);
  }
  // right side
  const stepsH = Math.floor(h / (r * 2));
  const stepH = h / stepsH;
  for (let i = 0; i < stepsH; i++) {
    ctx.arc(x + w, y + stepH * i + stepH / 2, stepH / 2, -Math.PI / 2, Math.PI / 2);
  }
  // bottom edge
  for (let i = steps - 1; i >= 0; i--) {
    ctx.arc(x + stepW * i + stepW / 2, y + h, stepW / 2, 0, Math.PI);
  }
  // left side
  for (let i = stepsH - 1; i >= 0; i--) {
    ctx.arc(x, y + stepH * i + stepH / 2, stepH / 2, Math.PI / 2, -Math.PI / 2);
  }
  ctx.closePath();
}

// ─── background ───────────────────────────────────────────────────────────────
function drawBackground(ctx, template, w, h) {
  const colors = Array.isArray(template.bg) ? template.bg : [template.bg];
  if (colors.length === 1) {
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);
    return;
  }
  const rad = (template.bgAngle || 135) * (Math.PI / 180);
  const gx1 = w / 2 + Math.cos(rad) * -w;
  const gy1 = h / 2 + Math.sin(rad) * -h;
  const gx2 = w / 2 + Math.cos(rad) * w;
  const gy2 = h / 2 + Math.sin(rad) * h;
  const grad = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
  colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

// ─── slot frame styles ────────────────────────────────────────────────────────
function drawSlotFrame(ctx, ax, ay, aw, ah, slot) {
  const style      = slot.style || 'polaroid';
  const frameColor = slot.borderColor || '#FFFFFF';

  ctx.save();
  ctx.shadowColor   = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur    = 12;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;

  if (style === 'polaroid') {
    // white card with bottom caption space
    const pad = 8, capH = 26;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(ax - pad, ay - pad, aw + pad * 2, ah + pad * 2 + capH);
  } else if (style === 'film') {
    ctx.shadowBlur = 0;
    ctx.fillStyle  = '#000000';
    ctx.fillRect(ax - 10, ay - 10, aw + 20, ah + 20);
    // sprocket holes
    ctx.fillStyle = '#1A1A1A';
    const holeR = 5, holeGap = 20;
    for (let hy = ay - 6; hy < ay + ah + 10; hy += holeGap) {
      ctx.beginPath();
      ctx.arc(ax - 5, hy, holeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ax + aw + 5, hy, holeR, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (style === 'rough') {
    // torn paper look using jagged rect
    ctx.strokeStyle = frameColor;
    ctx.lineWidth   = 3;
    ctx.setLineDash([6, 3]);
    ctx.strokeRect(ax - 6, ay - 6, aw + 12, ah + 12);
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillRect(ax - 4, ay - 4, aw + 8, ah + 8);
  } else if (style === 'tape') {
    // washi tape corners
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(ax, ay, aw, ah);
    const tapeW = 28, tapeH = 14;
    const tapeColor = '#D4C5E2';
    const tapeAlpha = 0.7;
    ctx.globalAlpha = tapeAlpha;
    ctx.fillStyle = tapeColor;
    ctx.save(); ctx.translate(ax + tapeW / 2, ay); ctx.rotate(-0.3);
    ctx.fillRect(-tapeW / 2, -tapeH / 2, tapeW, tapeH); ctx.restore();
    ctx.save(); ctx.translate(ax + aw - tapeW / 2, ay); ctx.rotate(0.3);
    ctx.fillRect(-tapeW / 2, -tapeH / 2, tapeW, tapeH); ctx.restore();
    ctx.save(); ctx.translate(ax + tapeW / 2, ay + ah); ctx.rotate(0.3);
    ctx.fillRect(-tapeW / 2, -tapeH / 2, tapeW, tapeH); ctx.restore();
    ctx.save(); ctx.translate(ax + aw - tapeW / 2, ay + ah); ctx.rotate(-0.3);
    ctx.fillRect(-tapeW / 2, -tapeH / 2, tapeW, tapeH); ctx.restore();
    ctx.globalAlpha = 1;
  } else if (style === 'gingham') {
    // checkered/gingham frame border
    const bw = 12;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(ax - bw, ay - bw, aw + bw * 2, ah + bw * 2);
    ctx.fillStyle = frameColor || '#BA68C8';
    ctx.globalAlpha = 0.4;
    const cs = 8;
    for (let ix = ax - bw; ix < ax + aw + bw; ix += cs) {
      for (let iy = ay - bw; iy < ay + ah + bw; iy += cs) {
        if ((Math.floor((ix - ax + bw) / cs) + Math.floor((iy - ay + bw) / cs)) % 2 === 0) {
          ctx.fillRect(ix, iy, cs, cs);
        }
      }
    }
    ctx.globalAlpha = 1;
    // clear interior
    ctx.clearRect(ax, ay, aw, ah);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(ax, ay, aw, ah);
  } else if (style === 'soft') {
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, ax - 6, ay - 6, aw + 12, ah + 12, 12);
    ctx.fill();
    ctx.strokeStyle = frameColor;
    ctx.lineWidth   = 2;
    ctx.globalAlpha = 0.6;
    roundRect(ctx, ax - 6, ay - 6, aw + 12, ah + 12, 12);
    ctx.stroke();
    ctx.globalAlpha = 1;
  } else {
    // minimal
    ctx.strokeStyle = frameColor;
    ctx.lineWidth   = 3;
    ctx.strokeRect(ax, ay, aw, ah);
  }

  ctx.restore();
}

// ─── photo compositing ────────────────────────────────────────────────────────
async function drawPhotoInSlot(ctx, img, ax, ay, aw, ah) {
  ctx.save();
  // clip to slot
  ctx.beginPath();
  ctx.rect(ax, ay, aw, ah);
  ctx.clip();
  // cover-fit
  const scale = Math.max(aw / img.width, ah / img.height);
  const dw    = img.width  * scale;
  const dh    = img.height * scale;
  const dx    = ax + (aw - dw) / 2;
  const dy    = ay + (ah - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

function getCanvasFilter(filterName) {
  switch (filterName) {
    case 'warm':
      return 'brightness(1.05) sepia(0.2) saturate(1.15)';
    case 'cool':
      return 'brightness(1.02) hue-rotate(10deg) saturate(1.05) contrast(1.02)';
    case 'sepia':
      return 'sepia(0.85) contrast(0.95)';
    case 'grayscale':
      return 'grayscale(1.0) contrast(1.1)';
    case 'rose':
      return 'hue-rotate(320deg) saturate(1.3) brightness(1.02)';
    case 'vintage':
      return 'sepia(0.4) contrast(0.85) brightness(1.05) saturate(0.9)';
    default:
      return 'none';
  }
}

// ─── slot transformer (handles rotation) ──────────────────────────────────────
async function renderSlot(ctx, slot, photo, cw, ch) {
  const ax  = slot.x * cw;
  const ay  = slot.y * ch;
  const aw  = slot.w * cw;
  const ah  = slot.h * ch;
  const rot = (slot.rotation || 0) * (Math.PI / 180);

  ctx.save();
  ctx.translate(ax + aw / 2, ay + ah / 2);
  ctx.rotate(rot);

  // frame (centered around origin)
  const ox = -aw / 2, oy = -ah / 2;

  if (slot.style === 'film') {
    // draw film frame at origin
    ctx.fillStyle = '#000000';
    ctx.fillRect(ox - 10, oy - 10, aw + 20, ah + 20);
    const holeR = 5, holeGap = 22;
    ctx.fillStyle = '#2A2A2A';
    for (let hh = oy - 6; hh < oy + ah + 10; hh += holeGap) {
      ctx.beginPath(); ctx.arc(ox - 5, hh, holeR, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(ox + aw + 5, hh, holeR, 0, Math.PI * 2); ctx.fill();
    }
  } else if (slot.style === 'polaroid') {
    const pad = 8, capH = 26;
    ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 14; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 3;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(ox - pad, oy - pad, aw + pad * 2, ah + pad * 2 + capH);
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
  } else if (slot.style === 'soft') {
    ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 14; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, ox - 8, oy - 8, aw + 16, ah + 16, 12);
    ctx.fill();
    if (slot.borderColor) {
      ctx.strokeStyle = slot.borderColor; ctx.lineWidth = 3; ctx.globalAlpha = 0.7;
      roundRect(ctx, ox - 8, oy - 8, aw + 16, ah + 16, 12);
      ctx.stroke(); ctx.globalAlpha = 1;
    }
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
  } else if (slot.style === 'rough') {
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.fillRect(ox - 6, oy - 6, aw + 12, ah + 12);
    ctx.strokeStyle = slot.borderColor || '#FFFFFF';
    ctx.lineWidth = 3; ctx.setLineDash([5, 3]);
    ctx.strokeRect(ox - 6, oy - 6, aw + 12, ah + 12);
    ctx.setLineDash([]);
  } else if (slot.style === 'tape') {
    ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 10;
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(ox, oy, aw, ah);
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
  } else if (slot.style === 'gingham') {
    const bw = 12;
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(ox - bw, oy - bw, aw + bw * 2, ah + bw * 2);
    const fc = slot.borderColor || '#BA68C8';
    ctx.globalAlpha = 0.35;
    const cs = 8;
    for (let ix = 0; ix < aw + bw * 2; ix += cs) {
      for (let iy = 0; iy < ah + bw * 2; iy += cs) {
        if ((Math.floor(ix / cs) + Math.floor(iy / cs)) % 2 === 0) {
          ctx.fillStyle = fc;
          ctx.fillRect(ox - bw + ix, oy - bw + iy, cs, cs);
        }
      }
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(ox, oy, aw, ah);
  } else {
    // minimal
    ctx.strokeStyle = slot.borderColor || '#FFFFFF'; ctx.lineWidth = 3;
    ctx.strokeRect(ox, oy, aw, ah);
  }

  // photo
  if (photo) {
    let img;
    try {
      img = await loadImage(photo.url || photo);
    } catch (e) {
      console.warn('Could not load photo for slot', e);
    }
    if (img) {
      ctx.save();
      const filterName = photo.filterName || photo.filterApplied;
      if (filterName && filterName !== 'none') {
        ctx.filter = getCanvasFilter(filterName);
      }
      ctx.beginPath(); ctx.rect(ox, oy, aw, ah); ctx.clip();
      const scale = Math.max(aw / img.width, ah / img.height);
      const dw = img.width * scale, dh = img.height * scale;
      ctx.drawImage(img, ox + (aw - dw) / 2, oy + (ah - dh) / 2, dw, dh);
      ctx.restore();
    }
  } else {
    // empty placeholder
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(ox, oy, aw, ah);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📷', 0, 6);
  }

  ctx.restore(); // undo rotation + translate
}

// ─── overlay decorator ────────────────────────────────────────────────────────
function drawOverlay(ctx, overlay, cw, ch) {
  const x = overlay.x * cw;
  const y = overlay.y * ch;
  const size = overlay.size || 20;

  ctx.save();
  if (overlay.rotation) {
    ctx.translate(x, y);
    ctx.rotate(overlay.rotation * Math.PI / 180);
    ctx.translate(-x, -y);
  }

  if (overlay.type === 'emoji') {
    ctx.font = `${size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(overlay.emoji, x, y);
  } else if (overlay.type === 'text') {
    ctx.font = `${size}px ${overlay.font || 'cursive'}`;
    ctx.fillStyle = overlay.color || '#333';
    ctx.globalAlpha = overlay.opacity || 1;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(overlay.text, x, y);
  } else if (overlay.type === 'line') {
    ctx.strokeStyle = overlay.color || '#fff';
    ctx.lineWidth   = overlay.size || 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(overlay.x2 * cw, overlay.y2 * ch);
    ctx.stroke();
  }

  ctx.restore();
}

// ─── main render function ─────────────────────────────────────────────────────
/**
 * Renders a photobooth strip onto a canvas.
 * @param {object} template - Strip template definition
 * @param {Array}  photos   - Array of { url, blob } photo objects
 * @param {function} onProgress - Optional progress callback (0–1)
 * @returns {HTMLCanvasElement}
 */
export async function renderStrip(template, photos, onProgress) {
  const cw = template.width;
  const ch = template.height;

  const canvas = document.createElement('canvas');
  canvas.width  = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');

  // 1. Background
  drawBackground(ctx, template, cw, ch);
  if (onProgress) onProgress(0.1);

  // 2. Slots (frames + photos)
  for (let i = 0; i < template.slots.length; i++) {
    const slot  = template.slots[i];
    const photo = photos[i] || null;
    await renderSlot(ctx, slot, photo, cw, ch);
    if (onProgress) onProgress(0.1 + 0.7 * ((i + 1) / template.slots.length));
  }

  // 3. Overlays
  if (template.overlays) {
    for (const overlay of template.overlays) {
      drawOverlay(ctx, overlay, cw, ch);
    }
  }
  if (onProgress) onProgress(1.0);

  return canvas;
}

/**
 * Renders a mini preview of the template (no photos, just layout).
 * @param {object} template
 * @param {number} previewW  - preview canvas width
 * @param {number} previewH  - preview canvas height
 * @returns {HTMLCanvasElement}
 */
export function renderPreview(template, previewW = 120, previewH = 200) {
  const canvas = document.createElement('canvas');
  canvas.width  = previewW;
  canvas.height = previewH;
  const ctx = canvas.getContext('2d');

  const scaleX = previewW / template.width;
  const scaleY = previewH / template.height;

  // Background
  drawBackground(ctx, template, previewW, previewH);

  // Slots (placeholders only — no photos)
  for (const slot of template.slots) {
    const ax  = slot.x * previewW;
    const ay  = slot.y * previewH;
    const aw  = slot.w * previewW;
    const ah  = slot.h * previewH;
    const rot = (slot.rotation || 0) * (Math.PI / 180);

    ctx.save();
    ctx.translate(ax + aw / 2, ay + ah / 2);
    ctx.rotate(rot);

    // draw simple white box placeholder
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur  = 6;
    ctx.fillStyle   = 'rgba(255,255,255,0.9)';
    if (slot.style === 'film') {
      ctx.fillStyle = '#111';
      ctx.fillRect(-aw / 2 - 4, -ah / 2 - 4, aw + 8, ah + 8);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(-aw / 2, -ah / 2, aw, ah);
    } else if (slot.style === 'polaroid') {
      const p = 4, cap = 10;
      ctx.fillRect(-aw / 2 - p, -ah / 2 - p, aw + p * 2, ah + p * 2 + cap);
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(-aw / 2, -ah / 2, aw, ah);
    } else {
      ctx.fillRect(-aw / 2, -ah / 2, aw, ah);
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(-aw / 2 + 2, -ah / 2 + 2, aw - 4, ah - 4);
    }
    ctx.restore();
  }

  // Overlays (single-character text decorations only)
  if (template.overlays) {
    for (const overlay of template.overlays) {
      if (overlay.type === 'text' && overlay.text.length === 1) {
        const sz = Math.max(6, overlay.size * Math.min(scaleX, scaleY));
        ctx.font = `${sz}px ${overlay.font || 'sans-serif'}`;
        ctx.fillStyle = overlay.color || '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(overlay.text, overlay.x * previewW, overlay.y * previewH);
      }
    }
  }

  return canvas;
}

/**
 * Convert a canvas to a downloadable PNG blob URL
 */
export function canvasToDownloadUrl(canvas, filename = 'photobooth-strip.png') {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      resolve({ url, blob, filename });
    }, 'image/png', 1.0);
  });
}
