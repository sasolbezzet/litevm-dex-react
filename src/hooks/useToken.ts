import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWalletStore } from '../stores/walletStore';
import { ERC20_ABI } from '../utils/config';

export function useTokenBalance() {
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useWalletStore();

  const fetchBalance = useCallback(async (tokenAddress: string) => {
    if (!isConnected || !address) return '0';
    
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const bal = await token.balanceOf(address);
      const decimals = await token.decimals();
      setBalance(ethers.formatUnits(bal, decimals));
      return ethers.formatUnits(bal, decimals);
    } catch (error) {
      return '0';
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  const fetchNativeBalance = useCallback(async () => {
    if (!isConnected || !address) return '0';
    
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const bal = await provider.getBalance(address);
      setBalance(ethers.formatEther(bal));
      return ethers.formatEther(bal);
    } catch (error) {
      return '0';
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  return { balance, loading, fetchBalance, fetchNativeBalance };
}

export function useApprove() {
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useWalletStore();

  const approve = useCallback(async (tokenAddress: string, spender: string, amount: string) => {
    if (!isConnected || !address) throw new Error('Wallet not connected');
    
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      
      const decimals = await token.decimals();
      const amountWei = ethers.parseUnits(amount, decimals);
      
      const tx = await token.approve(spender, amountWei);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  const checkAllowance = useCallback(async (tokenAddress: string, spender: string) => {
    if (!address) return '0';
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const allowance = await token.allowance(address, spender);
      return allowance.toString();
    } catch (error) {
      return '0';
    }
  }, [address]);

  return { approve, checkAllowance, loading };
}
