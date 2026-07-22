import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const FilterThumbnail = ({ 
  filter, 
  isActive, 
  onClick, 
  photoUrl 
}) => {
  return (
    <button
      onClick={() => onClick(filter?.id)}
      className={`
        relative aspect-square rounded-lg overflow-hidden
        transition-smooth border-2 group
        ${isActive
          ? 'border-primary shadow-lg scale-105'
          : 'border-border hover:border-primary/50 hover:scale-102'
        }
      `}
    >
      <div className="absolute inset-0">
        <Image
          src={photoUrl}
          alt={`${filter?.name} filter preview showing photo with ${filter?.description}`}
          className="w-full h-full object-cover"
          style={{ filter: filter?.cssFilter }}
        />
      </div>
      <div className={`
        absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent
        transition-smooth
        ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
      `}>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-xs font-medium text-foreground text-center">
            {filter?.name}
          </p>
        </div>
      </div>
      {isActive && (
        <div className="absolute top-2 right-2 z-10">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
            <Icon name="Check" size={14} color="var(--color-primary-foreground)" />
          </div>
        </div>
      )}
      {filter?.isPremium && (
        <div className="absolute top-2 left-2 z-10">
          <div className="px-2 py-1 bg-secondary rounded-md flex items-center space-x-1">
            <Icon name="Crown" size={12} color="var(--color-secondary-foreground)" />
            <span className="text-xs font-medium text-secondary-foreground">Pro</span>
          </div>
        </div>
      )}
    </button>
  );
};

export default FilterThumbnail;