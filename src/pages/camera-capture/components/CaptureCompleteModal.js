import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CaptureCompleteModal = ({ isOpen, capturedPhotos, onRetake, onProceed }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleProceed = () => {
    if (onProceed) {
      onProceed();
    }
    navigate('/photo-preview', { state: { photos: capturedPhotos } });
  };

  return (
    <div className="fixed inset-0 z-1500 flex items-center justify-center p-4 md:p-6">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onRetake}
      />
      <div className="relative bg-card rounded-xl shadow-2xl max-w-2xl w-full p-6 md:p-8 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-success/10 rounded-full flex items-center justify-center">
            <Icon name="CheckCircle2" size={32} color="var(--color-success)" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
              All Photos Captured!
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              You've successfully captured {capturedPhotos?.length} beautiful photos. Ready to preview and edit?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {capturedPhotos?.map((photo, index) => (
            <div 
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden bg-muted border-2 border-border hover:border-primary transition-smooth"
            >
              <Image
                src={photo?.url}
                alt={`Captured photo ${index + 1} showing user in rose-themed photobooth setting`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center shadow-md">
                <Icon name="Check" size={14} color="var(--color-success-foreground)" />
              </div>
              <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1">
                <span className="text-xs font-medium text-foreground">
                  Photo {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <Button
            variant="outline"
            size="lg"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={onRetake}
            fullWidth
          >
            Retake All
          </Button>
          <Button
            variant="default"
            size="lg"
            iconName="ArrowRight"
            iconPosition="right"
            onClick={handleProceed}
            fullWidth
          >
            Preview &amp; Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaptureCompleteModal;