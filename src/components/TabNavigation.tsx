import type { Tab } from '../stores/uiStore';
import { useUIStore } from '../stores/uiStore';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'swap', label: 'Swap', icon: '💱' },
  { id: 'liquidity', label: 'Liquidity', icon: '🌊' },
  { id: 'farm', label: 'Farm', icon: '🌾' },
  { id: 'bridge', label: 'Bridge', icon: '🌉' },
  { id: 'tokens', label: 'Tokens', icon: '🪙' },
];

export function TabNavigation() {
  const { activeTab, setActiveTab } = useUIStore();

  return (
    <nav className="tabs">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
