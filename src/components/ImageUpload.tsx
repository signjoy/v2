import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  currentImage?: string;
  onImageRemove?: () => void;
  label: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  currentImage,
  onImageRemove,
  label,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    try {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        console.error('Invalid file type:', file.type);
        return;
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        console.error('File too large:', file.size);
        return;
      }
      
      console.log('Processing image file:', file.name, 'Size:', file.size);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('Setting preview:', result ? 'Success' : 'Failed');
        setPreview(result);
      };
      reader.onerror = () => {
        console.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    } catch (error) {
      console.error('Error handling file:', error);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <label className="block text-white text-sm font-medium mb-2">
        {label}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg transition-all duration-300 ${
          dragActive
            ? 'border-blue-400 bg-blue-400/10'
            : 'border-white/30 hover:border-white/50'
        } ${preview ? 'p-2' : 'p-6'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => {
                console.error('Image preview failed to load:', preview);
                setPreview(null);
              }}
              onLoad={() => console.log('Image preview loaded successfully')}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            className="text-center cursor-pointer"
            onClick={openFileDialog}
          >
            <ImageIcon className="mx-auto text-white/60 mb-2" size={32} />
            <p className="text-white/70 text-sm mb-1">
              Drag and drop an image here, or click to select
            </p>
            <p className="text-white/50 text-xs">
              Supports: JPEG, PNG, WebP (Max: 5MB)
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageUpload;