import React, { useState, useEffect } from 'react';
import { StreamChat, Event, Message } from 'stream-chat';
import { ConnectionForm } from './components/ConnectionForm';
import { CommandList } from './components/CommandList';
import { CommandEditor } from './components/CommandEditor';
import { MessageList } from './components/MessageList';
import { Modal } from './components/Modal';
import { ChatMessage, Command } from './types';
import { DEFAULT_COMMANDS } from './constants';
import { AbstractLogo } from './components/AbstractLogo';

const STORAGE_KEY = 'abstract-stream-chat-bot-commands';
const TOKEN_STORAGE_KEY = 'abstract-stream-chat-bot-token';
const WALLET_ADDRESS_KEY = 'abstract-stream-chat-bot-wallet-address';

function App() {
  const [apiKey, setApiKey] = useState('43pyq3xf82zq');
  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || '';
  });
  const [walletAddress, setWalletAddress] = useState(() => {
    return localStorage.getItem(WALLET_ADDRESS_KEY) || '';
  });
  const [streamerAddress, setStreamerAddress] = useState(
    '0xe5a8153d43217784677d5de75c8745f669ff162b' // lofi
    // '0x370d58b9adf6c2feb000bf3e18908d48878b3f4e' // portport
  );
  const [syncAddresses, setSyncAddresses] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [client, setClient] = useState<StreamChat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTokenHintModalOpen, setIsTokenHintModalOpen] = useState(false);
  const [commands, setCommands] = useState<Command[]>(() => {
    const savedCommands = localStorage.getItem(STORAGE_KEY);
    if (savedCommands) {
      try {
        const parsed = JSON.parse(savedCommands);
        return parsed.map((cmd: any) => ({
          ...cmd,
          response: cmd.isJavaScript
            ? new Function(
                cmd.responseText
                  .replace('function anonymous(\n) {\n', '')
                  .slice(0, -2)
              )
            : () => cmd.responseText,
        }));
      } catch (err) {
        console.error('Error loading commands from storage:', err);
        return DEFAULT_COMMANDS;
      }
    }
    return DEFAULT_COMMANDS;
  });

  useEffect(() => {
    if (syncAddresses) {
      setStreamerAddress(walletAddress);
    }
  }, [syncAddresses, walletAddress]);

  useEffect(() => {
    const serializedCommands = JSON.stringify(
      commands.map((cmd) => ({
        ...cmd,
        responseText: cmd.isJavaScript
          ? cmd.response.toString()
          : cmd.response(),
        isJavaScript: cmd.isJavaScript,
      }))
    );
    // console.log(serializedCommands);
    localStorage.setItem(STORAGE_KEY, serializedCommands);

    // Reconnect bot when commands are updated
    if (isConnected) {
      disconnectBot().then(() => connectBot());
    }
  }, [commands]);

  useEffect(() => {
    if (userToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, userToken);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [userToken]);

  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem(WALLET_ADDRESS_KEY, walletAddress);
    } else {
      localStorage.removeItem(WALLET_ADDRESS_KEY);
    }
  }, [walletAddress]);

  const handleAddCommand = (command: Command) => {
    setCommands((prev) => [...prev, command]);
  };

  const handleEditCommand = (index: number, command: Command) => {
    setCommands((prev) => {
      const newCommands = [...prev];
      newCommands[index] = command;
      return newCommands;
    });
  };

  const handleDeleteCommand = (index: number) => {
    setCommands((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetCommands = () => {
    setCommands(DEFAULT_COMMANDS);
  };

  const connectBot = async () => {
    try {
      setError(null);

      if (!apiKey || !userToken || !walletAddress || !streamerAddress) {
        throw new Error('Please fill in all fields');
      }

      const chatClient = StreamChat.getInstance(apiKey, {
        allowServerSideConnect: true,
      });

      await chatClient.connectUser(
        {
          id: walletAddress,
          name: 'Chat Bot',
        },
        userToken
      );

      setClient(chatClient);
      setIsConnected(true);

      const channels = await chatClient.queryChannels({
        created_by_id: streamerAddress,
      });

      channels.forEach((channel) => {
        channel.on('message.new', (event: Event) => {
          const message = event.message as Message;
          const command = commands.find((cmd) => message.text === cmd.trigger);

          setMessages((prev) =>
            [
              {
                id: message.id || Date.now().toString(),
                user: message.user?.name || 'Unknown',
                text: message.text || '',
                timestamp: new Date(),
                triggeredCommand: command?.trigger,
              },
              ...prev,
            ].slice(0, 100)
          );

          if (command) {
            const messageText = command.response() as string;
            console.log(`Sending message: ${messageText}`);
            channel.sendMessage({
              text: messageText,
              show_in_channel: true,
              user_id: walletAddress,
            });
          }
        });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsConnected(false);
    }
  };

  const disconnectBot = async () => {
    if (client) {
      await client.disconnectUser();
      setClient(null);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    return () => {
      disconnectBot();
    };
  }, []);

  return (
    <div className="min-h-screen bg-abstract-gray py-6 flex flex-col justify-center sm:py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <AbstractLogo className="absolute -rotate-12 opacity-60 w-96 h-96 -left-32 -top-32 text-abstract-lime" />
        <AbstractLogo className="absolute rotate-45 opacity-60 w-96 h-96 -right-32 -bottom-32 text-abstract-lime" />
        <AbstractLogo className="absolute rotate-90 opacity-60 w-64 h-64 right-32 top-32 text-abstract-lime" />
      </div>

      <div className="relative py-3 sm:mx-auto w-full max-w-6xl px-4">
        <div className="relative px-6 py-10 bg-white/90 backdrop-blur-sm shadow-abstract rounded-abstract">
          <div className="mx-auto">
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-abstract-dark">
                  Abstract Stream Chat Bot
                </h1>
                {isConnected && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2.5 bg-abstract-lime text-abstract-dark font-medium rounded-full hover:bg-opacity-90 transition-all"
                  >
                    Manage Commands
                  </button>
                )}
              </div>

              <ConnectionForm
                apiKey={apiKey}
                userToken={userToken}
                walletAddress={walletAddress}
                streamerAddress={streamerAddress}
                syncAddresses={syncAddresses}
                isConnected={isConnected}
                error={error}
                onApiKeyChange={setApiKey}
                onUserTokenChange={setUserToken}
                onWalletAddressChange={setWalletAddress}
                onStreamerAddressChange={setStreamerAddress}
                onSyncAddressesChange={setSyncAddresses}
                onConnect={connectBot}
                onDisconnect={disconnectBot}
                onTokenHintClick={() => setIsTokenHintModalOpen(true)}
              />

              {isConnected && (
                <MessageList messages={messages} commands={commands} />
              )}

              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Manage Commands"
              >
                <CommandEditor
                  commands={commands}
                  onAddCommand={handleAddCommand}
                  onEditCommand={handleEditCommand}
                  onDeleteCommand={handleDeleteCommand}
                  onResetCommands={handleResetCommands}
                />
              </Modal>

              <Modal
                isOpen={isTokenHintModalOpen}
                onClose={() => setIsTokenHintModalOpen(false)}
                title="How to Get Your Stream User Token"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <ol className="list-decimal ml-4 space-y-2">
                      <li>Open any Abstract stream in your browser</li>
                      <li>
                        Open Developer Tools (F12 or Right Click → Inspect)
                      </li>
                      <li>Refresh the page</li>
                      <li>
                        Filter for the only WSS request when the page is loaded
                        (`wss://chat.stream-io-api.com/connect`)
                      </li>
                      <li>
                        Copy the value of the `authorization` query parameter
                        (this is your Stream User Token)
                      </li>
                    </ol>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Made with ❤️ by{' '}
          <a
            href="https://x.com/mexicanace"
            target="_blank"
            rel="noopener noreferrer"
            className="text-abstract-dark font-medium hover:text-abstract-lime transition-colors"
          >
            MexicanAce
          </a>
          (
          <a
            href="https://github.com/mexicanace/abstract-stream-chat-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-abstract-dark font-medium hover:text-abstract-lime transition-colors"
          >
            GitHub
          </a>
          )
        </div>
      </div>
    </div>
  );
}

export default App;
