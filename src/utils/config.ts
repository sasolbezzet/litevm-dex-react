// LiteVM Testnet Configuration
export const CONFIG = {
  // Network
  chainId: 4441,
  chainIdHex: '0x1159',
  chainName: 'LiteVM Testnet',
  nativeCurrency: { name: 'zkLTC', symbol: 'zkLTC', decimals: 18 },
  rpcUrl: 'https://liteforge.rpc.caldera.xyz/infra-partner-http',
  blockExplorer: 'https://liteforge.caldera.xyz',
  
  // Contracts
  router: '0x62Ec2dA79c0A27A3BE3cf85Ad40c590dAC7DA49D',
  factory: '0xfd0D259C10DAa3FE2dB315eE19E4A8C3b98cc32a',
  pair: '0x4e7e5efdF721b92e7eb974E2f313fEdefc81Db03',
  
  // Tokens
  tokenA: '0x5b3a6c06be6719353c2b6059bAaB6b0Dae358052',
  tokenB: '0x8370CfDe29eF5b0565e27e0643583a4784325946',
  rewardToken: '0x0E93a836722D5712C8cF4bB41076b1121bfC8FC4',
  weth: '0xdF0615E3B4a9C1549b213e705a8e7051a7d8a4DE',
  
  // Farm
  farm: '0x47ac007000F24AD4758eaA6Fcd1dAC020143C16a',
  farmPid: 0,
  
  // Bridge
  bridge: {
    litevm: '0xfcA5CB59fDFC0Cb15Ca1035FeE204DC916F7c70f',
    sepolia: '0xb9Fb801A5D1491E70A886800982CB80cdf98A174',
  },
  wethToken: '0xdF0615E3B4a9C1549b213e705a8e7051a7d8a4DE',
  relayer: '0x30Eb5B1adC393F24567bB8E939b0ff5eC3C41D65',
};

// ABIs
export const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

export const ROUTER_ABI = [
  'function addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline)',
  'function addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline)',
  'function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)',
  'function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
  'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
  'function getAmountsOut(uint256 amountIn, address[] path) view returns (uint256[])',
  'function getReserves() view returns (uint112, uint112, uint32)',
];

export const FACTORY_ABI = [
  'function getPair(address tokenA, address tokenB) view returns (address)',
  'function createPair(address tokenA, address tokenB) returns (address)',
];

export const FARM_ABI = [
  'function deposit(uint256 pid, uint256 amount)',
  'function withdraw(uint256 pid, uint256 amount)',
  'function pendingReward(uint256 pid, address user) view returns (uint256)',
  'function userInfo(uint256 pid, address user) view returns (uint256, uint256)',
  'function poolInfo(uint256 pid) view returns (address, uint256, uint256, uint256, uint256)',
  'function emergencyWithdraw(uint256 pid)',
];

export const BRIDGE_ABI = [
  'function lockEth(uint256 destChainId, address recipient) payable',
  'function unlockEth(address recipient, uint256 amount, bytes32 messageId)',
  'function selfRelay(bytes32 messageId)',
  'function getLockCount() view returns (uint256)',
  'function getLockInfo(uint256) view returns (address, address, uint256, uint256, address, uint256)',
];
