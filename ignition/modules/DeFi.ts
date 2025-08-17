import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const DeFiModule = buildModule("DeFiModule", (m) => {
  // Deploy TokenA
  const tokenA = m.contract("TokenA");

  // Deploy TokenB
  const tokenB = m.contract("TokenB");

  // Deploy TokenSwap contract with TokenA and TokenB addresses
  const tokenSwap = m.contract("TokenSwap", [tokenA, tokenB]);

  // Return all contracts for easy access
  return { tokenA, tokenB, tokenSwap };
});

export default DeFiModule;
