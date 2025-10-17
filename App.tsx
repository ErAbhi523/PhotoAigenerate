
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import EditorCanvas from './components/EditorCanvas';
import Toolbar from './components/Toolbar';
import ToolPanel from './components/ToolPanel';
import Spinner from './components/Spinner';
import { editImageWithGemini } from './services/geminiService';
import type { EditOperation, ImageData } from './types';
import { Modality } from "@google/genai";

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [editedImage, setEditedImage] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<EditOperation | null>(null);

  const handleImageUpload = (imageData: ImageData) => {
    setOriginalImage(imageData);
    setEditedImage(null);
    setError(null);
    setActiveTool(null);
  };

  const handleApplyEdit = useCallback(async (prompt: string) => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const currentImage = editedImage || originalImage;
      const result = await editImageWithGemini({
        imageData: currentImage,
        prompt: prompt,
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        }
      });
      setEditedImage(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, editedImage]);
  
  const handleReset = () => {
    setEditedImage(null);
    setError(null);
    setActiveTool(null);
  }

  const handleNewImage = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setError(null);
    setActiveTool(null);
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col md:flex-row items-start justify-center p-4 md:p-8 gap-8">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <>
            <div className="w-full md:w-1/4 lg:w-1/5 flex flex-col gap-4">
              <Toolbar activeTool={activeTool} onSelectTool={setActiveTool} />
              <ToolPanel activeTool={activeTool} onApply={handleApplyEdit} isLoading={isLoading} />
            </div>
            <div className="w-full md:w-3/4 lg:w-4/5 relative flex-1 flex items-center justify-center">
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-20 rounded-lg">
                  <Spinner />
                  <p className="mt-4 text-lg">AI is thinking...</p>
                </div>
              )}
              {error && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white p-3 rounded-lg shadow-lg z-30">
                  <p>{error}</p>
                </div>
              )}
              <EditorCanvas
                originalImage={originalImage}
                editedImage={editedImage}
                onReset={handleReset}
                onNewImage={handleNewImage}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
