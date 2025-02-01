import { Command } from './types';

export const DEFAULT_COMMANDS: Command[] = [
  {
    trigger: 'gm',
    response: () => 'gm :HeartPengu:',
    description: 'Responds with a friendly greeting',
    isJavaScript: false,
  },
  {
    trigger: '!date',
    response: new Function('return new Date().toLocaleTimeString()'),
    description: 'Responds with the current time',
    isJavaScript: true,
  },
];
