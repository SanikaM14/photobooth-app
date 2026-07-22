import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import { renderStrip, canvasToDownloadUrl } from '../../utils/stripRenderer';
import { photoAPI } from '../../services/api';

const StripCompositor = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { photos = [], template, sessionId, editedStrip } = location.state || {};

  const [phase,    setPhase]    = useState('rendering'); // 'rendering' | 'ready' | 'error'
  const [progress, setProgress] = useState(0);
  const [stripUrl, setStripUrl] = useState(null);
  const [stripBlob, setStripBlob] = useState(null);
  const [renderError, setRenderError] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const uploadStartedRef = useRef(false);

  // Check if current user is logged in as the Guest Bypass user
  const checkIsGuest = () => {
    try {
      const userStr = localStorage.getItem('user') || localStorage.getItem('userProfile');
      if (userStr) {
        const u = JSON.parse(userStr);
        return u.email === 'guest@rosephotobooth.dev';
      }
    } catch (e) {}
    return false;
  };
  const isGuestUser = checkIsGuest();

  // ── auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') !== 'true') {
      navigate('/login');
      return;
    }
    if (!template || photos.length === 0) {
      navigate('/strip-selection');
      return;
    }

    if (editedStrip) {
      // Use the edited strip directly
      setStripUrl(editedStrip.url);
      setStripBlob(editedStrip.blob);
      setPhase('ready');
      if (!isGuestUser) {
        autoSave(editedStrip.blob);
      }
    } else {
      buildStrip();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const autoSave = async (blob) => {
    if (isGuestUser) return;
    if (!blob || uploadStartedRef.current) return;
    uploadStartedRef.current = true;
    setIsSaving(true);
    try {
      const file = new File([blob], `${template?.name?.replace(/\s+/g, '-') || 'strip'}-strip.png`, { type: 'image/png' });
      const uploaded = await photoAPI.uploadPhoto({
        photo: file,
        title: template?.name || 'Photobooth Strip',
        description: `Strip template: ${template?.id}`,
        filterApplied: 'none',
        sessionId: sessionId,
        photoOrder: 0,
        stripTemplateId: template?.id
      });
      if (uploaded && uploaded.id) {
        await photoAPI.markAsDownloaded(uploaded.id);
      }
      setIsSaved(true);
    } catch (err) {
      console.error("Auto-saving strip to gallery failed:", err);
      uploadStartedRef.current = false; // Reset on failure so the user can retry
    } finally {
      setIsSaving(false);
    }
  };

  // ── render strip ───────────────────────────────────────────────────────────
  const buildStrip = async () => {
    setPhase('rendering');
    setProgress(0);
    setRenderError('');
    try {
      const canvas = await renderStrip(template, photos, (p) => {
        setProgress(Math.round(p * 100));
      });

      // Generate download blob
      const { url, blob } = await canvasToDownloadUrl(canvas, `${template?.name?.replace(/\s+/g, '-') || 'strip'}-strip.png`);
      setStripUrl(url);
      setStripBlob(blob);
      setPhase('ready');
      if (!isGuestUser) {
        autoSave(blob);
      }
    } catch (err) {
      console.error('Strip render failed:', err);
      setRenderError(err.message || String(err));
      setPhase('error');
    }
  };

  const handleGuestRedirect = () => {
    navigate('/login', {
      state: {
        redirectTo: '/strip-compositor',
        photos,
        template,
        sessionId
      }
    });
  };

  // ── download ───────────────────────────────────────────────────────────────
  const handleDownload = () => {
    if (isGuestUser) {
      handleGuestRedirect();
      return;
    }
    if (!stripUrl) return;
    const a = document.createElement('a');
    a.href     = stripUrl;
    a.download = `${template?.name?.replace(/\s+/g, '-') || 'strip'}-photobooth.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ── share (Web Share API) ──────────────────────────────────────────────────
  const handleShare = async () => {
    if (isGuestUser) {
      handleGuestRedirect();
      return;
    }
    if (!stripBlob || !navigator.share) {
      handleDownload();
      return;
    }
    try {
      const file = new File([stripBlob], 'photobooth-strip.png', { type: 'image/png' });
      await navigator.share({ title: 'My Photobooth Strip', files: [file] });
    } catch (e) {
      console.warn('Share failed, downloading instead:', e);
      handleDownload();
    }
  };

  const handleRetake = () => {
    photos.forEach(p => { try { URL.revokeObjectURL(p.url); } catch {} });
    navigate('/camera-capture', { state: { template, sessionId } });
  };

  const handleNewStrip = () => {
    photos.forEach(p => { try { URL.revokeObjectURL(p.url); } catch {} });
    navigate('/strip-selection');
  };

  // ── rendering phase ────────────────────────────────────────────────────────
  if (phase === 'rendering') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1A0010, #2D0050, #0A0A1A)' }}>
        <div className="text-center px-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/30" />
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
              style={{ animation: 'spin 1s linear infinite' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="bi bi-flower1 text-rose-500 text-3xl animate-pulse"></i>
            </div>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Developing your strip…</h2>
          <p className="text-white/60 text-sm mb-6">Compositing {template?.photoCount} photos</p>

          {/* Progress bar */}
          <div className="w-64 h-2 rounded-full bg-white/10 mx-auto overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/40 text-xs mt-2">{progress}%</p>
        </div>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle-fill text-rose-500 text-5xl mb-4"></i>
          <h2 className="text-xl font-bold text-foreground mb-2">Oops! Strip failed to render</h2>
          <p className="text-muted-foreground text-sm mb-6">Something went wrong compositing your strip.</p>
          {renderError && (
            <pre className="text-xs text-error bg-error/10 border border-error/20 p-4 rounded-lg max-w-lg overflow-auto mx-auto mb-6 text-left whitespace-pre-wrap font-mono">
              {renderError}
            </pre>
          )}
          <div className="flex gap-3 justify-center">
            <button onClick={buildStrip}   className="px-5 py-2 rounded-lg bg-primary text-white font-medium text-sm">Try Again</button>
            <button onClick={handleRetake} className="px-5 py-2 rounded-lg border border-border text-foreground font-medium text-sm">Retake Photos</button>
          </div>
        </div>
      </div>
    );
  }

  // ── ready phase ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFF0F5 0%, #F3E5F5 100%)' }}>
      <PrimaryNavigation />

      <div className="pt-20 pb-8 px-4 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mb-2">
            <i className="bi bi-stars text-rose-500 text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Your Strip is Ready!</h1>
          <p className="text-muted-foreground text-sm mt-1 flex items-center justify-center gap-1.5 font-semibold">
            <i className={template?.iconClass || 'bi bi-film'}></i>
            <span>{template?.name}</span>
            <span className="text-gray-300">•</span>
            <span>{template?.photoCount} photos</span>
          </p>
        </div>

        {/* Strip preview */}
        <div className="flex justify-center mb-6">
          <div
            className="rounded-2xl overflow-hidden shadow-2xl border border-white/50 bg-white"
            style={{ maxWidth: '360px', maxHeight: '70vh' }}
          >
            {stripUrl ? (
              <img
                src={stripUrl}
                alt="Photobooth Strip"
                className="block w-full h-auto object-contain"
                style={{ maxHeight: '70vh' }}
              />
            ) : (
              <div className="w-64 h-96 flex items-center justify-center text-muted-foreground bg-muted animate-pulse">
                Preparing preview...
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white text-base shadow-xl transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #D4426B, #9C27B0)' }}
          >
            <i className="bi bi-download"></i>
            Download Strip
          </button>

          <button
            onClick={() => {
              if (isGuestUser) {
                handleGuestRedirect();
              } else {
                navigate('/photo-editing', { state: { photos, template, sessionId } });
              }
            }}
            className="flex items-center justify-center gap-3 py-3.5 rounded-2xl font-bold text-rose-500 text-base border-2 border-rose-300 hover:bg-rose-50/50 bg-white transition-all duration-150 shadow-sm cursor-pointer"
          >
            <i className="bi bi-sliders"></i>
            Edit Strip Options
          </button>

          {/* Gallery Auto-Save Status / Guest Prompt */}
          <div className="flex items-center justify-center gap-1.5 py-1 text-xs font-semibold">
            {isGuestUser ? (
              <span className="text-amber-600 flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                <i className="bi bi-info-circle-fill text-amber-500"></i>
                Guest mode: Log in to save to gallery &amp; download
              </span>
            ) : (
              <>
                {isSaving && (
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Saving strip to gallery...
                  </span>
                )}
                {isSaved && (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <i className="bi bi-cloud-check-fill text-emerald-500"></i>
                    Automatically saved to your gallery
                  </span>
                )}
              </>
            )}
          </div>

          {navigator.share && (
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-3 py-3.5 rounded-2xl font-semibold text-primary text-base border-2 border-primary/30 bg-white hover:bg-primary/5 transition-all duration-150"
            >
              <i className="bi bi-share-fill"></i>
              Share Strip
            </button>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleRetake}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border border-border bg-white text-foreground hover:bg-muted/40 transition-colors flex items-center justify-center gap-2"
            >
              <i className="bi bi-camera-fill text-rose-500"></i>
              Retake Photos
            </button>
            <button
              onClick={handleNewStrip}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border border-border bg-white text-foreground hover:bg-muted/40 transition-colors flex items-center justify-center gap-2"
            >
              <i className="bi bi-grid-fill text-rose-500"></i>
              New Strip
            </button>
          </div>

          <button
            onClick={() => {
              if (isGuestUser) {
                handleGuestRedirect();
              } else {
                navigate('/photo-gallery');
              }
            }}
            className="py-2.5 rounded-xl text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Gallery</span>
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StripCompositor;
