import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PhotoCard = ({ 
  photo, 
  isSelected, 
  onSelect, 
  onDownload, 
  onShare, 
  onDelete,
  onReEdit 
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getFilterBadgeColor = (filterType) => {
    const colors = {
      'red-dreamy': 'bg-error/20 text-error',
      'yellow-aesthetic': 'bg-warning/20 text-warning',
      'retro': 'bg-secondary/20 text-secondary',
      'black-white': 'bg-foreground/20 text-foreground',
      'clear': 'bg-success/20 text-success',
      'vintage': 'bg-accent/20 text-accent',
      'sepia': 'bg-warning/30 text-warning',
      'cool-tone': 'bg-primary/20 text-primary',
      'warm-tone': 'bg-secondary/30 text-secondary',
      'high-contrast': 'bg-foreground/30 text-foreground'
    };
    return colors?.[filterType] || 'bg-muted text-muted-foreground';
  };

  return (
    <div 
      className="group relative bg-card rounded-lg border border-border overflow-hidden transition-smooth hover:shadow-lg"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={photo?.image}
          alt={photo?.imageAlt}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <button
            onClick={() => onSelect(photo?.id)}
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center
              transition-smooth shadow-md
              ${isSelected 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card/90 text-foreground hover:bg-card'
              }
            `}
          >
            {isSelected ? (
              <Icon name="Check" size={18} />
            ) : (
              <Icon name="Square" size={18} />
            )}
          </button>

          <span className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${getFilterBadgeColor(photo?.filterType)}
          `}>
            {photo?.filterName}
          </span>
        </div>

        {(showActions || isSelected) && (
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent flex items-end justify-center p-4 md:p-6">
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                iconName="Download"
                onClick={() => onDownload(photo?.id)}
                className="shadow-lg"
              />
              <Button
                variant="secondary"
                size="sm"
                iconName="Share2"
                onClick={() => onShare(photo?.id)}
                className="shadow-lg"
              />
              <Button
                variant="secondary"
                size="sm"
                iconName="Wand2"
                onClick={() => onReEdit(photo?.id)}
                className="shadow-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                onClick={() => onDelete(photo?.id)}
                className="shadow-lg"
              />
            </div>
          </div>
        )}
      </div>
      <div className="p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground">
            <Icon name="Calendar" size={14} />
            <span>{formatDate(photo?.captureDate)}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>{photo?.captureTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;