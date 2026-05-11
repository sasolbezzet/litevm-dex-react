import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWalletStore } from '../stores/walletStore';
import { useUIStore } from '../stores/uiStore';
import { useApprove } from '../hooks/useToken';
import { CONFIG, FARM_ABI } from '../utils/config';
import { motion } from 'framer-motion';

export function Farm() {
  const { isConnected, address } = useWalletStore();
  const { showNotification } = useUIStore();
  const { approve, checkAllowance } = useApprove();

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [farmData, setFarmData] = useState({
    staked: '0',
    pending: '0',
    totalLocked: '0',
    apr: '0',
  });

  useEffect(() => {
    if (isConnected) {
      loadFarmData();
    }
  }, [isConnected]);

  const loadFarmData = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const farm = new ethers.Contract(CONFIG.farm, FARM_ABI, provider);
      
      const userInfo = await farm.userInfo(CONFIG.farmPid, address);
      const pending = await farm.pendingReward(CONFIG.farmPid, address);
      const poolInfo = await farm.poolInfo(CONFIG.farmPid);
      
      setFarmData({
        staked: ethers.formatEther(userInfo[0]),
        pending: ethers.formatEther(pending),
        totalLocked: ethers.formatEther(poolInfo.totalLocked),
        apr: '25.5', // Would calculate dynamically
      });
    } catch (error) {
      console.error('Load farm data error:', error);
    }
  };

  const handleStake = async () => {
    if (!isConnected || !stakeAmount) return;
    
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const amountWei = ethers.parseUnits(stakeAmount, 18);
      
      // Approve LP tokens
      const allowance = await checkAllowance(CONFIG.pair, CONFIG.farm);
      if (BigInt(allowance) < amountWei) {
        await approve(CONFIG.pair, CONFIG.farm, stakeAmount);
      }
      
      const farm = new ethers.Contract(CONFIG.farm, FARM_ABI, signer);
      const tx = await farm.deposit(CONFIG.farmPid, amountWei);
      
      showNotification('success', `Staking... TX: ${tx.hash.slice(0, 10)}...`);
      await tx.wait();
      
      showNotification('success', 'Staked successfully!');
      setStakeAmount('');
      loadFarmData();
    } catch (error: any) {
      showNotification('error', error.message.slice(0, 100));
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!isConnected || !unstakeAmount) return;
    
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const amountWei = ethers.parseUnits(unstakeAmount, 18);
      
      const farm = new ethers.Contract(CONFIG.farm, FARM_ABI, signer);
      const tx = await farm.withdraw(CONFIG.farmPid, amountWei);
      
      showNotification('success', `Unstaking... TX: ${tx.hash.slice(0, 10)}...`);
      await tx.wait();
      
      showNotification('success', 'Unstaked successfully!');
      setUnstakeAmount('');
      loadFarmData();
    } catch (error: any) {
      showNotification('error', error.message.slice(0, 100));
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!isConnected) return;
    
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const farm = new ethers.Contract(CONFIG.farm, FARM_ABI, signer);
      const tx = await farm.withdraw(CONFIG.farmPid, 0); // Claim only
      
      showNotification('success', `Claiming... TX: ${tx.hash.slice(0, 10)}...`);
      await tx.wait();
      
      showNotification('success', 'Rewards claimed!');
      loadFarmData();
    } catch (error: any) {
      showNotification('error', error.message.slice(0, 100));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="card farm-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Farm</h2>
      
      <div className="farm-info">
        <div className="info-grid">
          <div className="info-box">
            <div className="label">Your Staked</div>
            <div className="value">{parseFloat(farmData.staked).toFixed(6)} LP</div>
          </div>
          <div className="info-box">
            <div className="label">Pending Rewards</div>
            <div className="value highlight">{parseFloat(farmData.pending).toFixed(6)} REWARD</div>
          </div>
          <div className="info-box">
            <div className="label">Total Locked</div>
            <div className="value">{parseFloat(farmData.totalLocked).toFixed(2)} LP</div>
          </div>
          <div className="info-box">
            <div className="label">APR</div>
            <div className="value highlight">{farmData.apr}%</div>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Stake Amount (LP Tokens)</label>
        <input
          type="number"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          placeholder="0.0"
        />
      </div>
      <button
        className="btn primary"
        onClick={handleStake}
        disabled={loading || !isConnected || !stakeAmount}
      >
        {loading ? 'Staking...' : 'Stake'}
      </button>

      <div className="form-group" style={{ marginTop: '20px' }}>
        <label>Unstake Amount</label>
        <input
          type="number"
          value={unstakeAmount}
          onChange={(e) => setUnstakeAmount(e.target.value)}
          placeholder="0.0"
        />
      </div>
      <button
        className="btn secondary"
        onClick={handleUnstake}
        disabled={loading || !isConnected || !unstakeAmount}
      >
        Unstake
      </button>

      <button
        className="btn primary"
        onClick={handleClaim}
        disabled={loading || parseFloat(farmData.pending) === 0}
        style={{ marginTop: '10px' }}
      >
        Claim Rewards
      </button>
    </motion.div>
  );
}
