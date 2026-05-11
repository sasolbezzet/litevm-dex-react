import { create } from 'zustand';
import { ethers } from 'ethers';

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  balance: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  setBalance: (balance: string) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  chainId: null,
  isConnected: false,
  balance: '0',
  
  connect: async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not installed');
    }
    
    const provider = new ethers.BrowserProvider(window.ethereum as any);
    await provider.send('eth_requestAccounts', []);
    
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(address);
    
    set({
      address,
      chainId: Number(network.chainId),
      isConnected: true,
      balance: ethers.formatEther(balance),
    });
  },
  
  disconnect: () => {
    set({ address: null, chainId: null, isConnected: false, balance: '0' });
  },
  
  setBalance: (balance: string) => set({ balance }),
}));
