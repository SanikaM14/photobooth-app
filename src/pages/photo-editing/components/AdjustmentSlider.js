import React from 'react';
import Icon from '../../../components/AppIcon';

const AdjustmentSlider = ({ 
  label, 
  icon, 
  value, 
  onChange, 
  min = -100, 
  max = 100, 
  step = 1,
  unit = '',
  disabled = false 
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center space-x-2">
          <Icon name={icon} size={18} />
          <span>{label}</span>
        </label>
        <span className="text-sm font-medium text-primary data-text">
          {value > 0 ? '+' : ''}{value}{unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e?.target?.value))}
          disabled={disabled}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, var(--color-muted) ${percentage}%, var(--color-muted) 100%)`
          }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-md pointer-events-none transition-smooth"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  );
};

export default AdjustmentSlider;