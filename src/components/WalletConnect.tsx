import { useState } from 'react';
import { useWalletStore } from '../stores/walletStore';
import { CONFIG } from '../utils/config';


export function WalletConnect() {
  const { address, isConnected, balance, connect, disconnect } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      // Switch to correct network first
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CONFIG.chainIdHex }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: CONFIG.chainIdHex,
                chainName: CONFIG.chainName,
                nativeCurrency: CONFIG.nativeCurrency,
                rpcUrls: [CONFIG.rpcUrl],
                blockExplorerUrls: [CONFIG.blockExplorer],
              }],
            });
          }
        }
      }
      await connect();
    } catch (err: any) {
      setError(err.message || 'Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="wallet-section">
      {!isConnected ? (
        <button 
          className="wallet-btn primary" 
          onClick={handleConnect}
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="wallet-info">
          <div className="wallet-balance">
            <span className="balance-label">Balance:</span>
            <span className="balance-value">{parseFloat(balance).toFixed(4)} zkLTC</span>
          </div>
          <button className="wallet-btn connected" onClick={disconnect}>
            <span className="address">{formatAddress(address!)}</span>
            <span className="disconnect">Disconnect</span>
          </button>
        </div>
      )}
      {error && <div className="wallet-error">{error}</div>}
    </div>
  );
}
