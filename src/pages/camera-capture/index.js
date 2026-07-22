// pages/camera-capture/index.js
// Integrated Camera Capture and Strip Template Selection Page
// Uses Bootstrap Icons (no emojis)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import { sessionAPI } from '../../services/api';
import STRIP_TEMPLATES, { TEMPLATE_CATEGORIES } from '../../utils/stripTemplates';
import { renderPreview } from '../../utils/stripRenderer';

// ─── template list card component ─────────────────────────────────────────────
const TemplateMiniCard = ({ template, isSelected, onClick }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const preview = renderPreview(template, 80, 130);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 80, 130);
    ctx.drawImage(preview, 0, 0);
  }, [template]);

  return (
    <button
      onClick={() => onClick(template)}
      className={`group relative flex items-center gap-3 p-2 w-full rounded-xl border text-left transition-all duration-150 cursor-pointer flex-shrink-0
        ${isSelected
          ? 'bg-rose-50/80 border-rose-400 shadow-xs ring-1 ring-rose-300'
          : 'bg-white/60 border-gray-200 hover:bg-white hover:border-rose-200'
        }
      `}
      style={{ width: '100%', maxWidth: '280px' }}
    >
      <div className="relative w-14 h-24 bg-muted/20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 shadow-xs">
        <canvas ref={canvasRef} width={80} height={130} className="w-full h-full object-cover" />
        <div className="absolute top-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1 py-0.2 rounded-full flex items-center gap-0.5">
          <i className="bi bi-camera-fill"></i>
          <span>{template.photoCount}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-800 truncate flex items-center gap-1.5">
          <i className={`${template.iconClass || 'bi bi-camera-fill'} text-rose-500`}></i>
          {template.name}
        </p>
        <p className="text-[10px] text-gray-500 mt-0.5">
          {template.photoCount} frames
        </p>
        <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mt-1">
          {template.category}
        </p>
      </div>
    </button>
  );
};

