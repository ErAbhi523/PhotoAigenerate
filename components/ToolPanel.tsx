import React, { useState, useEffect } from 'react';
import { EditOperation } from '../types';

interface ToolPanelProps {
  activeTool: EditOperation | null;
  onApply: (prompt: string) => void;
  isLoading: boolean;
}

// FIX: Define a discriminated union for tool configurations to help TypeScript with type narrowing.
interface BaseToolConfig {
  title: string;
  description: string;
}

interface PromptToolConfig extends BaseToolConfig {
  needsInput: false;
  prompt: string;
}

interface InputToolConfig extends BaseToolConfig {
  needsInput: true;
  promptPrefix: string;
  promptSuffix?: string;
  placeholder: string;
}

type ToolConfig = PromptToolConfig | InputToolConfig;

const toolConfigs: { [key in EditOperation]: ToolConfig } = {
  [EditOperation.RemoveBackground]: {
    title: 'Remove Background',
    description: 'This tool will automatically remove the background and make it transparent.',
    prompt: 'Remove the background. Make the background transparent.',
    needsInput: false,
  },
  [EditOperation.ReplaceBackground]: {
    title: 'Replace Background',
    description: 'Describe the new background you want to generate.',
    promptPrefix: 'Replace the background with: ',
    needsInput: true,
    placeholder: 'e.g., a sunny beach with palm trees',
  },
  [EditOperation.Colorize]: {
    title: 'Colorize Image',
    description: 'Automatically colorize a black and white photo with realistic colors.',
    prompt: 'Colorize this black and white photo with realistic, vibrant colors.',
    needsInput: false,
  },
  [EditOperation.Enhance]: {
    title: 'Enhance Photo',
    description: 'Improve lighting, colors, and sharpness automatically.',
    prompt: 'Enhance this photo. Improve lighting, colors, and sharpness. Make the subjects look their best without looking artificial.',
    needsInput: false,
  },
  [EditOperation.AddObject]: {
    title: 'Add an Object',
    description: 'Describe the object you want to add to the image.',
    promptPrefix: 'Add ',
    promptSuffix: ' into the scene naturally. Make sure the lighting and shadows match.',
    needsInput: true,
    placeholder: 'e.g., a small red bird on the branch',
  },
  [EditOperation.RemoveObject]: {
    title: 'Remove an Object',
    description: 'Describe the object you want to remove from the image.',
    promptPrefix: 'Remove the ',
    promptSuffix: ' from this image and realistically fill in the space behind it.',
    needsInput: true,
    placeholder: 'e.g., the person on the left',
  },
};

const ToolPanel: React.FC<ToolPanelProps> = ({ activeTool, onApply, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue('');
  }, [activeTool]);

  if (!activeTool) {
    return (
      <div className="p-4 bg-base-200 rounded-lg shadow-lg text-center text-gray-400">
        <p>Select a tool to start editing.</p>
      </div>
    );
  }

  const config = toolConfigs[activeTool];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    let finalPrompt = '';
    if (config.needsInput) {
      if (!inputValue.trim()) return;
      finalPrompt = `${config.promptPrefix}${inputValue}${config.promptSuffix || ''}`;
    } else {
      finalPrompt = config.prompt;
    }
    onApply(finalPrompt);
  };

  return (
    <div className="p-4 bg-base-200 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2 text-gray-200">{config.title}</h3>
      <p className="text-sm text-gray-400 mb-4">{config.description}</p>
      <form onSubmit={handleSubmit}>
        {config.needsInput && (
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={config.placeholder}
            rows={3}
            className="w-full p-2 mb-4 bg-base-300 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none text-white transition"
            disabled={isLoading}
          />
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-brand-primary hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={isLoading || (config.needsInput && !inputValue.trim())}
        >
          {isLoading ? 'Applying...' : 'Apply'}
        </button>
      </form>
    </div>
  );
};

export default ToolPanel;