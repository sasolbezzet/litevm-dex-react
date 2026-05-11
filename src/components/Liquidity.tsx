import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWalletStore } from '../stores/walletStore';
import { useUIStore } from '../stores/uiStore';
import { useTokenBalance, useApprove } from '../hooks/useToken';
import { CONFIG, ERC20_ABI, ROUTER_ABI } from '../utils/config';
import { motion } from 'framer-motion';

export function Liquidity() {
  const { isConnected, address } = useWalletStore();
  const { showNotification } = useUIStore();
  useTokenBalance();
  const { approve, checkAllowance } = useApprove();

  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [loading, setLoading] = useState(false);
  const [lpBalance, setLpBalance] = useState('0');
  const [reserves, setReserves] = useState({ reserveA: '0', reserveB: '0' });

  useEffect(() => {
    if (isConnected) {
      loadPoolData();
    }
  }, [isConnected]);

  const loadPoolData = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // LP Balance
      const pair = new ethers.Contract(CONFIG.pair, ERC20_ABI, provider);
      const lp = await pair.balanceOf(address);
      setLpBalance(ethers.formatEther(lp));

      // Reserves
      const router = new ethers.Contract(CONFIG.router, ROUTER_ABI, provider);
      const res = await router.getReserves();
      setReserves({
        reserveA: ethers.formatEther(res[0]),
        reserveB: ethers.formatEther(res[1]),
      });
    } catch (error) {
      console.error('Load pool data error:', error);
    }
  };

  const handleAddLiquidity = async () => {
    if (!isConnected || !amountA || !amountB) return;

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Approve tokens
      const amountAWei = ethers.parseUnits(amountA, 18);
      const amountBWei = ethers.parseUnits(amountB, 18);

      for (const token of [CONFIG.tokenA, CONFIG.tokenB]) {
        const allowance = await checkAllowance(token, CONFIG.router);
        if (BigInt(allowance) < (token === CONFIG.tokenA ? amountAWei : amountBWei)) {
          await approve(token, CONFIG.router, token === CONFIG.tokenA ? amountA : amountB);
        }
      }

      // Add liquidity
      const router = new ethers.Contract(CONFIG.router, ROUTER_ABI, signer);
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      const tx = await router.addLiquidity(
        CONFIG.tokenA,
        CONFIG.tokenB,
        amountAWei,
        amountBWei,
        0,
        0,
        address,
        deadline
      );

      showNotification('success', `Adding liquidity... TX: ${tx.hash.slice(0, 10)}...`);
      await tx.wait();
      
      showNotification('success', 'Liquidity added!');
      setAmountA('');
      setAmountB('');
      loadPoolData();
    } catch (error: any) {
      showNotification('error', error.message.slice(0, 100));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!isConnected || !lpBalance || parseFloat(lpBalance) === 0) return;
    
    setLoading(true);
    try {
      // For simplicity - in production would need pair ABI with removeLiquidity
      showNotification('info', 'Remove liquidity not fully implemented');
    } catch (error: any) {
      showNotification('error', error.message.slice(0, 100));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="card liquidity-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Add Liquidity</h2>
      
      <div className="form-group">
        <label>Token A (TKNA) Amount</label>
        <input
          type="number"
          value={amountA}
          onChange={(e) => setAmountA(e.target.value)}
          placeholder="0.0"
        />
      </div>
      
      <div className="form-group">
        <label>Token B (TKNB) Amount</label>
        <input
          type="number"
          value={amountB}
          onChange={(e) => setAmountB(e.target.value)}
          placeholder="0.0"
        />
      </div>

      <button
        className="btn primary"
        onClick={handleAddLiquidity}
        disabled={loading || !isConnected || !amountA || !amountB}
      >
        {loading ? 'Adding...' : 'Add Liquidity'}
      </button>

      <div className="pool-info">
        <h3>Your LP Tokens</h3>
        <div className="info-grid">
          <div className="info-box">
            <div className="label">LP Balance</div>
            <div className="value">{parseFloat(lpBalance).toFixed(6)}</div>
          </div>
          <div className="info-box">
            <div className="label">Pool Reserves</div>
            <div className="value small">
              {parseFloat(reserves.reserveA).toFixed(2)} TKNA<br/>
              {parseFloat(reserves.reserveB).toFixed(2)} TKNB
            </div>
          </div>
        </div>
      </div>

      {parseFloat(lpBalance) > 0 && (
        <button
          className="btn secondary"
          onClick={handleRemoveLiquidity}
          disabled={loading}
        >
          Remove Liquidity
        </button>
      )}
    </motion.div>
  );
}
