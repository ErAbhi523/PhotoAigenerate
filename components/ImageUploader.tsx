
import React, { useState, useCallback } from 'react';
import type { ImageData } from '../types';

interface ImageUploaderProps {
  onImageUpload: (imageData: ImageData) => void;
}

const fileToImageData = (file: File): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
        const base64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
        resolve({ dataUrl, mimeType, base64 });
      } else {
        reject(new Error('Failed to read file.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (files: FileList | null) => {
    setError(null);
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
      }
      try {
        const imageData = await fileToImageData(file);
        onImageUpload(imageData);
      } catch (err) {
        setError('Could not process the image file.');
        console.error(err);
      }
    }
  }, [onImageUpload]);

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-8 bg-base-200 rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Upload Your Photo</h2>
      <p className="text-gray-400 mb-8 text-center">Drag & drop an image or click to select a file.</p>
      <label
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 ${dragging ? 'border-brand-primary bg-base-300' : 'border-base-300 hover:border-brand-secondary'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <span className="text-gray-400">{dragging ? 'Drop it here!' : 'Click to upload or drag and drop'}</span>
        <input
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={(e) => handleFileChange(e.target.files)}
        />
      </label>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUploader;
