# 🚀 DeFi Trader - Local Trading Setup

This guide will help you set up a complete local DeFi trading environment where you can buy tokens, swap them, and track fees - all reflected in your MetaMask wallet!

## 🎯 What You Can Do

✅ **Buy Tokens**: Mint TKNA and TKNB tokens for testing  
✅ **Swap Tokens**: Trade between TKNA and TKNB with real-time quotes  
✅ **Track Fees**: See how much fees you've collected as the pool owner  
✅ **MetaMask Integration**: All transactions show up in your wallet  
✅ **Real-time Updates**: Balances and pool info update automatically  

## 🛠️ Setup Instructions

### 1. Start Local Blockchain
```bash
npx hardhat node
```
Keep this running in a separate terminal window.

### 2. Deploy Contracts
```bash
npx hardhat run scripts/deploy-local.ts --network localhost
```

This will:
- Deploy TokenA, TokenB, and TokenSwap contracts
- Add initial liquidity to the pool
- Set up test accounts with tokens
- Show you the contract addresses

### 3. Update Contract Addresses
Copy the contract addresses from the deployment output and update them in `enhanced-trading-interface.html`:
```javascript
const TOKEN_A_ADDRESS = "0x..."; // Replace with your TokenA address
const TOKEN_B_ADDRESS = "0x..."; // Replace with your TokenB address  
const SWAP_ADDRESS = "0x...";    // Replace with your TokenSwap address
```

### 4. Configure MetaMask

#### Add Local Network
- Open MetaMask
- Click network dropdown → "Add Network"
- Use these settings:
  - **Network Name**: Hardhat Local
  - **RPC URL**: http://127.0.0.1:8545
  - **Chain ID**: 31337
  - **Currency Symbol**: ETH

#### Import Test Account
Option 1: Use the deployer account (has tokens and is the owner)
- Copy the address from deployment output
- Import using private key (from your .env file)

Option 2: Use a test account
- Hardhat provides 20 test accounts with ETH
- Pick any account from the node output

### 5. Open Trading Interface
Simply open `enhanced-trading-interface.html` in your browser and start trading!

## 🎮 How to Use

### Connect Wallet
1. Click "🦊 Connect MetaMask"
2. Click "🌐 Add Local Network to MetaMask" (if needed)
3. Click "➕ Add Tokens to Wallet" to see tokens in MetaMask

### Buy Tokens (For Testing)
1. Go to "🛒 Buy Tokens" section
2. Enter amount and click "Get TKNA" or "Get TKNB"
3. Confirm transaction in MetaMask
4. Tokens will appear in your wallet!

### Swap Tokens
1. Select "From" token (TKNA or TKNB)
2. Enter amount to swap
3. See real-time quote with fees
4. Click "🚀 Execute Swap"
5. Confirm transactions in MetaMask (approval + swap)

### Track Fees (Owner Only)
- View "💎 Fee Collection Dashboard"
- See total fees collected from all swaps
- Withdraw fees if you're the contract owner

## 💡 Understanding the System

### Fee Structure
- **Swap Fee**: 0.3% on each trade
- **Fee Distribution**: Collected by the contract owner
- **Fee Calculation**: Deducted from input amount before swap

### Pool Mechanics
- **Liquidity**: Contract holds both tokens for swapping
- **Rate**: 1:1 ratio (1 TKNA = 1 TKNB, minus fees)
- **Slippage**: Fixed rate, no slippage in this simple DEX

### Token Economics
- **TKNA**: DeFi TokenA with 18 decimals
- **TKNB**: DeFi TokenB with 18 decimals
- **Supply**: Unlimited (mintable for testing)
- **Ownership**: Deployer is initial owner of all contracts

## 🔧 Troubleshooting

### MetaMask Issues
- **Wrong Network**: Switch to Hardhat Local (Chain ID: 31337)
- **No ETH**: Use a different test account from Hardhat
- **Pending Transactions**: Reset account in MetaMask settings

### Transaction Failures
- **Insufficient Balance**: Buy more tokens first
- **Insufficient Allowance**: The UI handles approvals automatically
- **Pool Liquidity**: Make sure pool has enough tokens for your swap

### Interface Issues
- **Outdated Addresses**: Redeploy contracts and update addresses
- **Connection Problems**: Refresh page and reconnect MetaMask
- **Balance Not Updating**: Click refresh buttons or wait for auto-refresh

## 🎯 Testing Scenarios

### Basic Trading
1. Buy 100 TKNA tokens
2. Swap 50 TKNA for TKNB
3. Check fee collection (should show ~0.15 TKNA fee)
4. Verify balances in MetaMask

### Fee Collection
1. Perform multiple swaps
2. Check accumulated fees
3. Withdraw fees (owner only)
4. Verify fees transferred to your wallet

### Multi-User Testing
1. Use different MetaMask accounts
2. Give each account some tokens
3. Perform swaps from different accounts
4. See how fees accumulate from all users

## 🚨 Important Notes

- **Local Only**: This works only on your local Hardhat network
- **Test Tokens**: These tokens have no real value
- **Owner Functions**: Only the deployer can withdraw fees and add liquidity
- **Gas Costs**: All transactions use test ETH from Hardhat
- **Persistence**: Data is lost when you restart the Hardhat node

## 🌟 Real-World Comparison

This local setup mimics real DeFi protocols like:
- **Uniswap**: Automated market maker for token swaps
- **SushiSwap**: DEX with fee collection
- **PancakeSwap**: BSC-based DEX with similar mechanics

The main differences:
- **Fixed Rate**: Real DEXs use dynamic pricing (AMM curves)
- **Slippage**: Real swaps have price impact
- **Liquidity Mining**: Real protocols often reward liquidity providers
- **Multiple Pools**: Real DEXs support thousands of token pairs

---

🎉 **Happy Trading!** You now have a complete local DeFi trading environment!
