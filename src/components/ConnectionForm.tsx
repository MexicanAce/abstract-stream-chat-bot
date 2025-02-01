import React from 'react';

interface ConnectionFormProps {
  apiKey: string;
  userToken: string;
  walletAddress: string;
  streamerAddress: string;
  syncAddresses: boolean;
  isConnected: boolean;
  error: string | null;
  onApiKeyChange: (value: string) => void;
  onUserTokenChange: (value: string) => void;
  onWalletAddressChange: (value: string) => void;
  onStreamerAddressChange: (value: string) => void;
  onSyncAddressesChange: (value: boolean) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onTokenHintClick: () => void;
}

export function ConnectionForm({
  apiKey,
  userToken,
  walletAddress,
  streamerAddress,
  syncAddresses,
  isConnected,
  error,
  onApiKeyChange,
  onUserTokenChange,
  onWalletAddressChange,
  onStreamerAddressChange,
  onSyncAddressesChange,
  onConnect,
  onDisconnect,
  onTokenHintClick,
}: ConnectionFormProps) {
  if (isConnected) {
    return (
      <div className="py-8">
        <button
          onClick={onDisconnect}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-full transition-all w-full"
        >
          Disconnect Bot
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-abstract">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stream API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              className="w-full rounded-full border-gray-300 shadow-sm focus:border-abstract-lime focus:ring focus:ring-abstract-lime focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <span>Stream User Token</span>
              <button
                onClick={onTokenHintClick}
                className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 text-gray-500 text-xs hover:bg-gray-100 hover:text-gray-600 transition-colors"
                title="How to get your Stream User Token"
              >
                ?
              </button>
            </label>
            <input
              type="password"
              value={userToken}
              onChange={(e) => onUserTokenChange(e.target.value)}
              className="w-full rounded-full border-gray-300 shadow-sm focus:border-abstract-lime focus:ring focus:ring-abstract-lime focus:ring-opacity-50"
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your AGW Address
            </label>
            <input
              type="text"
              value={walletAddress}
              placeholder="0xe5a8153..."
              onChange={(e) => onWalletAddressChange(e.target.value)}
              className="w-full rounded-full border-gray-300 shadow-sm focus:border-abstract-lime focus:ring focus:ring-abstract-lime focus:ring-opacity-50"
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Streamer Address
            </label>
            <input
              type="text"
              value={streamerAddress}
              onChange={(e) => onStreamerAddressChange(e.target.value.toLowerCase())}
              disabled={syncAddresses}
              className="w-full rounded-full border-gray-300 shadow-sm focus:border-abstract-lime focus:ring focus:ring-abstract-lime focus:ring-opacity-50"
            />
            {/* <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={syncAddresses}
                  onChange={(e) => onSyncAddressesChange(e.target.checked)}
                  className="rounded border-gray-300 text-abstract-lime shadow-sm focus:border-abstract-lime focus:ring focus:ring-abstract-lime focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Use same AGW address
                </span>
              </label>
            </div> */}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={onConnect}
          className="abstract-gradient text-abstract-dark font-bold text-xl py-4 px-6 rounded-full transition-all w-full hover:opacity-90 shadow-lg"
        >
          Connect Bot
        </button>
      </div>
    </div>
  );
}
