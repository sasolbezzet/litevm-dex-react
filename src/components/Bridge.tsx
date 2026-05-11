import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWalletStore } from '../stores/walletStore';
import { useUIStore } from '../stores/uiStore';
import { CONFIG, BRIDGE_ABI } from '../utils/config';
import { motion } from 'framer-motion';

export function Bridge() {
  const { isConnected, address, balance } = useWalletStore();
  const { showNotification } = useUIStore();

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [bridgeBalances, setBridgeBalances] = useState({
    litevm: '0',
    sepolia: '0',
  });

  useEffect(() => {
    loadBridgeBalances();
  }, [isConnected]);

  const loadBridgeBalances = async () => {
    if (!address) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // LiteVM Bridge balance
      const litevmBridge = new ethers.Contract(CONFIG.bridge.litevm, BRIDGE_ABI, provider);
      const lockCount = await litevmBridge.getLockCount();
      
      let litevmPending = '0';
      for (let i = 0; i < lockCount; i++) {
        const info = await litevmBridge.getLockInfo(i);
        if (info[4].toLowerCase() === address.toLowerCase()) {
          litevmPending = ethers.formatEther(info[2]);
          break;
        }
      }
      
      setBridgeBalances(prev => ({ ...prev, litevm: litevmPending }));
    } catch (error) {
      console.error('Load bridge balances error:', error);
    }
  };

  const handleBridgeToSepolia = async () => {
    if (!isConnected || !amount) return;
    
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const bridge = new ethers.Contract(CONFIG.bridge.litevm, BRIDGE_ABI, signer);
      const amountWei = ethers.parseEther(amount);
      
      const tx = await bridge.lockEth(11155111, address, { value: amountWei });
      
      showNotification('success', `Bridging to Sepolia... TX: ${tx.hash.slice(0, 10)}...`);
      await tx.wait();
      
      showNotification('success', 'Bridge initiated! Switch to Sepolia and claim.');
      setAmount('');
      loadBridgeBalances();
    } catch (error: any) {
      showNotification('error', error.message.slice(0, 100));
    } finally {
      setLoading(false);
    }
  };

  const handleBridgeToLiteVM = async () => {
    if (!isConnected || !amount) return;
    
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Switch to Sepolia first
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // 11155111
        });
      } catch (e) {
        // Sepolia might not be added
      }
      
      await new Promise(r => setTimeout(r, 2000));
      
      const bridge = new ethers.Contract(CONFIG.bridge.sepolia, BRIDGE_ABI, signer);
      const amountWei = ethers.parseEther(amount);
      
      const tx = await bridge.lockEth(4441, address, { value: amountWei });
      
      showNotification('success', `Bridging to LiteVM... TX: ${tx.hash.slice(0, 10)}...`);
      await tx.wait();
      
      showNotification('success', 'Bridge initiated! Switch to LiteVM and claim.');
      setAmount('');
    } catch (error: any) {
      showNotification('error', error.message.slice(0, 100));
    } finally {
      setLoading(false);
    }
  };


  return (
    <motion.div 
      className="card bridge-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Bridge</h2>
      
      <div className="bridge-info">
        <div className="info-grid">
          <div className="info-box">
            <div className="label">Your Balance (zkLTC)</div>
            <div className="value">{parseFloat(balance).toFixed(6)}</div>
          </div>
          <div className="info-box">
            <div className="label">Pending on LiteVM</div>
            <div className="value">{bridgeBalances.litevm}</div>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Amount (ETH/zkLTC)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
        />
      </div>

      <div className="bridge-buttons">
        <button
          className="btn primary"
          onClick={handleBridgeToSepolia}
          disabled={loading || !isConnected || !amount}
        >
          {loading ? 'Processing...' : 'Bridge → Sepolia'}
        </button>
        
        <button
          className="btn secondary"
          onClick={handleBridgeToLiteVM}
          disabled={loading || !isConnected || !amount}
        >
          Bridge → LiteVM
        </button>
      </div>

      <div className="bridge-alternatives">
        <h3>Alternative Bridges</h3>
        <a 
          href="https://multyra.xyz" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bridge-link"
        >
          → Multyra Bridge (Official LiteForge)
        </a>
      </div>

      <div className="bridge-info" style={{ marginTop: '20px' }}>
        <h3>Bridge Contracts</h3>
        <div className="info-box">
          <div className="label">LiteVM Bridge</div>
          <div className="value small">{CONFIG.bridge.litevm}</div>
        </div>
        <div className="info-box">
          <div className="label">Sepolia Bridge</div>
          <div className="value small">{CONFIG.bridge.sepolia}</div>
        </div>
      </div>
    </motion.div>
  );
}
