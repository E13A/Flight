// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IERC20Decimals.sol";

/// @title CompanyFunding
/// @notice Manages per-company funding pools backing parametric delay compensations.
///         Only authorized insurance contracts can instruct payments.
///         Funds belong to each company; they can top up or withdraw excess liquidity.
contract CompanyFunding is AccessControl {
    bytes32 public constant INSURANCE_ROLE = keccak256("INSURANCE_ROLE");

    IERC20Decimals public immutable token;

    // company => funding balance (in token units)
    mapping(address => uint256) public companyBalances;

    event CompanyFunded(address indexed company, uint256 amount);
    event CompanyWithdrawn(address indexed company, uint256 amount);
    event CompensationPaid(
        address indexed company,
        address indexed user,
        uint256 indexed policyId,
        uint256 amount
    );

    error NotInsurance();
    error InsufficientBalance();

    constructor(IERC20Decimals _token, address admin) {
        token = _token;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /// @notice Grant an insurance contract permission to pay out compensations.
    function grantInsuranceRole(
        address insurance
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(INSURANCE_ROLE, insurance);
    }

    /// @notice Deposit funds into company's pool.
    function fundCompany(uint256 amount) external {
        require(amount > 0, "amount=0");
        companyBalances[msg.sender] += amount;
        require(
            token.transferFrom(msg.sender, address(this), amount),
            "transfer failed"
        );
        emit CompanyFunded(msg.sender, amount);
    }

    /// @notice Withdraw unused funds from company's pool.
    function withdrawCompany(uint256 amount) external {
        if (companyBalances[msg.sender] < amount) revert InsufficientBalance();
        companyBalances[msg.sender] -= amount;
        require(token.transfer(msg.sender, amount), "transfer failed");
        emit CompanyWithdrawn(msg.sender, amount);
    }

    /// @notice Called by insurance contract to pay out compensation to user.
    function payCompensation(
        address company,
        address user,
        uint256 policyId,
        uint256 amount
    ) external onlyRole(INSURANCE_ROLE) {
        if (companyBalances[company] < amount) revert InsufficientBalance();
        companyBalances[company] -= amount;
        require(token.transfer(user, amount), "transfer failed");
        emit CompensationPaid(company, user, policyId, amount);
    }
}
