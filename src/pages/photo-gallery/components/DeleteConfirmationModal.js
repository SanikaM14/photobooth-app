import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  photoCount = 1 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-card rounded-lg shadow-2xl max-w-md w-full p-6 md:p-8">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-error/20 rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={32} color="var(--color-error)" className="md:w-10 md:h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
              Delete {photoCount > 1 ? 'Photos' : 'Photo'}?
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Are you sure you want to delete {photoCount > 1 ? `these ${photoCount} photos` : 'this photo'}? This action cannot be undone.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4 w-full">
            <Button
              variant="outline"
              size="lg"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="lg"
              iconName="Trash2"
              iconPosition="left"
              onClick={onConfirm}
              fullWidth
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;