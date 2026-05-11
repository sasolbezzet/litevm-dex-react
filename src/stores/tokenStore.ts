import { create } from 'zustand';

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
}

export interface TokenState {
  tokens: Token[];
  selectedFromToken: Token | null;
  selectedToToken: Token | null;
  setTokens: (tokens: Token[]) => void;
  setSelectedFromToken: (token: Token) => void;
  setSelectedToToken: (token: Token) => void;
  swapTokens: () => void;
}

// LiteVM Testnet Token List
const DEFAULT_TOKENS: Token[] = [
  { address: '0x5b3a6c06be6719353c2b6059bAaB6b0Dae358052', symbol: 'TKNA', name: 'Token A', decimals: 18 },
  { address: '0x8370CfDe29eF5b0565e27e0643583a4784325946', symbol: 'TKNB', name: 'Token B', decimals: 18 },
  { address: '0x0E93a836722D5712C8cF4bB41076b1121bfC8FC4', symbol: 'REWARD', name: 'Farm Reward', decimals: 18 },
  { address: '0xdF0615E3B4a9C1549b213e705a8e7051a7d8a4DE', symbol: 'wETH', name: 'Wrapped Ether', decimals: 18 },
];

export const useTokenStore = create<TokenState>((set, get) => ({
  tokens: DEFAULT_TOKENS,
  selectedFromToken: DEFAULT_TOKENS[0],
  selectedToToken: DEFAULT_TOKENS[1],
  
  setTokens: (tokens) => set({ tokens }),
  
  setSelectedFromToken: (token) => set({ selectedFromToken: token }),
  
  setSelectedToToken: (token) => set({ selectedToToken: token }),
  
  swapTokens: () => {
    const { selectedFromToken, selectedToToken } = get();
    set({
      selectedFromToken: selectedToToken,
      selectedToToken: selectedFromToken,
    });
  },
}));
