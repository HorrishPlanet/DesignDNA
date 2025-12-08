import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageUpload } from '../types';

interface ImageUploaderProps {
  onImageSelected: (image: ImageUpload | null) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get raw base64 (e.g. "data:image/jpeg;base64,")
      const base64Data = result.split(',')[1];
      
      setPreview(result);
      onImageSelected({
        base64: base64Data,
        mimeType: file.type,
        previewUrl: result
      });
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const onDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelected(null);
  };

  if (preview) {
    return (
      <div className="relative w-full max-w-lg mx-auto mt-6 group">
        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800">
          <img 
            src={preview} 
            alt="Upload preview" 
            className="w-full h-auto max-h-96 object-contain bg-black/20"
          />
          {!isLoading && (
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-all backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {isLoading && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sky-100 font-medium animate-pulse">Analyzing Design...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div
        className={`relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out
          ${dragActive 
            ? "border-sky-500 bg-sky-500/10 scale-[1.02]" 
            : "border-slate-600 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50"
          }
        `}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleChange}
          accept="image/*"
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4 text-center px-4 pointer-events-none">
          <div className={`p-4 rounded-full transition-colors ${dragActive ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300'}`}>
             {dragActive ? <ImageIcon className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
          </div>
          <div className="space-y-1">
            <p className="text-lg font-medium text-slate-200">
              {dragActive ? "Drop image to analyze" : "Click or drag image to analyze"}
            </p>
            <p className="text-sm text-slate-400">
              Supports UI screens, posters, illustrations (JPG, PNG, WEBP)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
