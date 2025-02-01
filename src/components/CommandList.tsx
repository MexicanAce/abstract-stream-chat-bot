import React from 'react';
import { Command } from '../types';

interface CommandListProps {
  commands: Command[];
  selectedCommand: Command | null;
  onSelectCommand: (command: Command) => void;
}

export function CommandList({ commands, selectedCommand, onSelectCommand }: CommandListProps) {
  return (
    <div className="pt-6">
      <h2 className="text-xl font-bold mb-4">Available Commands</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {commands.map((cmd) => (
          <button
            key={cmd.trigger}
            onClick={() => onSelectCommand(cmd)}
            className="text-left p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
          >
            <div className="font-semibold">{cmd.trigger}</div>
            <div className="text-sm text-gray-600">{cmd.description}</div>
          </button>
        ))}
      </div>
      {selectedCommand && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <div className="font-semibold">Response to "{selectedCommand.trigger}":</div>
          <div className="mt-2 text-blue-800">{selectedCommand.response()}</div>
        </div>
      )}
    </div>
  );
}