import React from 'react';
import Button from '../../../components/ui/Button';


const EditingToolbar = ({ 
  onUndo, 
  onRedo, 
  onReset, 
  canUndo, 
  canRedo,
  onRotateLeft,
  onRotateRight,
  onFlipHorizontal,
  onFlipVertical,
  isProcessing 
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          iconName="Undo2"
          onClick={onUndo}
          disabled={!canUndo || isProcessing}
          title="Undo last change"
        />
        <Button
          variant="outline"
          size="sm"
          iconName="Redo2"
          onClick={onRedo}
          disabled={!canRedo || isProcessing}
          title="Redo last change"
        />
      </div>

      <div className="w-px h-8 bg-border hidden md:block" />

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          iconName="RotateCcw"
          onClick={onRotateLeft}
          disabled={isProcessing}
          title="Rotate left 90°"
        />
        <Button
          variant="outline"
          size="sm"
          iconName="RotateCw"
          onClick={onRotateRight}
          disabled={isProcessing}
          title="Rotate right 90°"
        />
      </div>

      <div className="w-px h-8 bg-border hidden md:block" />

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          iconName="FlipHorizontal"
          onClick={onFlipHorizontal}
          disabled={isProcessing}
          title="Flip horizontal"
        />
        <Button
          variant="outline"
          size="sm"
          iconName="FlipVertical"
          onClick={onFlipVertical}
          disabled={isProcessing}
          title="Flip vertical"
        />
      </div>

      <div className="w-px h-8 bg-border hidden md:block" />

      <Button
        variant="ghost"
        size="sm"
        iconName="RotateCcw"
        iconPosition="left"
        onClick={onReset}
        disabled={isProcessing}
      >
        Reset All
      </Button>
    </div>
  );
};

export default EditingToolbar;