import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying DeFi Trader to Local Hardhat Network...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 ETH balance:", ethers.formatEther(balance));

  // Deploy TokenA
  console.log("\n📋 Deploying TokenA...");
  const TokenAFactory = await ethers.getContractFactory("TokenA");
  const tokenA = await TokenAFactory.deploy();
  await tokenA.waitForDeployment();
  const tokenAAddress = await tokenA.getAddress();
  console.log("✅ TokenA deployed to:", tokenAAddress);

  // Deploy TokenB
  console.log("\n📋 Deploying TokenB...");
  const TokenBFactory = await ethers.getContractFactory("TokenB");
  const tokenB = await TokenBFactory.deploy();
  await tokenB.waitForDeployment();
  const tokenBAddress = await tokenB.getAddress();
  console.log("✅ TokenB deployed to:", tokenBAddress);

  // Deploy TokenSwap
  console.log("\n📋 Deploying TokenSwap...");
  const TokenSwapFactory = await ethers.getContractFactory("TokenSwap");
  const tokenSwap = await TokenSwapFactory.deploy(tokenAAddress, tokenBAddress);
  await tokenSwap.waitForDeployment();
  const tokenSwapAddress = await tokenSwap.getAddress();
  console.log("✅ TokenSwap deployed to:", tokenSwapAddress);

  // Set up initial state for testing
  console.log("\n🔧 Setting up initial state...");
  
  // Mint some tokens to deployer for liquidity
  const initialLiquidity = ethers.parseEther("10000"); // 10,000 tokens each
  await tokenA.mint(deployer.address, initialLiquidity);
  await tokenB.mint(deployer.address, initialLiquidity);
  console.log("✅ Minted initial tokens to deployer");

  // Add initial liquidity to the swap contract
  const liquidityAmount = ethers.parseEther("5000"); // 5,000 each for liquidity
  await tokenA.approve(tokenSwapAddress, liquidityAmount);
  await tokenB.approve(tokenSwapAddress, liquidityAmount);
  await tokenSwap.addLiquidity(liquidityAmount, liquidityAmount);
  console.log("✅ Added initial liquidity to swap contract");

  // Create some test accounts and give them tokens
  const testAccounts = await ethers.getSigners();
  console.log("\n👥 Setting up test accounts with tokens...");
  
  for (let i = 1; i < Math.min(5, testAccounts.length); i++) {
    const testAmount = ethers.parseEther("1000"); // 1000 tokens each
    await tokenA.mint(testAccounts[i].address, testAmount);
    await tokenB.mint(testAccounts[i].address, testAmount);
    console.log(`✅ Gave 1000 tokens each to ${testAccounts[i].address}`);
  }

  // Display final information
  console.log("\n🎉 Deployment Complete! Copy these addresses to your HTML file:");
  console.log("═══════════════════════════════════════════════════");
  console.log("TokenA (TKNA):", tokenAAddress);
  console.log("TokenB (TKNB):", tokenBAddress);
  console.log("TokenSwap:   ", tokenSwapAddress);
  console.log("═══════════════════════════════════════════════════");

  // Verify the setup
  const poolBalanceA = await tokenA.balanceOf(tokenSwapAddress);
  const poolBalanceB = await tokenB.balanceOf(tokenSwapAddress);
  const deployerBalanceA = await tokenA.balanceOf(deployer.address);
  const deployerBalanceB = await tokenB.balanceOf(deployer.address);

  console.log("\n📊 Contract Status:");
  console.log("Pool TKNA balance:", ethers.formatEther(poolBalanceA));
  console.log("Pool TKNB balance:", ethers.formatEther(poolBalanceB));
  console.log("Your TKNA balance:", ethers.formatEther(deployerBalanceA));
  console.log("Your TKNB balance:", ethers.formatEther(deployerBalanceB));

  console.log("\n💡 Next Steps:");
  console.log("1. Update the contract addresses in enhanced-trading-interface.html");
  console.log("2. Start Hardhat node: npx hardhat node");
  console.log("3. Open enhanced-trading-interface.html in your browser");
  console.log("4. Connect MetaMask to local network (http://127.0.0.1:8545)");
  console.log("5. Import one of the test accounts or use the deployer account");
  
  console.log("\n🔑 Deployer Private Key (for MetaMask import):");
  console.log("Account:", deployer.address);
  console.log("Note: This is a test account on local network only!");

  return {
    tokenA: tokenAAddress,
    tokenB: tokenBAddress,
    tokenSwap: tokenSwapAddress
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
