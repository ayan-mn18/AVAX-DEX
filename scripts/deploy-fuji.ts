import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Simple Fuji Deployment (Lower Gas)...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 AVAX balance:", ethers.formatEther(balance));

  if (balance < ethers.parseEther("0.05")) {
    console.log("❌ Need at least 0.05 AVAX to deploy. Current:", ethers.formatEther(balance));
    console.log("💡 Try these faucets:");
    console.log("   🔗 https://faucets.chain.link/fuji");
    console.log("   🔗 https://www.alchemy.com/faucets/avalanche-fuji");
    console.log("   🔗 Discord: https://discord.gg/RwXY7P6 (type .faucet <address>)");
    return;
  }

  // Deploy only TokenA first (cheapest test)
  console.log("\n📋 Deploying TokenA only (test deployment)...");
  
  const TokenAFactory = await ethers.getContractFactory("TokenA");
  const tokenA = await TokenAFactory.deploy();
  await tokenA.waitForDeployment();
  
  const tokenAAddress = await tokenA.getAddress();
  console.log("✅ TokenA deployed to:", tokenAAddress);
  
  // Verify it works
  const name = await tokenA.name();
  const symbol = await tokenA.symbol();
  const deployerBalance = await tokenA.balanceOf(deployer.address);
  
  console.log("\n🔍 Token Details:");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Your balance:", ethers.formatEther(deployerBalance));
  
  // Check remaining AVAX
  const newBalance = await ethers.provider.getBalance(deployer.address);
  const gasUsed = balance - newBalance;
  console.log("\n💸 Gas used:", ethers.formatEther(gasUsed), "AVAX");
  console.log("💰 Remaining:", ethers.formatEther(newBalance), "AVAX");
  
  console.log("\n🎉 Test deployment successful!");
  console.log("🔗 View on Snowtrace:", `https://testnet.snowtrace.io/address/${tokenAAddress}`);
  
  // If we have enough AVAX left, deploy the rest
  if (newBalance > ethers.parseEther("0.1")) {
    console.log("\n🚀 Enough AVAX remaining, deploying full DEX...");
    
    const TokenBFactory = await ethers.getContractFactory("TokenB");
    const tokenB = await TokenBFactory.deploy();
    await tokenB.waitForDeployment();
    console.log("✅ TokenB deployed to:", await tokenB.getAddress());

    const TokenSwapFactory = await ethers.getContractFactory("TokenSwap");
    const tokenSwap = await TokenSwapFactory.deploy(tokenAAddress, await tokenB.getAddress());
    await tokenSwap.waitForDeployment();
    console.log("✅ TokenSwap deployed to:", await tokenSwap.getAddress());
    
    console.log("\n🎊 Full DEX deployed successfully!");
    console.log("📋 Contract Addresses:");
    console.log("TokenA:", tokenAAddress);
    console.log("TokenB:", await tokenB.getAddress());
    console.log("TokenSwap:", await tokenSwap.getAddress());
  } else {
    console.log("\n💡 Get more AVAX to deploy the full DEX (TokenB + TokenSwap)");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
