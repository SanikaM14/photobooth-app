import React from 'react';
import Icon from '../../../components/AppIcon';

const PhotoCounterDisplay = ({ currentCount, totalCount, capturedPhotos }) => {
  return (
    <div className="absolute top-6 left-6 z-75 pointer-events-none">
      <div className="bg-card/90 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-5 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Camera" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Photo Progress
            </p>
            <p className="text-lg md:text-xl font-heading font-bold text-foreground">
              {currentCount} / {totalCount}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          {Array.from({ length: totalCount })?.map((_, index) => (
            <div
              key={index}
              className={`
                w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center
                transition-smooth border-2
                ${index < capturedPhotos?.length
                  ? 'bg-success border-success'
                  : index === currentCount
                    ? 'bg-primary/20 border-primary animate-pulse' :'bg-muted border-border'
                }
              `}
            >
              {index < capturedPhotos?.length ? (
                <Icon name="Check" size={16} color="var(--color-success-foreground)" />
              ) : index === currentCount ? (
                <Icon name="Circle" size={12} color="var(--color-primary)" />
              ) : (
                <span className="text-xs md:text-sm text-muted-foreground font-medium">
                  {index + 1}
                </span>
              )}
            </div>
          ))}
        </div>

        {capturedPhotos?.length > 0 && capturedPhotos?.length < totalCount && (
          <p className="text-xs md:text-sm text-muted-foreground text-center">
            {totalCount - capturedPhotos?.length} more to go!
          </p>
        )}

        {capturedPhotos?.length === totalCount && (
          <div className="flex items-center justify-center space-x-2 text-success">
            <Icon name="CheckCircle2" size={16} />
            <p className="text-xs md:text-sm font-medium">
              All photos captured!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoCounterDisplay;