import React, { useRef } from 'react';
import Image from '../../../components/AppImage';

// Rose SVG decoration
const RoseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="15" r="10" fill="#D4426B" />
    <circle cx="12" cy="12" r="6" fill="#FF758F" />
    <circle cx="18" cy="12" r="6" fill="#FF758F" />
    <circle cx="15" cy="17" r="6" fill="#FF758F" />
    <circle cx="15" cy="15" r="3" fill="#FFB3C1" />
  </svg>
);

const PhotoCanvas = ({ 
  photoUrl, 
  filters,
  rotation = 0,
  flipHorizontal = false,
  flipVertical = false,
  frameId = 'none'
}) => {
  const canvasRef = useRef(null);

  const getTransformStyle = () => {
    const transforms = [];
    
    if (rotation !== 0) {
      transforms.push(`rotate(${rotation}deg)`);
    }
    
    if (flipHorizontal) {
      transforms.push('scaleX(-1)');
    }
    
    if (flipVertical) {
      transforms.push('scaleY(-1)');
    }
    
    return transforms.length > 0 ? transforms.join(' ') : 'none';
  };

  const getCombinedFilter = () => {
    const filterParts = [];
    
    if (filters?.brightness !== 0) {
      filterParts.push(`brightness(${100 + filters?.brightness}%)`);
    }
    
    if (filters?.contrast !== 0) {
      filterParts.push(`contrast(${100 + filters?.contrast}%)`);
    }
    
    if (filters?.saturation !== 0) {
      filterParts.push(`saturate(${100 + filters?.saturation}%)`);
    }
    
    if (filters?.cssFilter && filters.cssFilter !== 'none') {
      filterParts.push(filters.cssFilter);
    }
    
    return filterParts.length > 0 ? filterParts.join(' ') : 'none';
  };

  return (
    <div className="relative w-full h-full bg-background/50 rounded-lg overflow-hidden flex items-center justify-center p-4">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCAyMCAwIEwgMjAgMjAgTCAwIDIwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 pointer-events-none" />
      
      {/* Sized photo container with fixed 3:4 aspect ratio to align frame overlays correctly */}
      <div className="relative max-h-full aspect-[3/4] h-full shadow-2xl rounded-lg overflow-hidden bg-muted">
        <Image
          ref={canvasRef}
          src={photoUrl}
          alt="Photo being edited"
          className="w-full h-full object-cover transition-smooth"
          style={{
            filter: getCombinedFilter(),
            transform: getTransformStyle()
          }}
        />

        {/* Frame Overlay on top of image */}
        {frameId === 'rose-gold' && (
          <div className="absolute inset-0 border-[4%] border-transparent pointer-events-none">
            {/* Rose Gold Double Border */}
            <div className="absolute inset-[2%] border-2 border-primary/40 rounded-sm">
              <div className="absolute inset-[3%] border border-secondary/50" />
            </div>
            {/* Corner Roses */}
            <RoseIcon className="absolute top-[1%] left-[1%] w-6 h-6 rotate-45" />
            <RoseIcon className="absolute top-[1%] right-[1%] w-6 h-6 -rotate-45" />
            <RoseIcon className="absolute bottom-[1%] left-[1%] w-6 h-6 -rotate-135" />
            <RoseIcon className="absolute bottom-[1%] right-[1%] w-6 h-6 rotate-135" />
          </div>
        )}

        {frameId === 'rose-vines' && (
          <div className="absolute inset-0 pointer-events-none flex justify-between px-[2%]">
            {/* Left Vine */}
            <div className="h-full w-4 flex flex-col justify-around items-center opacity-80">
              <div className="w-1 h-[90%] bg-success/40 rounded-full relative">
                <RoseIcon className="absolute top-[15%] -left-1.5 w-4 h-4" />
                <span className="absolute top-[35%] -left-1 w-2.5 h-2 bg-success/60 rounded-tl-full rounded-br-full rotate-45" />
                <RoseIcon className="absolute top-[55%] -left-1.5 w-4 h-4" />
                <span className="absolute top-[75%] -left-2 w-2.5 h-2 bg-success/60 rounded-tr-full rounded-bl-full -rotate-45" />
              </div>
            </div>
            {/* Right Vine */}
            <div className="h-full w-4 flex flex-col justify-around items-center opacity-80">
              <div className="w-1 h-[90%] bg-success/40 rounded-full relative">
                <span className="absolute top-[20%] -left-2 w-2.5 h-2 bg-success/60 rounded-tr-full rounded-bl-full -rotate-45" />
                <RoseIcon className="absolute top-[40%] -left-1.5 w-4 h-4" />
                <span className="absolute top-[60%] -left-1 w-2.5 h-2 bg-success/60 rounded-tl-full rounded-br-full rotate-45" />
                <RoseIcon className="absolute top-[80%] -left-1.5 w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {frameId === 'polaroid-rose' && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
            {/* White margins */}
            <div className="w-full bg-white h-[4%]" />
            <div className="flex-1 flex justify-between">
              <div className="bg-white w-[5%] h-full" />
              <div className="bg-white w-[5%] h-full" />
            </div>
            <div className="w-full bg-white h-[16%] flex items-center justify-between px-[6%] border-t border-primary/5">
              <div className="flex flex-col justify-center">
                <span className="font-heading font-bold italic text-sm text-foreground/80 leading-none">Rose Photobooth</span>
                <span className="text-[9px] text-muted-foreground mt-1">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="relative w-8 h-8 flex items-center justify-center">
                <RoseIcon className="w-6 h-6 absolute" />
                <RoseIcon className="w-4 h-4 absolute translate-x-2 translate-y-1 opacity-70" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoCanvas;