import { ethers } from "hardhat";
import { TokenA, TokenB, TokenSwap } from "../typechain-types";

async function main() {
  console.log("🚀 Starting DeFi Token Swap Testing...\n");

  // Get signer (your account)
  const [deployer] = await ethers.getSigners();
  console.log("📍 Testing with account:", deployer.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "AVAX\n");

  // Deploy contracts
  console.log("📋 Deploying contracts...");
  
  const TokenAFactory = await ethers.getContractFactory("TokenA");
  const tokenA = await TokenAFactory.deploy();
  await tokenA.waitForDeployment();
  console.log("✅ TokenA deployed to:", await tokenA.getAddress());

  const TokenBFactory = await ethers.getContractFactory("TokenB");
  const tokenB = await TokenBFactory.deploy();
  await tokenB.waitForDeployment();
  console.log("✅ TokenB deployed to:", await tokenB.getAddress());

  const TokenSwapFactory = await ethers.getContractFactory("TokenSwap");
  const tokenSwap = await TokenSwapFactory.deploy(
    await tokenA.getAddress(),
    await tokenB.getAddress()
  );
  await tokenSwap.waitForDeployment();
  console.log("✅ TokenSwap deployed to:", await tokenSwap.getAddress());

  console.log("\n🔍 Contract Verification:");
  console.log("TokenA name:", await tokenA.name());
  console.log("TokenA symbol:", await tokenA.symbol());
  console.log("TokenB name:", await tokenB.name());
  console.log("TokenB symbol:", await tokenB.symbol());

  // Check initial balances
  const deployerBalanceA = await tokenA.balanceOf(deployer.address);
  const deployerBalanceB = await tokenB.balanceOf(deployer.address);
  console.log("\n💼 Initial Token Balances:");
  console.log("TKNA balance:", ethers.formatEther(deployerBalanceA));
  console.log("TKNB balance:", ethers.formatEther(deployerBalanceB));

  // Add liquidity to the swap pool
  console.log("\n🏊 Adding liquidity to swap pool...");
  const liquidityAmount = ethers.parseEther("10000"); // 10,000 tokens each

  await tokenA.approve(await tokenSwap.getAddress(), liquidityAmount);
  await tokenB.approve(await tokenSwap.getAddress(), liquidityAmount);
  
  await tokenSwap.addLiquidity(liquidityAmount, liquidityAmount);
  console.log("✅ Added 10,000 TKNA and 10,000 TKNB to liquidity pool");

  // Check pool balances
  const [poolBalanceA, poolBalanceB] = await tokenSwap.getPoolBalances();
  console.log("🏊 Pool balances:");
  console.log("Pool TKNA:", ethers.formatEther(poolBalanceA));
  console.log("Pool TKNB:", ethers.formatEther(poolBalanceB));

  // Test a swap
  console.log("\n🔄 Testing token swap...");
  const swapAmount = ethers.parseEther("100"); // Swap 100 TKNA for TKNB

  // Get quote first
  const [expectedOut, fee] = await tokenSwap.getQuoteAToB(swapAmount);
  console.log("💱 Swap Quote:");
  console.log("Input: 100 TKNA");
  console.log("Expected output:", ethers.formatEther(expectedOut), "TKNB");
  console.log("Fee:", ethers.formatEther(fee), "TKNA");

  // Approve and execute swap
  await tokenA.approve(await tokenSwap.getAddress(), swapAmount);
  await tokenSwap.swapAForB(swapAmount);
  console.log("✅ Swap executed successfully!");

  // Check balances after swap
  const newBalanceA = await tokenA.balanceOf(deployer.address);
  const newBalanceB = await tokenB.balanceOf(deployer.address);
  console.log("\n💼 Balances after swap:");
  console.log("TKNA balance:", ethers.formatEther(newBalanceA));
  console.log("TKNB balance:", ethers.formatEther(newBalanceB));

  // Check collected fees
  const collectedFeesA = await tokenSwap.collectedFeesA();
  console.log("\n💰 Collected fees:");
  console.log("TKNA fees:", ethers.formatEther(collectedFeesA));

  console.log("\n🎉 All tests completed successfully!");
  console.log("\n📋 Contract Addresses (save these!):");
  console.log("TokenA:", await tokenA.getAddress());
  console.log("TokenB:", await tokenB.getAddress());
  console.log("TokenSwap:", await tokenSwap.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
