import React from 'react';
import Icon from '../../../components/AppIcon';

const CameraFeedDisplay = ({ 
  videoRef,     // <-- accept ref from parent as a normal prop
  stream, 
  isLoading, 
  error, 
  onVideoReady,
  flashActive 
}) => {

  React.useEffect(() => {
    if (videoRef?.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef?.current?.play()?.then(() => {
          if (onVideoReady) onVideoReady();
        })?.catch(err => {
          console.error("Error playing video:", err);
        });
      };
    }
  }, [stream, videoRef, onVideoReady]);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-6 md:p-8 max-w-md">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="AlertCircle" size={32} color="var(--color-error)" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
              Camera Error
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Icon name="Camera" size={32} color="var(--color-primary)" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
              Initializing Camera
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Please wait while we prepare your camera...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* The video element — rendered by parent's videoRef */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {flashActive && (
        <div className="absolute inset-0 bg-white animate-pulse pointer-events-none z-50" />
      )}

      {/* Corner guides */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-16 h-16 md:w-20 md:h-20 border-t-4 border-l-4 border-primary/50 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 border-t-4 border-r-4 border-primary/50 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 md:w-20 md:h-20 border-b-4 border-l-4 border-primary/50 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 md:w-20 md:h-20 border-b-4 border-r-4 border-primary/50 rounded-br-xl" />
      </div>
    </>
  );
};

export default CameraFeedDisplay;