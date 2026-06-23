import React, { useState, useRef, useEffect } from 'react';
import { Camera, RotateCw, ZoomIn, ZoomOut, Check, X } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCrop: (croppedBase64: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCrop, onCancel }: ImageCropperProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // in degrees: 0, 90, 180, 270
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset states when source changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  }, [imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientX - offset.y };
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const x = e.clientX - dragStart.current.x;
    const y = e.clientY - dragStart.current.y;
    setOffset({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      dragStart.current = { x: touch.clientX - offset.x, y: touch.clientY - offset.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const x = touch.clientX - dragStart.current.x;
      const y = touch.clientY - dragStart.current.y;
      setOffset({ x, y });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const rotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  const cropImage = () => {
    if (!imgRef.current || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    const size = 400; // Perfect square crop
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);

    // Dynamic viewport cropping
    const imgWidth = imgRef.current.naturalWidth;
    const imgHeight = imgRef.current.naturalHeight;
    const containerWidth = 300; // Visual viewport width
    const containerHeight = 300; // Visual viewport height

    // Center of canvas
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Calculate aspect scale factor
    const scaleX = size / containerWidth;
    const scaleY = size / containerHeight;

    // Draw parameters
    const drawWidth = (imgWidth / imgHeight) >= 1 
      ? (containerHeight * (imgWidth / imgHeight)) * zoom * scaleX
      : containerWidth * zoom * scaleX;
    
    const drawHeight = (imgWidth / imgHeight) >= 1 
      ? containerHeight * zoom * scaleY
      : (containerWidth / (imgWidth / imgHeight)) * zoom * scaleY;

    const drawX = offset.x * scaleX - (drawWidth / 2);
    const drawY = offset.y * scaleY - (drawHeight / 2);

    ctx.drawImage(imgRef.current, drawX, drawY, drawWidth, drawHeight);

    // Generate low-weight base64
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
    onCrop(croppedDataUrl);
  };

  return (
    <div className="fixed inset-0 z-[10006] bg-black/95 flex flex-col items-center justify-center p-4 fade-in font-sans">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 flex flex-col items-center shadow-2xl relative">
        <h3 className="text-white mb-6 uppercase tracking-[0.2em] text-lg font-black flex items-center gap-2">
          <Camera className="w-5 h-5 text-yellow-500" />
          调整图片 Crop Image
        </h3>

        {/* Outer frame, shows the mask */}
        <div 
          ref={containerRef}
          className="w-[300px] h-[300px] border-2 border-zinc-700 bg-black/50 rounded-2xl overflow-hidden relative cursor-move flex items-center justify-center touch-none select-none shadow-inner"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Overlay mask for 1:1 square crop area helper */}
          <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-xl pointer-events-none z-10"></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-[280px] h-[280px] border border-dashed border-white/50 rounded-lg"></div>
          </div>

          <img
            ref={imgRef}
            src={imageSrc}
            alt="To Crop"
            draggable={false}
            className="pointer-events-none select-none max-w-none max-h-none"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              maxWidth: '85%',
              height: 'auto',
            }}
          />
        </div>

        {/* Crop tools panel */}
        <div className="w-full mt-6 space-y-4">
          {/* Zoom slider */}
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-zinc-500" />
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <ZoomIn className="w-4 h-4 text-zinc-500" />
          </div>

          {/* Controls bar */}
          <div className="flex justify-between items-center gap-3">
            <button
              onClick={rotate}
              className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all text-sm grow"
            >
              <RotateCw className="w-4 h-4 text-yellow-500" />
              旋转 Rotate
            </button>
            <div className="text-zinc-600 text-xs font-mono select-none px-2 uppercase font-black tracking-widest hidden sm:block">
              Scale: {zoom.toFixed(1)}x
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 py-4 bg-zinc-800 hover:bg-red-500/10 hover:text-red-500 text-zinc-400 rounded-2xl font-black text-sm uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              取消 Cancel
            </button>
            <button
              onClick={cropImage}
              className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20"
            >
              <Check className="w-4 h-4" />
              裁剪 Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
