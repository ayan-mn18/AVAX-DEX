// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenB
 * @dev Simple ERC20 token for our DeFi swap dApp
 * This will be the second half of our trading pair (TokenA/TokenB)
 */
contract TokenB is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; // 1 million tokens
    
    /**
     * @dev Constructor that gives msg.sender all of existing tokens
     */
    constructor() ERC20("DeFi TokenB", "TKNB") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Mint new tokens (only owner can call this)
     * Useful for testing and adding liquidity
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Burn tokens from caller's balance
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
