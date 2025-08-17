import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { TokenA, TokenB, TokenSwap } from "../typechain-types";

describe("DeFi Token Swap", function () {
  let tokenA: TokenA;
  let tokenB: TokenB;
  let tokenSwap: TokenSwap;
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;
  let ownerAddress: string;
  let user1Address: string;
  let user2Address: string;

  const INITIAL_SUPPLY = ethers.parseEther("1000000"); // 1 million tokens
  const SWAP_AMOUNT = ethers.parseEther("1000"); // 1000 tokens for testing

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    user1Address = await user1.getAddress();
    user2Address = await user2.getAddress();

    // Deploy TokenA
    const TokenAFactory = await ethers.getContractFactory("TokenA");
    tokenA = await TokenAFactory.deploy();

    // Deploy TokenB
    const TokenBFactory = await ethers.getContractFactory("TokenB");
    tokenB = await TokenBFactory.deploy();

    // Deploy TokenSwap
    const TokenSwapFactory = await ethers.getContractFactory("TokenSwap");
    tokenSwap = await TokenSwapFactory.deploy(
      await tokenA.getAddress(),
      await tokenB.getAddress()
    );

    // Transfer some tokens to users for testing
    await tokenA.transfer(user1Address, ethers.parseEther("10000"));
    await tokenB.transfer(user1Address, ethers.parseEther("10000"));
    await tokenA.transfer(user2Address, ethers.parseEther("10000"));
    await tokenB.transfer(user2Address, ethers.parseEther("10000"));

    // Add initial liquidity to the swap contract
    await tokenA.approve(await tokenSwap.getAddress(), ethers.parseEther("100000"));
    await tokenB.approve(await tokenSwap.getAddress(), ethers.parseEther("100000"));
    await tokenSwap.addLiquidity(ethers.parseEther("50000"), ethers.parseEther("50000"));
  });

  describe("Token Deployment", function () {
    it("Should deploy TokenA with correct name and symbol", async function () {
      expect(await tokenA.name()).to.equal("DeFi TokenA");
      expect(await tokenA.symbol()).to.equal("TKNA");
      expect(await tokenA.totalSupply()).to.equal(INITIAL_SUPPLY);
      expect(await tokenA.balanceOf(ownerAddress)).to.equal(ethers.parseEther("930000")); // After transfers and liquidity
    });

    it("Should deploy TokenB with correct name and symbol", async function () {
      expect(await tokenB.name()).to.equal("DeFi TokenB");
      expect(await tokenB.symbol()).to.equal("TKNB");
      expect(await tokenB.totalSupply()).to.equal(INITIAL_SUPPLY);
      expect(await tokenB.balanceOf(ownerAddress)).to.equal(ethers.parseEther("930000")); // After transfers and liquidity
    });

    it("Should mint additional tokens (only owner)", async function () {
      const mintAmount = ethers.parseEther("10000");
      await tokenA.mint(user1Address, mintAmount);
      expect(await tokenA.balanceOf(user1Address)).to.equal(ethers.parseEther("20000"));
      
      // Non-owner should not be able to mint
      await expect(
        tokenA.connect(user1).mint(user2Address, mintAmount)
      ).to.be.revertedWithCustomError(tokenA, "OwnableUnauthorizedAccount");
    });
  });

  describe("TokenSwap Deployment", function () {
    it("Should deploy with correct token addresses", async function () {
      expect(await tokenSwap.tokenA()).to.equal(await tokenA.getAddress());
      expect(await tokenSwap.tokenB()).to.equal(await tokenB.getAddress());
      expect(await tokenSwap.swapRate()).to.equal(ethers.parseEther("1")); // 1:1 ratio
    });

    it("Should have initial liquidity", async function () {
      const [balanceA, balanceB] = await tokenSwap.getPoolBalances();
      expect(balanceA).to.equal(ethers.parseEther("50000"));
      expect(balanceB).to.equal(ethers.parseEther("50000"));
    });
  });

  describe("Token Swapping", function () {
    beforeEach(async function () {
      // Approve tokens for swapping
      await tokenA.connect(user1).approve(await tokenSwap.getAddress(), ethers.parseEther("10000"));
      await tokenB.connect(user1).approve(await tokenSwap.getAddress(), ethers.parseEther("10000"));
    });

    it("Should swap TokenA for TokenB correctly", async function () {
      const swapAmount = ethers.parseEther("1000");
      const initialBalanceA = await tokenA.balanceOf(user1Address);
      const initialBalanceB = await tokenB.balanceOf(user1Address);

      // Get quote first
      const [expectedOut, fee] = await tokenSwap.getQuoteAToB(swapAmount);

      // Perform swap
      await expect(tokenSwap.connect(user1).swapAForB(swapAmount))
        .to.emit(tokenSwap, "Swap")
        .withArgs(user1Address, await tokenA.getAddress(), await tokenB.getAddress(), swapAmount, expectedOut, fee);

      // Check balances
      expect(await tokenA.balanceOf(user1Address)).to.equal(initialBalanceA - swapAmount);
      expect(await tokenB.balanceOf(user1Address)).to.equal(initialBalanceB + expectedOut);
    });

    it("Should swap TokenB for TokenA correctly", async function () {
      const swapAmount = ethers.parseEther("1000");
      const initialBalanceA = await tokenA.balanceOf(user1Address);
      const initialBalanceB = await tokenB.balanceOf(user1Address);

      // Get quote first
      const [expectedOut, fee] = await tokenSwap.getQuoteBToA(swapAmount);

      // Perform swap
      await expect(tokenSwap.connect(user1).swapBForA(swapAmount))
        .to.emit(tokenSwap, "Swap")
        .withArgs(user1Address, await tokenB.getAddress(), await tokenA.getAddress(), swapAmount, expectedOut, fee);

      // Check balances
      expect(await tokenB.balanceOf(user1Address)).to.equal(initialBalanceB - swapAmount);
      expect(await tokenA.balanceOf(user1Address)).to.equal(initialBalanceA + expectedOut);
    });

    it("Should calculate fees correctly", async function () {
      const swapAmount = ethers.parseEther("1000");
      const [amountOut, fee] = await tokenSwap.getQuoteAToB(swapAmount);
      
      // Fee should be 0.3% of input
      const expectedFee = (swapAmount * 3000n) / 1000000n;
      expect(fee).to.equal(expectedFee);
      
      // Amount out should be (input - fee) * rate
      const expectedOut = (swapAmount - expectedFee);
      expect(amountOut).to.equal(expectedOut);
    });

    it("Should fail when insufficient liquidity", async function () {
      const largeAmount = ethers.parseEther("100000"); // More than available liquidity
      await tokenA.connect(user1).approve(await tokenSwap.getAddress(), largeAmount);
      
      await expect(
        tokenSwap.connect(user1).swapAForB(largeAmount)
      ).to.be.revertedWith("Insufficient TokenB liquidity");
    });

    it("Should fail when swapping zero amount", async function () {
      await expect(
        tokenSwap.connect(user1).swapAForB(0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });
  });

  describe("Liquidity Management", function () {
    it("Should allow owner to add liquidity", async function () {
      const addAmountA = ethers.parseEther("1000");
      const addAmountB = ethers.parseEther("1000");
      
      await tokenA.approve(await tokenSwap.getAddress(), addAmountA);
      await tokenB.approve(await tokenSwap.getAddress(), addAmountB);
      
      await expect(tokenSwap.addLiquidity(addAmountA, addAmountB))
        .to.emit(tokenSwap, "LiquidityAdded")
        .withArgs(ownerAddress, addAmountA, addAmountB);
      
      const [balanceA, balanceB] = await tokenSwap.getPoolBalances();
      expect(balanceA).to.equal(ethers.parseEther("51000"));
      expect(balanceB).to.equal(ethers.parseEther("51000"));
    });

    it("Should allow owner to remove liquidity", async function () {
      const removeAmountA = ethers.parseEther("1000");
      const removeAmountB = ethers.parseEther("1000");
      
      await expect(tokenSwap.removeLiquidity(removeAmountA, removeAmountB))
        .to.emit(tokenSwap, "LiquidityRemoved")
        .withArgs(ownerAddress, removeAmountA, removeAmountB);
      
      const [balanceA, balanceB] = await tokenSwap.getPoolBalances();
      expect(balanceA).to.equal(ethers.parseEther("49000"));
      expect(balanceB).to.equal(ethers.parseEther("49000"));
    });

    it("Should not allow non-owner to add liquidity", async function () {
      const addAmountA = ethers.parseEther("1000");
      const addAmountB = ethers.parseEther("1000");
      
      await expect(
        tokenSwap.connect(user1).addLiquidity(addAmountA, addAmountB)
      ).to.be.revertedWithCustomError(tokenSwap, "OwnableUnauthorizedAccount");
    });
  });

  describe("Swap Rate Management", function () {
    it("Should allow owner to update swap rate", async function () {
      const newRate = ethers.parseEther("2"); // 1:2 ratio
      
      await expect(tokenSwap.updateSwapRate(newRate))
        .to.emit(tokenSwap, "SwapRateUpdated")
        .withArgs(ethers.parseEther("1"), newRate);
      
      expect(await tokenSwap.swapRate()).to.equal(newRate);
    });

    it("Should not allow non-owner to update swap rate", async function () {
      const newRate = ethers.parseEther("2");
      
      await expect(
        tokenSwap.connect(user1).updateSwapRate(newRate)
      ).to.be.revertedWithCustomError(tokenSwap, "OwnableUnauthorizedAccount");
    });

    it("Should not allow zero swap rate", async function () {
      await expect(
        tokenSwap.updateSwapRate(0)
      ).to.be.revertedWith("Rate must be greater than 0");
    });
  });

  describe("Fee Collection", function () {
    beforeEach(async function () {
      // Perform some swaps to generate fees
      await tokenA.connect(user1).approve(await tokenSwap.getAddress(), ethers.parseEther("10000"));
      await tokenB.connect(user1).approve(await tokenSwap.getAddress(), ethers.parseEther("10000"));
      
      await tokenSwap.connect(user1).swapAForB(ethers.parseEther("1000"));
      await tokenSwap.connect(user1).swapBForA(ethers.parseEther("1000"));
    });

    it("Should collect fees from swaps", async function () {
      expect(await tokenSwap.collectedFeesA()).to.be.gt(0);
      expect(await tokenSwap.collectedFeesB()).to.be.gt(0);
    });

    it("Should allow owner to withdraw fees", async function () {
      const initialBalanceA = await tokenA.balanceOf(ownerAddress);
      const initialBalanceB = await tokenB.balanceOf(ownerAddress);
      
      await tokenSwap.withdrawFees();
      
      expect(await tokenA.balanceOf(ownerAddress)).to.be.gt(initialBalanceA);
      expect(await tokenB.balanceOf(ownerAddress)).to.be.gt(initialBalanceB);
      expect(await tokenSwap.collectedFeesA()).to.equal(0);
      expect(await tokenSwap.collectedFeesB()).to.equal(0);
    });

    it("Should not allow non-owner to withdraw fees", async function () {
      await expect(
        tokenSwap.connect(user1).withdrawFees()
      ).to.be.revertedWithCustomError(tokenSwap, "OwnableUnauthorizedAccount");
    });
  });
});
