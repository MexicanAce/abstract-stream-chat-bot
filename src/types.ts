export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  triggeredCommand?: string;
}

export interface Command {
  trigger: string;
  response: () => string | Function;
  description: string;
  isJavaScript: boolean;
}
