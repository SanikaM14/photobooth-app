import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CameraPermissionModal = ({ isOpen, onRequestPermission, onCancel, permissionDenied }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1500 flex items-center justify-center p-4 md:p-6">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-card rounded-xl shadow-2xl max-w-md w-full p-6 md:p-8 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon 
              name={permissionDenied ? "AlertCircle" : "Camera"} 
              size={32} 
              color={permissionDenied ? "var(--color-error)" : "var(--color-primary)"} 
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
              {permissionDenied ? "Camera Access Denied" : "Camera Permission Required"}
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              {permissionDenied 
                ? "We need camera access to capture your beautiful photos. Please enable camera permissions in your browser settings and refresh the page."
                : "Rose Photobooth needs access to your camera to capture stunning photos with our aesthetic filters."
              }
            </p>
          </div>
        </div>

        {!permissionDenied && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-start space-x-3">
              <Icon name="Shield" size={20} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                Your privacy is protected. Photos are only saved when you choose to download them.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <Icon name="Lock" size={20} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                Camera access is used only during your session and can be revoked anytime.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3">
          {permissionDenied ? (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={onCancel}
                fullWidth
              >
                Go Back
              </Button>
              <Button
                variant="default"
                size="lg"
                iconName="Settings"
                iconPosition="left"
                onClick={() => window.location?.reload()}
                fullWidth
              >
                Refresh Page
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={onCancel}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="lg"
                iconName="Camera"
                iconPosition="left"
                onClick={onRequestPermission}
                fullWidth
              >
                Allow Camera
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraPermissionModal;