import { useWalletStore } from '../stores/walletStore';
import { CONFIG } from '../utils/config';

export function Header() {
  const { isConnected, chainId } = useWalletStore();
  const isCorrectNetwork = chainId === CONFIG.chainId;

  return (
    <header className="header">
      <div className="logo">
        <span className="logo-icon">🚀</span>
        <span className="logo-text">LiteVM DeFi</span>
      </div>
      <div className="network-badge" data-network={isCorrectNetwork ? 'correct' : 'wrong'}>
        {isConnected ? (
          isCorrectNetwork ? (
            <>LiteVM (4441)</>
          ) : (
            <>Wrong Network</>
          )
        ) : (
          <>Not Connected</>
        )}
      </div>
    </header>
  );
}
