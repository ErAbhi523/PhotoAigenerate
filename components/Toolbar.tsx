
import React from 'react';
import { EditOperation } from '../types';
import { AddObjectIcon, ColorizeIcon, EnhanceIcon, RemoveBgIcon, RemoveObjectIcon, ReplaceBgIcon } from './icons/Icons';

interface ToolbarProps {
  activeTool: EditOperation | null;
  onSelectTool: (tool: EditOperation) => void;
}

const tools = [
  { id: EditOperation.RemoveBackground, label: 'Remove BG', icon: <RemoveBgIcon /> },
  { id: EditOperation.ReplaceBackground, label: 'Replace BG', icon: <ReplaceBgIcon /> },
  { id: EditOperation.Enhance, label: 'Enhance', icon: <EnhanceIcon /> },
  { id: EditOperation.Colorize, label: 'Colorize', icon: <ColorizeIcon /> },
  { id: EditOperation.AddObject, label: 'Add Object', icon: <AddObjectIcon /> },
  { id: EditOperation.RemoveObject, label: 'Remove Object', icon: <RemoveObjectIcon /> },
];

const ToolButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-brand-primary text-white' : 'bg-base-200 hover:bg-base-300 text-gray-300'}`}
  >
    <span className="w-6 h-6 mr-3">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

const Toolbar: React.FC<ToolbarProps> = ({ activeTool, onSelectTool }) => {
  return (
    <div className="p-4 bg-base-200 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-200">Tools</h3>
      <div className="flex flex-col gap-2">
        {tools.map((tool) => (
          <ToolButton
            key={tool.id}
            label={tool.label}
            icon={tool.icon}
            isActive={activeTool === tool.id}
            onClick={() => onSelectTool(tool.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
