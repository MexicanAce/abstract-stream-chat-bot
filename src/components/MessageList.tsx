import React from 'react';
import { ChatMessage, Command } from '../types';

interface MessageListProps {
  messages: ChatMessage[];
  commands: Command[];
}

const BADGE_COLORS = [
  { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
  { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
  { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100' },
  { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100' },
  { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
];

export function MessageList({ messages, commands }: MessageListProps) {
  // Create a map of command triggers to their color indices
  const commandColors = commands.reduce((acc, cmd, index) => {
    acc[cmd.trigger] = BADGE_COLORS[index % BADGE_COLORS.length];
    return acc;
  }, {} as Record<string, typeof BADGE_COLORS[0]>);

  return (
    <div className="pt-6">
      <h2 className="text-xl font-bold mb-4">Recent Messages</h2>
      <div className="h-96 overflow-y-auto border rounded p-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2 p-2 bg-gray-50 rounded flex items-start gap-2">
            <div className="text-sm text-gray-500">
              [{msg.timestamp.toLocaleTimeString()}]
            </div>
            <div className="font-semibold">{msg.user}:</div>
            <div className="flex-grow">{msg.text}</div>
            {msg.triggeredCommand && (
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${commandColors[msg.triggeredCommand]?.bg} ${commandColors[msg.triggeredCommand]?.text} ${commandColors[msg.triggeredCommand]?.border}`}>
                {msg.triggeredCommand}
              </span>
            )}
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-gray-500 text-center">
            No messages yet. Waiting for activity...
          </div>
        )}
      </div>
    </div>
  );
}