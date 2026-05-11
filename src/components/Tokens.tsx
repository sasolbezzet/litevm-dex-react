import { useTokenStore } from '../stores/tokenStore';
import { motion } from 'framer-motion';

export function Tokens() {
  const { tokens } = useTokenStore();

  return (
    <motion.div 
      className="card tokens-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Token List</h2>
      
      <div className="token-grid">
        {tokens.map((token, index) => (
          <motion.div 
            key={token.address}
            className="token-item"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="token-icon">{token.symbol[0]}</div>
            <div className="token-symbol">{token.symbol}</div>
            <div className="token-name">{token.name}</div>
            <div className="token-address">{token.address.slice(0, 6)}...{token.address.slice(-4)}</div>
          </motion.div>
        ))}
      </div>

      <div className="token-addresses" style={{ marginTop: '30px' }}>
        <h3>Contract Addresses</h3>
        {tokens.map(token => (
          <div key={token.address} className="info-box" style={{ marginBottom: '10px' }}>
            <div className="label">{token.symbol}</div>
            <div className="value small">{token.address}</div>
          </div>
        ))}
      </div>

      <div className="contract-addresses" style={{ marginTop: '30px' }}>
        <h3>DeFi Contracts</h3>
        <div className="info-box" style={{ marginBottom: '10px' }}>
          <div className="label">Router</div>
          <div className="value small">0x62Ec2dA79c0A27A3BE3cf85Ad40c590dAC7DA49D</div>
        </div>
        <div className="info-box" style={{ marginBottom: '10px' }}>
          <div className="label">Factory</div>
          <div className="value small">0xfd0D259C10DAa3FE2dB315eE19E4A8C3b98cc32a</div>
        </div>
        <div className="info-box" style={{ marginBottom: '10px' }}>
          <div className="label">Farm</div>
          <div className="value small">0x47ac007000F24AD4758eaA6Fcd1dAC020143C16a</div>
        </div>
        <div className="info-box" style={{ marginBottom: '10px' }}>
          <div className="label">LP Pair</div>
          <div className="value small">0x4e7e5efdF721b92e7eb974E2f313fEdefc81Db03</div>
        </div>
      </div>
    </motion.div>
  );
}
