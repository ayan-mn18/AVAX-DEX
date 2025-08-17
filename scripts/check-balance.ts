import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(signer.address);
  
  console.log("🏦 Account:", signer.address);
  console.log("💰 AVAX Balance:", ethers.formatEther(balance));
  
  if (balance > 0) {
    console.log("✅ Ready to deploy!");
  } else {
    console.log("❌ Need AVAX from faucet: https://faucet.avax.network/");
  }
}

main().catch(console.error);
