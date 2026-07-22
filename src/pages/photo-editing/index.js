// pages/photo-editing/index.js
// Integrated Photo Strip Editing and Compression Page
// Uses Bootstrap Icons (no emojis)
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import { renderStrip } from '../../utils/stripRenderer';

// Binary search quality compressor to match target MB limit
const compressToTargetSize = async (canvas, format, initialQuality, targetMB) => {
  const maxBytes = targetMB * 1024 * 1024;

  if (format === 'png') {
    return new Promise(resolve => {
      canvas.toBlob(blob => resolve({ blob, quality: 1.0 }), 'image/png');
    });
  }

  let quality = initialQuality;
  let minQ = 0.1, maxQ = 1.0;
  let bestBlob = null;
  let bestQuality = quality;

  for (let iter = 0; iter < 6; iter++) {
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });

    if (!blob) break;

    if (blob.size <= maxBytes) {
      bestBlob = blob;
      bestQuality = quality;
      minQ = quality;
      quality = (quality + maxQ) / 2;
    } else {
      maxQ = quality;
      quality = (quality + minQ) / 2;
    }
  }

  if (!bestBlob) {
    bestBlob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', 0.2);
    });
    bestQuality = 0.2;
  }

  return { blob: bestBlob, quality: bestQuality };
};

const FILTER_PRESETS = [
  { id: 'none',      label: 'Original',  iconClass: 'bi bi-image' },
  { id: 'warm',      label: 'Warm Sun',  iconClass: 'bi bi-brightness-high-fill' },
  { id: 'cool',      label: 'Cool Breeze',iconClass: 'bi bi-wind' },
  { id: 'sepia',     label: 'Sepia Nostalgia', iconClass: 'bi bi-journal-text' },
  { id: 'grayscale', label: 'Black & White', iconClass: 'bi bi-moon-fill' },
  { id: 'rose',      label: 'Rose Tint', iconClass: 'bi bi-flower1' },
  { id: 'vintage',   label: 'Retro Film',iconClass: 'bi bi-camera-reels-fill' },
];

