import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyGallery = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-24 px-4">
      <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6 md:mb-8">
        <Icon name="Images" size={48} color="var(--color-primary)" className="md:w-16 md:h-16" />
      </div>

      <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground mb-3 md:mb-4 text-center">
        No Photos Yet
      </h2>

      <p className="text-sm md:text-base text-muted-foreground text-center max-w-md mb-6 md:mb-8">
        Start capturing beautiful moments with our rose-themed photobooth. Your photos will appear here once you download them.
      </p>

      <Button
        variant="default"
        size="lg"
        iconName="Camera"
        iconPosition="left"
        onClick={() => navigate('/camera-capture')}
      >
        Start Taking Photos
      </Button>
    </div>
  );
};

export default EmptyGallery;