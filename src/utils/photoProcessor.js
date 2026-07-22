const drawLeaf = (ctx, x, y, size, angle) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = '#557A46'; // sage green
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(size, -size / 2, size * 1.5, 0);
  ctx.quadraticCurveTo(size, size / 2, 0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

const drawRose = (ctx, x, y, r) => {
  ctx.save();
  ctx.translate(x, y);
  
  // Base circle
  ctx.fillStyle = '#D4426B'; // deep rose
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  
  // Petals
  ctx.fillStyle = '#FF758F'; // lighter pink
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const px = Math.cos(angle) * (r * 0.4);
    const py = Math.sin(angle) * (r * 0.4);
    ctx.beginPath();
    ctx.arc(px, py, r * 0.6, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  
  // Inner center
  ctx.fillStyle = '#FFB3C1'; // soft pink
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
};

const drawFrame = (ctx, w, h, frameId) => {
  const minDim = Math.min(w, h);
  const borderSize = minDim * 0.04;

  if (frameId === 'rose-gold') {
    ctx.save();
    
    // Draw gold outer double border
    ctx.strokeStyle = '#B76E79'; // Rose Gold
    ctx.lineWidth = borderSize * 0.4;
    ctx.strokeRect(borderSize * 0.6, borderSize * 0.6, w - borderSize * 1.2, h - borderSize * 1.2);
    
    ctx.strokeStyle = '#E5C158'; // Soft Gold inner
    ctx.lineWidth = borderSize * 0.1;
    ctx.strokeRect(borderSize * 1.2, borderSize * 1.2, w - borderSize * 2.4, h - borderSize * 2.4);
    
    // Corner accents
    drawLeaf(ctx, borderSize * 1.5, borderSize * 1.5, borderSize * 0.4, -Math.PI / 4);
    drawRose(ctx, borderSize * 1.5, borderSize * 1.5, borderSize * 0.35);
    
    drawLeaf(ctx, w - borderSize * 1.5, borderSize * 1.5, borderSize * 0.4, Math.PI / 4);
    drawRose(ctx, w - borderSize * 1.5, borderSize * 1.5, borderSize * 0.35);
    
    drawLeaf(ctx, borderSize * 1.5, h - borderSize * 1.5, borderSize * 0.4, -3 * Math.PI / 4);
    drawRose(ctx, borderSize * 1.5, h - borderSize * 1.5, borderSize * 0.35);
    
    drawLeaf(ctx, w - borderSize * 1.5, h - borderSize * 1.5, borderSize * 0.4, 3 * Math.PI / 4);
    drawRose(ctx, w - borderSize * 1.5, h - borderSize * 1.5, borderSize * 0.35);
    
    ctx.restore();
  } else if (frameId === 'rose-vines') {
    ctx.save();
    
    // Wavy green vine on left
    ctx.strokeStyle = '#557A46';
    ctx.lineWidth = borderSize * 0.15;
    ctx.beginPath();
    ctx.moveTo(borderSize * 0.8, 0);
    for (let y = 0; y <= h; y += 10) {
      const x = borderSize * 0.8 + Math.sin(y * 0.05) * (borderSize * 0.2);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Wavy green vine on right
    ctx.beginPath();
    ctx.moveTo(w - borderSize * 0.8, 0);
    for (let y = 0; y <= h; y += 10) {
      const x = w - borderSize * 0.8 + Math.sin(y * 0.05) * (borderSize * 0.2);
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Leaves and small roses along the vines
    const vineSteps = 6;
    for (let i = 1; i < vineSteps; i++) {
      const yLeft = (h / vineSteps) * i;
      const xLeft = borderSize * 0.8 + Math.sin(yLeft * 0.05) * (borderSize * 0.2);
      drawLeaf(ctx, xLeft, yLeft, borderSize * 0.4, i % 2 === 0 ? 0 : Math.PI);
      if (i % 2 === 0) {
        drawRose(ctx, xLeft, yLeft, borderSize * 0.3);
      }

      const yRight = (h / vineSteps) * i + (h / (vineSteps * 2));
      const xRight = w - borderSize * 0.8 + Math.sin(yRight * 0.05) * (borderSize * 0.2);
      drawLeaf(ctx, xRight, yRight, borderSize * 0.4, i % 2 === 0 ? 0 : Math.PI);
      if (i % 2 !== 0) {
        drawRose(ctx, xRight, yRight, borderSize * 0.3);
      }
    }
    
    ctx.restore();
  } else if (frameId === 'polaroid-rose') {
    ctx.save();
    
    const polaroidBottom = h * 0.16;
    const polaroidSide = w * 0.05;
    
    // Draw the white solid border overlays
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, polaroidSide, h);
    ctx.fillRect(w - polaroidSide, 0, polaroidSide, h);
    ctx.fillRect(0, 0, w, polaroidSide);
    ctx.fillRect(0, h - polaroidBottom, w, polaroidBottom);
    
    // Inner thin border
    ctx.strokeStyle = 'rgba(183, 110, 121, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(polaroidSide, polaroidSide, w - polaroidSide * 2, h - polaroidSide - polaroidBottom);
    
    // Watercolor Roses bottom-right
    const rx = w - polaroidSide - polaroidBottom * 0.45;
    const ry = h - polaroidBottom * 0.55;
    const size = polaroidBottom * 0.25;
    
    drawLeaf(ctx, rx - size * 0.5, ry, size * 0.8, -Math.PI / 3);
    drawLeaf(ctx, rx + size * 0.5, ry, size * 0.8, Math.PI / 3);
    drawRose(ctx, rx, ry, size);
    drawRose(ctx, rx - size * 0.7, ry + size * 0.2, size * 0.75);
    
    // Text label
    ctx.fillStyle = '#2D1B14';
    ctx.font = `italic 600 ${Math.floor(polaroidBottom * 0.2)}px 'Playfair Display', serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText("Rose Photobooth", polaroidSide * 2, h - polaroidBottom * 0.6);
    
    // Date label
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    ctx.fillStyle = '#8B5A3C';
    ctx.font = `${Math.floor(polaroidBottom * 0.09)}px 'Source Sans 3', sans-serif`;
    ctx.fillText(today, polaroidSide * 2, h - polaroidBottom * 0.3);
    
    ctx.restore();
  }
};

export const processPhoto = (photoBlob, { filter, adjustments, rotation, flipHorizontal, flipVertical, frameId }) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(photoBlob);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const angle = (rotation % 360 + 360) % 360;
      const is90or270 = angle === 90 || angle === 270;
      
      const width = is90or270 ? img.height : img.width;
      const height = is90or270 ? img.width : img.height;
      
      canvas.width = width;
      canvas.height = height;
      
      // Center translation
      ctx.translate(width / 2, height / 2);
      
      // Flips
      const scaleX = flipHorizontal ? -1 : 1;
      const scaleY = flipVertical ? -1 : 1;
      ctx.scale(scaleX, scaleY);
      
      // Rotation
      ctx.rotate((angle * Math.PI) / 180);
      
      // Filters
      let filterString = '';
      if (adjustments) {
        if (adjustments.brightness !== 0) {
          filterString += `brightness(${100 + adjustments.brightness}%) `;
        }
        if (adjustments.contrast !== 0) {
          filterString += `contrast(${100 + adjustments.contrast}%) `;
        }
        if (adjustments.saturation !== 0) {
          filterString += `saturate(${100 + adjustments.saturation}%) `;
        }
      }
      if (filter && filter.cssFilter && filter.cssFilter !== 'none') {
        filterString += filter.cssFilter;
      }
      
      ctx.filter = filterString.trim() || 'none';
      
      // Draw original image centered
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      
      // Reset transforms and filters to draw the frame
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.filter = 'none';
      
      // Draw rose border frame
      if (frameId && frameId !== 'none') {
        drawFrame(ctx, width, height, frameId);
      }
      
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(img.src);
        resolve(blob);
      }, 'image/jpeg', 0.95);
    };
    
    img.onerror = (err) => {
      URL.revokeObjectURL(img.src);
      reject(err);
    };
  });
};
