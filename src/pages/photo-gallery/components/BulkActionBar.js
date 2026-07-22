import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionBar = ({ 
  selectedCount, 
  onDownloadAll, 
  onShareAll, 
  onDeleteAll, 
  onClearSelection 
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card border border-border rounded-lg shadow-2xl px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-primary/10 rounded-lg">
            <Icon name="CheckSquare" size={18} color="var(--color-primary)" />
            <span className="text-sm font-medium text-primary">
              {selectedCount} selected
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              iconName="Download"
              onClick={onDownloadAll}
            >
              Download
            </Button>
            <Button
              variant="secondary"
              size="sm"
              iconName="Share2"
              onClick={onShareAll}
            >
              Share
            </Button>
            <Button
              variant="destructive"
              size="sm"
              iconName="Trash2"
              onClick={onDeleteAll}
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClearSelection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;