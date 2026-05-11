import { useUIStore } from './stores/uiStore';
import { Header } from './components/Header';
import { WalletConnect } from './components/WalletConnect';
import { TabNavigation } from './components/TabNavigation';
import { Swap } from './components/Swap';
import { Liquidity } from './components/Liquidity';
import { Farm } from './components/Farm';
import { Bridge } from './components/Bridge';
import { Tokens } from './components/Tokens';
import { Notification } from './components/Notification';

function App() {
  const { activeTab, notification, clearNotification } = useUIStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'swap':
        return <Swap />;
      case 'liquidity':
        return <Liquidity />;
      case 'farm':
        return <Farm />;
      case 'bridge':
        return <Bridge />;
      case 'tokens':
        return <Tokens />;
      default:
        return <Swap />;
    }
  };

  return (
    <div className="app">
      <div className="container">
        <Header />
        <WalletConnect />
        <Notification 
          notification={notification} 
          onClose={clearNotification} 
        />
        <TabNavigation />
        <main className="content">
          {renderContent()}
        </main>
        <footer className="footer">
          <p>🚀 LiteVM DeFi - Built on LiteVM Testnet</p>
          <p>Chain ID: 4441 | RPC: liteforge.rpc.caldera.xyz</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
