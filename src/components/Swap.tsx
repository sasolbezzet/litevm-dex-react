import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useTokenStore } from '../stores/tokenStore';
import { useWalletStore } from '../stores/walletStore';
import { useUIStore } from '../stores/uiStore';
import { useTokenBalance, useApprove } from '../hooks/useToken';
import { CONFIG, ROUTER_ABI } from '../utils/config';
import { motion } from 'framer-motion';

export function Swap() {
  const { selectedFromToken, selectedToToken, swapTokens, tokens } = useTokenStore();
  const { isConnected, address } = useWalletStore();
  const { showNotification } = useUIStore();
  const { fetchBalance } = useTokenBalance();
  const { approve, checkAllowance } = useApprove();

  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [fromBalance, setFromBalance] = useState('0');
  const [slippage, setSlippage] = useState(0.5);

  useEffect(() => {
    if (isConnected && selectedFromToken) {
      fetchBalance(selectedFromToken.address).then(setFromBalance);
    }
  }, [isConnected, selectedFromToken, fetchBalance]);

  const calculateOutput = useCallback(async () => {
    if (!fromAmount || !selectedFromToken || !selectedToToken) {
      setToAmount('');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const router = new ethers.Contract(CONFIG.router, ROUTER_ABI, provider);
      
      const amountIn = ethers.parseUnits(fromAmount, selectedFromToken.decimals);
      const amounts = await router.getAmountsOut(amountIn, [selectedFromToken.address, selectedToToken.address]);
      
      const output = amounts[1];
      const minOutput = output * BigInt(10000 - Math.floor(slippage * 100)) / BigInt(10000);
      setToAmount(ethers.formatUnits(minOutput, selectedToToken.decimals));
    } catch (error) {
      setToAmount(fromAmount);
    }
  }, [fromAmount, selectedFromToken, selectedToToken, slippage]);

  useEffect(() => {
    calculateOutput();
  }, [calculateOutput]);

  const handleSwap = async () => {
    if (!isConnected || !fromAmount || !selectedFromToken || !selectedToToken) return;

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const amountIn = ethers.parseUnits(fromAmount, selectedFromToken.decimals);

      const allowance = await checkAllowance(selectedFromToken.address, CONFIG.router);
      if (BigInt(allowance) < amountIn) {
        await approve(selectedFromToken.address, CONFIG.router, fromAmount);
      }

      const router = new ethers.Contract(CONFIG.router, ROUTER_ABI, signer);
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      const toTokenAmount = ethers.parseUnits(toAmount || '0', selectedToToken.decimals);
      const tx = await router.swapExactTokensForTokens(
        amountIn,
        toTokenAmount,
        [selectedFromToken.address, selectedToToken.address],
        address,
        deadline
      );

      showNotification('success', `Swap submitted! TX: ${tx.hash.slice(0, 10)}...`);
      await tx.wait();
      
      showNotification('success', 'Swap completed!');
      setFromAmount('');
      setToAmount('');
      
      fetchBalance(selectedFromToken.address).then(setFromBalance);
    } catch (error: any) {
      showNotification('error', error.message.slice(0, 100));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="card swap-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Swap Tokens</h2>
      
      <div className="swap-input-group">
        <div className="swap-input-header">
          <label>From</label>
          <span className="balance">Balance: {parseFloat(fromBalance).toFixed(6)}</span>
        </div>
        <div className="swap-input-row">
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.0"
            className="swap-input"
          />
          <select
            value={selectedFromToken?.address}
            onChange={(e) => {
              const token = tokens.find(t => t.address === e.target.value);
              if (token) useTokenStore.getState().setSelectedFromToken(token);
            }}
            className="token-select"
          >
            {tokens.map(token => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="swap-action">
        <button className="swap-btn" onClick={swapTokens}>
          ⬇️
        </button>
      </div>

      <div className="swap-input-group">
        <div className="swap-input-header">
          <label>To</label>
        </div>
        <div className="swap-input-row">
          <input
            type="number"
            value={toAmount}
            readOnly
            placeholder="0.0"
            className="swap-input"
          />
          <select
            value={selectedToToken?.address}
            onChange={(e) => {
              const token = tokens.find(t => t.address === e.target.value);
              if (token) useTokenStore.getState().setSelectedToToken(token);
            }}
            className="token-select"
          >
            {tokens.map(token => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      {fromAmount && toAmount && (
        <div className="swap-rate">
          <span>Rate:</span>
          <span>1 {selectedFromToken?.symbol} = {toAmount && fromAmount ? (parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6) : '?'} {selectedToToken?.symbol}</span>
        </div>
      )}

      <div className="slippage-settings">
        <label>Slippage:</label>
        <div className="slippage-buttons">
          {[0.1, 0.5, 1.0].map(val => (
            <button
              key={val}
              className={slippage === val ? 'active' : ''}
              onClick={() => setSlippage(val)}
            >
              {val}%
            </button>
          ))}
        </div>
      </div>

      <button
        className="btn primary swap-submit"
        onClick={handleSwap}
        disabled={loading || !fromAmount || !toAmount || !isConnected}
      >
        {loading ? 'Swapping...' : !isConnected ? 'Connect Wallet' : 'Swap'}
      </button>
    </motion.div>
  );
}
