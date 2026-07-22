import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const CameraControlsOverlay = ({ 
  onCapture, 
  onFlashToggle, 
  onFlashlightToggle,
  isFlashEnabled = false,
  isFlashlightEnabled = false,
  isCameraReady = false
}) => {
  const [flash, setFlash] = useState(isFlashEnabled);
  const [flashlight, setFlashlight] = useState(isFlashlightEnabled);
  const [captureAnimation, setCaptureAnimation] = useState(false);

  useEffect(() => {
    setFlash(isFlashEnabled);
  }, [isFlashEnabled]);

  useEffect(() => {
    setFlashlight(isFlashlightEnabled);
  }, [isFlashlightEnabled]);

  const handleFlashToggle = () => {
    const newFlashState = !flash;
    setFlash(newFlashState);
    if (onFlashToggle) {
      onFlashToggle(newFlashState);
    }
  };

  const handleFlashlightToggle = () => {
    const newFlashlightState = !flashlight;
    setFlashlight(newFlashlightState);
    if (onFlashlightToggle) {
      onFlashlightToggle(newFlashlightState);
    }
  };

  const handleCapture = () => {
    if (!isCameraReady) return;
    
    setCaptureAnimation(true);
    
    if (onCapture) {
      onCapture();
    }

    setTimeout(() => {
      setCaptureAnimation(false);
    }, 300);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-75">
      {captureAnimation && (
        <div className="absolute inset-0 bg-white animate-pulse pointer-events-none" />
      )}

      <div className="absolute top-6 right-6 flex flex-col space-y-3 pointer-events-auto">
        <button
          onClick={handleFlashToggle}
          disabled={!isCameraReady}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center
            transition-smooth shadow-lg
            ${flash
              ? 'bg-primary text-primary-foreground'
              : 'bg-card/90 text-foreground hover:bg-card'
            }
            ${!isCameraReady && 'opacity-50 cursor-not-allowed'}
          `}
          title={flash ? 'Flash On' : 'Flash Off'}
        >
          <Icon name={flash ? 'Zap' : 'ZapOff'} size={20} />
        </button>

        <button
          onClick={handleFlashlightToggle}
          disabled={!isCameraReady}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center
            transition-smooth shadow-lg
            ${flashlight
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-card/90 text-foreground hover:bg-card'
            }
            ${!isCameraReady && 'opacity-50 cursor-not-allowed'}
          `}
          title={flashlight ? 'Flashlight On' : 'Flashlight Off'}
        >
          <Icon name={flashlight ? 'Flashlight' : 'FlashlightOff'} size={20} />
        </button>
      </div>

      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <button
          onClick={handleCapture}
          disabled={!isCameraReady}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center
            transition-spring shadow-2xl
            ${isCameraReady
              ? 'bg-primary hover:bg-primary/90 hover:scale-110 active:scale-95' :'bg-muted cursor-not-allowed'
            }
          `}
          title="Capture Photo"
        >
          <div className="w-16 h-16 rounded-full border-4 border-primary-foreground flex items-center justify-center">
            <Icon 
              name="Camera" 
              size={32} 
              color={isCameraReady ? 'var(--color-primary-foreground)' : 'var(--color-muted-foreground)'} 
            />
          </div>
        </button>
      </div>

      <div className="absolute bottom-12 left-6 pointer-events-auto">
        <div className="flex flex-col space-y-2">
          <div className={`
            px-3 py-2 rounded-lg bg-card/90 text-foreground
            text-sm font-medium shadow-md
            ${!isCameraReady && 'opacity-50'}
          `}>
            <div className="flex items-center space-x-2">
              <div className={`
                w-2 h-2 rounded-full
                ${isCameraReady ? 'bg-success animate-pulse' : 'bg-error'}
              `} />
              <span>{isCameraReady ? 'Ready' : 'Initializing...'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 right-6 pointer-events-auto">
        <Button
          variant="outline"
          size="sm"
          iconName="Settings"
          className="bg-card/90 hover:bg-card shadow-md"
        >
          Settings
        </Button>
      </div>
    </div>
  );
};

export default CameraControlsOverlay;