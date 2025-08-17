# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

# DeFi Token Swap - Getting Started Guide

## 🚀 What You've Built

A complete decentralized exchange (DEX) with:
- ✅ ERC-20 tokens (TokenA & TokenB)
- ✅ Token swap functionality with 0.3% fees
- ✅ Liquidity pool management
- ✅ Comprehensive test suite (19 passing tests)
- ✅ Local blockchain deployment
- ✅ Web interface for testing

## 🧪 Testing Locally (Working Now)

### 1. Local Hardhat Network
```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/test-contracts.ts --network localhost

# Open web interface
open web-interface.html
```

### 2. MetaMask Setup for Local Testing
- **Network**: Hardhat Local
- **RPC URL**: http://127.0.0.1:8545
- **Chain ID**: 31337
- **Currency**: ETH
- **Test Account**: Use the provided private key for 10,000 ETH

## 🌐 Fuji Testnet Deployment (Need AVAX)

### Get Test AVAX From:
1. **Chainlink Faucet**: https://faucets.chain.link/fuji
2. **Alchemy Faucet**: https://www.alchemy.com/faucets/avalanche-fuji
3. **Discord**: https://discord.gg/RwXY7P6 (type `.faucet <address>`)
4. **Original Faucet**: https://faucet.avax.network/

### Your Account
- **Address**: `0xd503E2b91BcC447d673D719B3d9caaFf072d78FE`
- **Current Balance**: 0.0 AVAX
- **Needed**: 0.05+ AVAX for deployment

### Deploy to Fuji
```bash
# Check balance
npx hardhat run scripts/check-balance.ts --network fuji

# Deploy (when you have AVAX)
npx hardhat run scripts/deploy-fuji.ts --network fuji
```

## 📱 MetaMask Networks

### Fuji Testnet
```
Network Name: Avalanche Fuji Testnet
RPC URL: https://api.avax-test.network/ext/bc/C/rpc
Chain ID: 43113
Currency Symbol: AVAX
Block Explorer: https://testnet.snowtrace.io/
```

### Local Hardhat
```
Network Name: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
```

## 🎯 Next Steps

1. **Get test AVAX** from any of the faucets above
2. **Deploy to Fuji** using `scripts/deploy-fuji.ts`
3. **Test on real testnet** with MetaMask
4. **Build React frontend** for better UX
5. **Add more features** (dynamic pricing, governance, etc.)

## 🛠️ Available Scripts

```bash
# Testing
npx hardhat test                                    # Run all tests
npx hardhat run scripts/test-contracts.ts           # Deploy & test locally

# Local Development
npx hardhat node                                    # Start local blockchain
npx hardhat run scripts/test-contracts.ts --network localhost

# Fuji Testnet
npx hardhat run scripts/check-balance.ts --network fuji     # Check AVAX
npx hardhat run scripts/deploy-fuji.ts --network fuji       # Deploy to Fuji

# Compilation
npx hardhat compile                                 # Compile contracts
npx hardhat clean                                   # Clean artifacts
```

## 🔗 Useful Links

- **Your Account**: https://testnet.snowtrace.io/address/0xd503E2b91BcC447d673D719B3d9caaFf072d78FE
- **Avalanche Docs**: https://docs.avax.network/
- **Hardhat Docs**: https://hardhat.org/docs
- **OpenZeppelin**: https://docs.openzeppelin.com/

## 🎉 Achievements Unlocked

- ✅ Built a working DEX from scratch
- ✅ Learned Solidity smart contract development
- ✅ Mastered Hardhat development environment
- ✅ Created comprehensive test suite
- ✅ Integrated with MetaMask
- ✅ Ready for real blockchain deployment

**You're now a DeFi developer!** 🚀
