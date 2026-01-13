// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IERC20Decimals
/// @dev Minimal ERC20 interface extended with decimals() for use with stablecoins.
interface IERC20Decimals {
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
