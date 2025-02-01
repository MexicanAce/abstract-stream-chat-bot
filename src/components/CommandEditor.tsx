import React, { useState } from 'react';
import { Command } from '../types';

interface CommandEditorProps {
  commands: Command[];
  onAddCommand: (command: Command) => void;
  onEditCommand: (index: number, command: Command) => void;
  onDeleteCommand: (index: number) => void;
  onResetCommands: () => void;
}

export function CommandEditor({
  commands,
  onAddCommand,
  onEditCommand,
  onDeleteCommand,
  onResetCommands,
}: CommandEditorProps) {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [trigger, setTrigger] = useState('');
  const [responseText, setResponseText] = useState('');
  const [description, setDescription] = useState('');
  const [isJavaScript, setIsJavaScript] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTrigger('');
    setResponseText('');
    setDescription('');
    setIsJavaScript(false);
    setError(null);
    setEditIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!trigger || !responseText || !description) {
      setError('All fields are required');
      return;
    }

    const existingIndex = commands.findIndex(
      (cmd, i) => cmd.trigger === trigger && i !== editIndex
    );
    if (existingIndex !== -1) {
      setError('A command with this trigger already exists');
      return;
    }

    let response;
    if (isJavaScript) {
      try {
        // Test if the JavaScript is valid
        response = new Function(responseText);
        response(); // Test execution
      } catch (err) {
        console.error('Invalid JS code');
        setError('Invalid JavaScript code');
        return;
      }
    } else {
      response = () => responseText;
    }

    const command: Command = {
      trigger,
      response,
      description,
      isJavaScript,
    };

    if (editIndex !== null) {
      onEditCommand(editIndex, command);
    } else {
      onAddCommand(command);
    }

    resetForm();
  };

  const handleEdit = (index: number) => {
    const command = commands[index];
    setTrigger(command.trigger);
    setIsJavaScript(command.isJavaScript == true);
    setResponseText(
      command.isJavaScript
        ? command.response
            .toString()
            .replace('function anonymous(\n) {\n', '')
            .slice(0, -2)
        : command.response
    );
    setDescription(command.description);
    setEditIndex(index);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Commands</h2>
        <button
          onClick={onResetCommands}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
        >
          Reset to Default Commands
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trigger
          </label>
          <input
            type="text"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            className="w-full rounded border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            placeholder="e.g., !hello"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Response
          </label>
          <div className="space-y-2">
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="w-full rounded border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 font-mono"
              rows={3}
              placeholder={
                isJavaScript
                  ? 'e.g., () => new Date().toLocaleTimeString()'
                  : 'e.g., Hello, world!'
              }
            />
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isJavaScript}
                onChange={(e) => setIsJavaScript(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-600">
                JavaScript Response
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            placeholder="e.g., Responds with a greeting"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            {editIndex !== null ? 'Update Command' : 'Add Command'}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {commands.map((command, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <div>
              <div className="font-semibold">{command.trigger}</div>
              <div className="text-sm text-gray-600">{command.description}</div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(index)}
                className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteCommand(index)}
                className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
