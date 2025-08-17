// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TokenSwap
 * @dev A simple DEX for swapping TokenA and TokenB
 * Features:
 * - Fixed rate swapping (1:1 ratio for simplicity)
 * - Liquidity pool management
 * - Basic fee mechanism (0.3% fee)
 */
contract TokenSwap is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable tokenA;
    IERC20 public immutable tokenB;
    
    // Swap rate: 1 TokenA = 1 TokenB (can be modified later)
    uint256 public swapRate = 1e18; // 1:1 ratio (18 decimals)
    
    // Fee rate: 0.3% (3000 basis points out of 1,000,000)
    uint256 public constant FEE_RATE = 3000;
    uint256 public constant FEE_DENOMINATOR = 1000000;
    
    // Collected fees
    uint256 public collectedFeesA;
    uint256 public collectedFeesB;
    
    // Events
    event Swap(address indexed user, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut, uint256 fee);
    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB);
    event SwapRateUpdated(uint256 oldRate, uint256 newRate);
    
    /**
     * @dev Constructor
     * @param _tokenA Address of TokenA contract
     * @param _tokenB Address of TokenB contract
     */
    constructor(address _tokenA, address _tokenB) Ownable(msg.sender) {
        require(_tokenA != address(0) && _tokenB != address(0), "Invalid token addresses");
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }
    
    /**
     * @dev Swap TokenA for TokenB
     * @param amountIn Amount of TokenA to swap
     */
    function swapAForB(uint256 amountIn) external nonReentrant {
        require(amountIn > 0, "Amount must be greater than 0");
        
        // Calculate fee and output amount
        uint256 fee = (amountIn * FEE_RATE) / FEE_DENOMINATOR;
        uint256 amountInAfterFee = amountIn - fee;
        uint256 amountOut = (amountInAfterFee * swapRate) / 1e18;
        
        // Check if contract has enough TokenB
        require(tokenB.balanceOf(address(this)) >= amountOut, "Insufficient TokenB liquidity");
        
        // Update collected fees
        collectedFeesA += fee;
        
        // Transfer TokenA from user to contract
        tokenA.safeTransferFrom(msg.sender, address(this), amountIn);
        
        // Transfer TokenB from contract to user
        tokenB.safeTransfer(msg.sender, amountOut);
        
        emit Swap(msg.sender, address(tokenA), address(tokenB), amountIn, amountOut, fee);
    }
    
    /**
     * @dev Swap TokenB for TokenA
     * @param amountIn Amount of TokenB to swap
     */
    function swapBForA(uint256 amountIn) external nonReentrant {
        require(amountIn > 0, "Amount must be greater than 0");
        
        // Calculate fee and output amount
        uint256 fee = (amountIn * FEE_RATE) / FEE_DENOMINATOR;
        uint256 amountInAfterFee = amountIn - fee;
        uint256 amountOut = (amountInAfterFee * 1e18) / swapRate;
        
        // Check if contract has enough TokenA
        require(tokenA.balanceOf(address(this)) >= amountOut, "Insufficient TokenA liquidity");
        
        // Update collected fees
        collectedFeesB += fee;
        
        // Transfer TokenB from user to contract
        tokenB.safeTransferFrom(msg.sender, address(this), amountIn);
        
        // Transfer TokenA from contract to user
        tokenA.safeTransfer(msg.sender, amountOut);
        
        emit Swap(msg.sender, address(tokenB), address(tokenA), amountIn, amountOut, fee);
    }
    
    /**
     * @dev Add liquidity to the pool (only owner for now)
     * @param amountA Amount of TokenA to add
     * @param amountB Amount of TokenB to add
     */
    function addLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than 0");
        
        tokenA.safeTransferFrom(msg.sender, address(this), amountA);
        tokenB.safeTransferFrom(msg.sender, address(this), amountB);
        
        emit LiquidityAdded(msg.sender, amountA, amountB);
    }
    
    /**
     * @dev Remove liquidity from the pool (only owner)
     * @param amountA Amount of TokenA to remove
     * @param amountB Amount of TokenB to remove
     */
    function removeLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        require(amountA <= tokenA.balanceOf(address(this)), "Insufficient TokenA in pool");
        require(amountB <= tokenB.balanceOf(address(this)), "Insufficient TokenB in pool");
        
        if (amountA > 0) {
            tokenA.safeTransfer(msg.sender, amountA);
        }
        if (amountB > 0) {
            tokenB.safeTransfer(msg.sender, amountB);
        }
        
        emit LiquidityRemoved(msg.sender, amountA, amountB);
    }
    
    /**
     * @dev Update swap rate (only owner)
     * @param newRate New swap rate (18 decimals)
     */
    function updateSwapRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate must be greater than 0");
        uint256 oldRate = swapRate;
        swapRate = newRate;
        emit SwapRateUpdated(oldRate, newRate);
    }
    
    /**
     * @dev Withdraw collected fees (only owner)
     */
    function withdrawFees() external onlyOwner {
        if (collectedFeesA > 0) {
            uint256 feesA = collectedFeesA;
            collectedFeesA = 0;
            tokenA.safeTransfer(msg.sender, feesA);
        }
        
        if (collectedFeesB > 0) {
            uint256 feesB = collectedFeesB;
            collectedFeesB = 0;
            tokenB.safeTransfer(msg.sender, feesB);
        }
    }
    
    /**
     * @dev Get quote for swapping TokenA to TokenB
     * @param amountIn Amount of TokenA
     * @return amountOut Amount of TokenB after fees
     * @return fee Fee amount in TokenA
     */
    function getQuoteAToB(uint256 amountIn) external view returns (uint256 amountOut, uint256 fee) {
        fee = (amountIn * FEE_RATE) / FEE_DENOMINATOR;
        uint256 amountInAfterFee = amountIn - fee;
        amountOut = (amountInAfterFee * swapRate) / 1e18;
    }
    
    /**
     * @dev Get quote for swapping TokenB to TokenA
     * @param amountIn Amount of TokenB
     * @return amountOut Amount of TokenA after fees
     * @return fee Fee amount in TokenB
     */
    function getQuoteBToA(uint256 amountIn) external view returns (uint256 amountOut, uint256 fee) {
        fee = (amountIn * FEE_RATE) / FEE_DENOMINATOR;
        uint256 amountInAfterFee = amountIn - fee;
        amountOut = (amountInAfterFee * 1e18) / swapRate;
    }
    
    /**
     * @dev Get pool balances
     * @return balanceA TokenA balance in pool
     * @return balanceB TokenB balance in pool
     */
    function getPoolBalances() external view returns (uint256 balanceA, uint256 balanceB) {
        balanceA = tokenA.balanceOf(address(this));
        balanceB = tokenB.balanceOf(address(this));
    }
}
