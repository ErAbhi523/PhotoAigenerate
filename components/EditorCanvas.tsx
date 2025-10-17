
import React from 'react';
import type { ImageData } from '../types';

interface EditorCanvasProps {
  originalImage: ImageData | null;
  editedImage: ImageData | null;
  onReset: () => void;
  onNewImage: () => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ originalImage, editedImage, onReset, onNewImage }) => {
  const displayImage = editedImage || originalImage;

  if (!displayImage) return null;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-full max-w-4xl p-2 bg-base-200 rounded-lg shadow-lg">
        <img
          src={displayImage.dataUrl}
          alt="Editable content"
          className="w-full h-auto max-h-[70vh] object-contain rounded"
        />
      </div>
      <div className="flex flex-wrap gap-2 md:gap-4">
        {editedImage && (
          <button onClick={onReset} className="px-4 py-2 bg-base-300 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
            Revert
          </button>
        )}
        <a 
          href={displayImage.dataUrl} 
          download="edited-image.png" 
          className="px-4 py-2 bg-brand-primary hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors inline-block text-center">
          Download Image
        </a>
        <button onClick={onNewImage} className="px-4 py-2 bg-brand-secondary hover:bg-purple-800 text-white font-semibold rounded-lg transition-colors">
          Upload New Image
        </button>
      </div>
    </div>
  );
};

export default EditorCanvas;