export default function PhotoEditing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { photos = [], template, sessionId } = location.state || {};

  // ── state ──────────────────────────────────────────────────────────────────
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [format, setFormat] = useState('jpg'); // 'jpg' | 'png'
  const [qualityPreset, setQualityPreset] = useState('high'); // 'low' | 'medium' | 'high' | 'ultra'
  const [targetSizeLimit, setTargetSizeLimit] = useState('none'); // 'none' | '1' | '2' | '5'
  
  const [stripUrl, setStripUrl] = useState(null);
  const [estimatedSizeKB, setEstimatedSizeKB] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);

  // ── auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') !== 'true') {
      navigate('/login');
      return;
    }
    if (!template || photos.length === 0) {
      navigate('/camera-capture');
      return;
    }
    // Initialize default filter from the first photo if already set
    if (photos[0]?.filterName) {
      setSelectedFilter(photos[0].filterName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update rendering when settings change
  useEffect(() => {
    if (template && photos.length > 0) {
      updatePreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, format, qualityPreset, targetSizeLimit, template, photos]);

  const updatePreview = async () => {
    setIsProcessing(true);
    try {
      // Map filter to all photos
      const filteredPhotos = photos.map(p => ({ ...p, filterName: selectedFilter }));
      const canvas = await renderStrip(template, filteredPhotos);

      // Map quality preset to quality value
      let baseQuality = 0.92;
      if (qualityPreset === 'low') baseQuality = 0.5;
      if (qualityPreset === 'medium') baseQuality = 0.75;
      if (qualityPreset === 'ultra') baseQuality = 0.98;

      let finalBlob;
      if (targetSizeLimit !== 'none') {
        const { blob } = await compressToTargetSize(canvas, format, baseQuality, parseFloat(targetSizeLimit));
        finalBlob = blob;
      } else {
        finalBlob = await new Promise(resolve => {
          canvas.toBlob(resolve, format === 'png' ? 'image/png' : 'image/jpeg', baseQuality);
        });
      }

      if (stripUrl) {
        URL.revokeObjectURL(stripUrl);
      }

      const url = URL.createObjectURL(finalBlob);
      setStripUrl(url);
      setEstimatedSizeKB(Math.round(finalBlob.size / 1024));

      // Draw onto the display canvas
      const previewCanvas = canvasRef.current;
      if (previewCanvas) {
        previewCanvas.width = canvas.width;
        previewCanvas.height = canvas.height;
        previewCanvas.getContext('2d').drawImage(canvas, 0, 0);
      }
    } catch (e) {
      console.error('Preview update failed:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      const filteredPhotos = photos.map(p => ({ ...p, filterName: selectedFilter }));
      const canvas = await renderStrip(template, filteredPhotos);

      let baseQuality = 0.92;
      if (qualityPreset === 'low') baseQuality = 0.5;
      if (qualityPreset === 'medium') baseQuality = 0.75;
      if (qualityPreset === 'ultra') baseQuality = 0.98;

      let finalBlob;
      if (targetSizeLimit !== 'none') {
        const { blob } = await compressToTargetSize(canvas, format, baseQuality, parseFloat(targetSizeLimit));
        finalBlob = blob;
      } else {
        finalBlob = await new Promise(resolve => {
          canvas.toBlob(resolve, format === 'png' ? 'image/png' : 'image/jpeg', baseQuality);
        });
      }

      // Convert final output to a reusable blob URL
      const finalUrl = URL.createObjectURL(finalBlob);

      // Navigate back to the compositor with the customized parameters
      navigate('/strip-compositor', {
        state: {
          photos: filteredPhotos,
          template,
          sessionId,
          editedStrip: {
            url: finalUrl,
            blob: finalBlob,
            format,
            quality: baseQuality,
            targetSizeLimit
          }
        }
      });
    } catch (e) {
      console.error('Save failed:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <PrimaryNavigation />

      <div className="flex-1 flex flex-col md:flex-row mt-16 overflow-hidden">
        
        {/* ── Preview Panel (Left) ─────────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-950 relative min-h-[350px]">
          {isProcessing && (
            <div className="absolute inset-0 bg-slate-950/70 z-10 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mb-3"></div>
              <p className="text-xs text-rose-300 font-bold uppercase tracking-wider">Processing Strip...</p>
            </div>
          )}

          <div
            className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white"
            style={{ maxWidth: '280px', maxHeight: '72vh' }}
          >
            {stripUrl ? (
              <img
                src={stripUrl}
                alt="Photobooth strip preview"
                className="block w-full h-auto object-contain"
                style={{ maxHeight: '72vh' }}
              />
            ) : (
              <div className="w-64 h-96 flex items-center justify-center text-gray-500 bg-slate-900 animate-pulse">
                Rendering...
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* ── Editor Toolbar (Right) ───────────────────────────────────────── */}
        <div 
          className="w-full md:w-[380px] bg-white text-gray-800 flex flex-col border-t md:border-t-0 md:border-l border-rose-100 flex-shrink-0 h-[400px] md:h-auto overflow-y-auto"
          style={{ minWidth: '380px', width: '380px' }}
        >
          
          <div className="p-4 border-b border-rose-100 bg-rose-50/50 flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-800 tracking-wider uppercase flex items-center gap-2">
              <i className="bi bi-sliders text-rose-500"></i>
              Customize Strip
            </h2>
            <div className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-md border border-slate-200">
              Size: {estimatedSizeKB >= 1024 ? `${(estimatedSizeKB / 1024).toFixed(2)} MB` : `${estimatedSizeKB} KB`}
            </div>
          </div>

          <div className="p-4 space-y-6">
            
            {/* 1. Filter Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Photo Filter Preset
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FILTER_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedFilter(preset.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer
                      ${selectedFilter === preset.id
                        ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs ring-1 ring-rose-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-rose-200 text-gray-700'
                      }
                    `}
                  >
                    <i className={`${preset.iconClass} text-rose-500`}></i>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Format & Quality Selector */}
            <div className="space-y-4 pt-4 border-t border-rose-50">
              
              {/* Image Format */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  File Format
                </label>
                <div className="flex gap-2">
                  {['jpg', 'png'].map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer
                        ${format === fmt
                          ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-white hover:border-rose-300'
                        }
                      `}
                    >
                      <i className={fmt === 'png' ? 'bi bi-filetype-png' : 'bi bi-filetype-jpg'}></i>
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Quality option */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Photo Quality Option</span>
                  {format === 'png' && <span className="text-[10px] text-amber-500 font-semibold lowercase">JPG only</span>}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'low', label: 'Low (Comp.)' },
                    { id: 'medium', label: 'Medium' },
                    { id: 'high', label: 'High' },
                    { id: 'ultra', label: 'Ultra (HQ)' },
                  ].map(preset => (
                    <button
                      key={preset.id}
                      disabled={format === 'png'}
                      onClick={() => setQualityPreset(preset.id)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer
                        ${format === 'png' ? 'opacity-40 cursor-not-allowed' : ''}
                        ${qualityPreset === preset.id && format !== 'png'
                          ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs ring-1 ring-rose-300'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white hover:border-rose-200'
                        }
                      `}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target File Size limit (MB selection option) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>MB Selection (Target Size Limit)</span>
                  {format === 'png' && <span className="text-[10px] text-amber-500 font-semibold lowercase">JPG only</span>}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'none', label: 'No Limit' },
                    { id: '1', label: 'Limit to 1 MB' },
                    { id: '2', label: 'Limit to 2 MB' },
                    { id: '5', label: 'Limit to 5 MB' },
                  ].map(limit => (
                    <button
                      key={limit.id}
                      disabled={format === 'png'}
                      onClick={() => setTargetSizeLimit(limit.id)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer
                        ${format === 'png' ? 'opacity-40 cursor-not-allowed' : ''}
                        ${targetSizeLimit === limit.id && format !== 'png'
                          ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs ring-1 ring-rose-300'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white hover:border-rose-200'
                        }
                      `}
                    >
                      {limit.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-rose-50 flex gap-3">
              <button
                onClick={() => navigate('/strip-compositor', { state: { photos, template, sessionId } })}
                className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-2xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isProcessing}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <i className="bi bi-check-lg"></i>
                Apply Changes
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}