export default function CameraCapture() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // ── state ──────────────────────────────────────────────────────────────────
  const [selectedTemplate, setSelectedTemplate] = useState(
    location.state?.template || STRIP_TEMPLATES.find(t => t.id === 'classic-film-4') || STRIP_TEMPLATES[0]
  );
  const [activeCategory, setActiveCategory] = useState('all');

  const [cameraState,    setCameraState]    = useState('idle');   // idle | requesting | streaming | error
  const [errorMsg,       setErrorMsg]       = useState('');
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [countdown,      setCountdown]      = useState(0);
  const [isCounting,     setIsCounting]     = useState(false);
  const [flashActive,    setFlashActive]    = useState(false);
  const [sessionId,      setSessionId]      = useState(null);

  // ── refs ──────────────────────────────────────────────────────────────────
  const videoRef   = useRef(null);
  const streamRef  = useRef(null);
  const timerRef   = useRef(null);
  const capturedRef = useRef([]);

  capturedRef.current = capturedPhotos;
  const TOTAL = selectedTemplate.photoCount;

  // ── auth guard & init ──────────────────────────────────────────────────────
  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') !== 'true') {
      navigate('/login');
      return;
    }
    startCamera();
    createSession();
    return () => {
      stopStream();
      clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset captured photos if the template changes
  const handleTemplateChange = (template) => {
    if (capturedPhotos.length > 0) {
      if (window.confirm("Changing templates will discard your current captured photos. Continue?")) {
        handleRetakeAll();
      } else {
        return;
      }
    }
    setSelectedTemplate(template);
  };

  // ── stream management ──────────────────────────────────────────────────────
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const startCamera = useCallback(async () => {
    setCameraState('requesting');
    setErrorMsg('');
    stopStream();

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width:      { ideal: 1280 },
          height:     { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = mediaStream;

      const wireVideo = () => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(e => console.warn('play error', e));
            setCameraState('streaming');
          };
        } else {
          requestAnimationFrame(wireVideo);
        }
      };
      wireVideo();
    } catch (err) {
      console.error('Camera error:', err);
      let msg = 'Could not access camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Click "Allow Camera" and try again, or check your browser settings.';
      } else if (err.name === 'NotFoundError') {
        msg = 'No camera found on this device. Connect a webcam and try again.';
      } else if (err.name === 'NotReadableError') {
        msg = 'Camera is already in use by another app. Close it and try again.';
      }
      setErrorMsg(msg);
      setCameraState('error');
    }
  }, []);

  const createSession = async () => {
    try {
      const s = await sessionAPI.createSession(`${selectedTemplate.name} — ${new Date().toLocaleDateString()}`);
      setSessionId(s.id);
    } catch (e) {
      console.warn('Session creation failed:', e);
    }
  };

  // ── capture ────────────────────────────────────────────────────────────────
  const doCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2 || !video.videoWidth) {
      console.warn('Video not ready');
      return;
    }

    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 250);

    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob(blob => {
      if (!blob) return;
      const url      = URL.createObjectURL(blob);
      const newPhoto = {
        id:        `photo_${Date.now()}`,
        url,
        blob,
        timestamp: new Date().toISOString(),
        index:     capturedRef.current.length,
      };
      const updated = [...capturedRef.current, newPhoto];
      setCapturedPhotos(updated);

      if (updated.length >= TOTAL) {
        stopStream();
        setTimeout(() => {
          navigate('/strip-compositor', {
            state: { photos: updated, template: selectedTemplate, sessionId },
          });
        }, 600);
      }
    }, 'image/jpeg', 0.95);
  }, [TOTAL, selectedTemplate, sessionId, navigate]);

  // ── countdown ──────────────────────────────────────────────────────────────
  const startCountdown = useCallback(() => {
    if (isCounting || capturedPhotos.length >= TOTAL || cameraState !== 'streaming') return;
    setIsCounting(true);
    setCountdown(3);
    let count = 3;
    timerRef.current = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(timerRef.current);
        setCountdown(0);
        setIsCounting(false);
        doCapture();
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [isCounting, capturedPhotos.length, TOTAL, cameraState, doCapture]);

  const handleRetakeAll = () => {
    capturedPhotos.forEach(p => { try { URL.revokeObjectURL(p.url); } catch {} });
    setCapturedPhotos([]);
  };

  const captured   = capturedPhotos.length;
  const isStreaming = cameraState === 'streaming';

  const filteredTemplates = activeCategory === 'all'
    ? STRIP_TEMPLATES
    : STRIP_TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden">
      <PrimaryNavigation />

      {/* ── Main Layout (Sidebar on Desktop, Column on Mobile) ───────────────── */}
      <div className="flex-1 flex flex-col md:flex-row pt-16 overflow-hidden min-h-0">
        
        {/* ── Template Picker Panel ───────────────────────────────────────── */}
        <div className="w-full md:w-80 bg-white/95 text-gray-800 flex flex-col border-b md:border-b-0 md:border-r border-rose-100 flex-shrink-0 h-[300px] md:h-full overflow-hidden">
          
          {/* Header */}
          <div className="p-3 border-b border-rose-100 bg-rose-50/50 flex items-center justify-between flex-shrink-0">
            <h2 className="text-sm font-black text-gray-800 tracking-wider uppercase flex items-center gap-2">
              <i className="bi bi-grid-fill text-rose-500"></i>
              Select Template
            </h2>
            <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
              {STRIP_TEMPLATES.length} Designs
            </span>
          </div>

          {/* Categories Tab Scroll */}
          <div className="px-2 py-1.5 border-b border-rose-50 flex gap-1 overflow-x-auto scrollbar-none bg-white flex-shrink-0">
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border
                  ${activeCategory === cat.id
                    ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-rose-300'
                  }
                `}
              >
                <i className={cat.iconClass}></i>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Templates Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 flex md:flex-col gap-2.5 bg-gray-50/50 overflow-x-auto md:overflow-x-hidden">
            {filteredTemplates.map(template => (
              <TemplateMiniCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate.id === template.id}
                onClick={handleTemplateChange}
              />
            ))}
          </div>
        </div>

        {/* ── Camera Capture Terminal ────────────────────────────────────── */}
        <div className="flex-1 flex flex-col relative bg-black min-h-0">
          
          {/* Active Template Banner */}
          <div className="absolute top-0 left-0 right-0 z-10 px-4 py-2.5 bg-black/70 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className={`${selectedTemplate.iconClass || 'bi bi-camera-fill'} text-lg text-rose-400`}></i>
              <div>
                <p className="font-bold text-xs text-white leading-tight">{selectedTemplate.name}</p>
                <p className="text-[10px] text-gray-300 uppercase tracking-wider">{selectedTemplate.category}</p>
              </div>
            </div>

            {/* Slot progress */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: TOTAL }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all
                    ${i < captured ? 'bg-rose-500 border-rose-500' : 'bg-transparent border-white/40'}`}
                >
                  {i < captured && (
                    <i className="bi bi-check text-[9px] font-black text-white"></i>
                  )}
                </div>
              ))}
              <span className="ml-1 text-[10px] font-bold text-gray-300">{captured}/{TOTAL}</span>
            </div>
          </div>

          {/* Camera display */}
          <div className="flex-1 relative bg-black flex items-center justify-center">
            
            {/* Camera Video Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: (cameraState === 'streaming' || cameraState === 'requesting') ? 'block' : 'none',
              }}
            />

            {/* Flash Layer */}
            {flashActive && (
              <div style={{
                position: 'absolute', inset: 0, background: 'white',
                opacity: 0.9, pointerEvents: 'none', zIndex: 30,
              }} />
            )}

            {/* Camera Viewfinder Guides */}
            {isStreaming && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
                <div style={{ position:'absolute', top:56, left:16, width:30, height:30, borderTop:'3px solid rgba(244,63,94,0.7)', borderLeft:'3px solid rgba(244,63,94,0.7)', borderRadius:'4px 0 0 0' }} />
                <div style={{ position:'absolute', top:56, right:16, width:30, height:30, borderTop:'3px solid rgba(244,63,94,0.7)', borderRight:'3px solid rgba(244,63,94,0.7)', borderRadius:'0 4px 0 0' }} />
                <div style={{ position:'absolute', bottom:16, left:16, width:30, height:30, borderBottom:'3px solid rgba(244,63,94,0.7)', borderLeft:'3px solid rgba(244,63,94,0.7)', borderRadius:'0 0 0 4px' }} />
                <div style={{ position:'absolute', bottom:16, right:16, width:30, height:30, borderBottom:'3px solid rgba(244,63,94,0.7)', borderRight:'3px solid rgba(244,63,94,0.7)', borderRadius:'0 0 4px 0' }} />
              </div>
            )}

            {/* Loader / Permission Requesting */}
            {cameraState === 'requesting' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 px-6 text-center">
                <div className="w-12 h-12 rounded-full border-4 border-rose-500/30 border-t-rose-500 animate-spin mb-4" />
                <h3 className="text-base font-bold mb-1">Requesting Camera Access</h3>
                <p className="text-xs text-gray-400">Please click allow on the browser prompt to start shooting</p>
              </div>
            )}

            {/* Camera Error Screen */}
            {cameraState === 'error' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/95 px-6 text-center">
                <i className="bi bi-exclamation-triangle text-rose-500 text-4xl mb-3"></i>
                <h3 className="text-base font-bold mb-2">Camera Access Failed</h3>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed mb-6">
                  {errorMsg}
                </p>
                <button
                  onClick={startCamera}
                  className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <i className="bi bi-camera-fill"></i>
                  Allow &amp; Retry Camera
                </button>
              </div>
            )}

            {/* Countdown Overlay */}
            {isCounting && countdown > 0 && (
              <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none">
                <div
                  key={countdown}
                  className="w-24 h-24 rounded-full bg-rose-500/90 flex items-center justify-center text-5xl font-black text-white shadow-lg animate-pulse"
                >
                  {countdown}
                </div>
              </div>
            )}

            {/* Overlay indicators */}
            {captured >= TOTAL && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center z-26 pointer-events-none">
                <div className="bg-rose-500 text-white font-bold px-5 py-2 rounded-full text-xs shadow-lg flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                  Compositing your strip...
                </div>
              </div>
            )}

            {isStreaming && !isCounting && captured < TOTAL && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10 pointer-events-none">
                <div className="bg-black/60 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold">
                  Photo {captured + 1} of {TOTAL}
                </div>
              </div>
            )}

          </div>

          {/* Shutter & Controls Bottom Bar */}
          <div className="bg-slate-950 border-t border-white/5 py-4 px-6 flex items-center justify-center gap-12 flex-shrink-0 z-10">
            
            {/* Retake Button */}
            <button
              onClick={handleRetakeAll}
              disabled={captured === 0}
              className={`flex flex-col items-center gap-1 background-none border-none transition-all
                ${captured === 0 ? 'opacity-25 cursor-default' : 'opacity-85 hover:opacity-100 cursor-pointer'}`}
            >
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white">
                <i className="bi bi-arrow-counterclockwise text-sm"></i>
              </div>
              <span className="text-[10px] text-gray-400">Retake</span>
            </button>

            {/* Central Shutter Button */}
            <button
              onClick={isStreaming ? startCountdown : startCamera}
              disabled={isCounting || captured >= TOTAL}
              className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-150
                ${(isCounting || captured >= TOTAL || !isStreaming)
                  ? 'border-gray-700 bg-gray-800 cursor-default opacity-40'
                  : 'border-rose-500 bg-white hover:bg-rose-50 shadow-md active:scale-95 cursor-pointer'
                }
              `}
            >
              <div className={`w-11 h-11 rounded-full transition-colors duration-150
                ${isStreaming ? 'bg-rose-500' : 'bg-gray-600'}
              `} />
            </button>

            {/* Status Info Button */}
            <div className="flex flex-col items-center gap-1 opacity-70">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white">
                <i className="bi bi-info-circle text-sm"></i>
              </div>
              <span className="text-[10px] text-gray-400">{TOTAL} Shots</span>
            </div>

          </div>

        </div>

      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}