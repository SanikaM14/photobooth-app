import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import PhotoCard from './PhotoCard';

const SessionGroup = ({ 
  session, 
  onPhotoSelect, 
  selectedPhotos, 
  onDownload, 
  onShare, 
  onDelete,
  onReEdit 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden transition-smooth">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 md:px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-smooth"
      >
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Camera" size={20} color="var(--color-primary)" />
          </div>
          <div className="text-left">
            <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
              {session?.name}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              {formatDate(session?.date)} • {session?.photos?.length} {session?.photos?.length === 1 ? 'photo' : 'photos'}
            </p>
          </div>
        </div>

        <Icon 
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
          color="var(--color-muted-foreground)" 
        />
      </button>
      {isExpanded && (
        <div className="px-4 md:px-6 pb-4 md:pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {session?.photos?.map((photo) => (
              <PhotoCard
                key={photo?.id}
                photo={photo}
                isSelected={selectedPhotos?.includes(photo?.id)}
                onSelect={onPhotoSelect}
                onDownload={onDownload}
                onShare={onShare}
                onDelete={onDelete}
                onReEdit={onReEdit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionGroup;