// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./IERC20Decimals.sol";
import "./TicketProvider.sol";
import "./CompanyFunding.sol";

/// @title UserDelayInsurance
/// @notice Core parametric insurance contract between platform and user.
///         Policies are funded by airline/company pools via CompanyFunding.
///         Delay is confirmed by an oracle; payout executes automatically.
contract UserDelayInsurance is Pausable, AccessControl {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    enum PolicyStatus {
        Active,
        PaidOut,
        NotTriggered,
        Refunded,
        Cancelled
    }

    struct Policy {
        address insured;
        string flightId;
        uint256 ticketId;
        uint256 bookingId;        // Links to off-chain Booking table
        uint64 departureTime;
        uint64 createdAt;
        uint64 delayThreshold;    // minutes
        uint256 premium;
        uint256 payoutAmount;
        PolicyStatus status;
    }

    IERC20Decimals public immutable token;
    TicketProvider public immutable ticketProvider;
    CompanyFunding public immutable companyFunding;

    // policyId => Policy
    mapping(uint256 => Policy) public policies;
    uint256 public nextPolicyId = 1;

    event PolicyCreated(
        uint256 indexed policyId,
        address indexed insured,
        string flightId,
        uint256 ticketId,
        uint256 bookingId,
        uint256 premium,
        uint256 payoutAmount,
        uint64 delayThreshold,
        uint64 departureTime
    );

    event PolicySettled(
        uint256 indexed policyId,
        PolicyStatus status,
        uint64 actualDelayMinutes,
        uint256 payoutAmount
    );

    event PolicyRefunded(
        uint256 indexed policyId,
        address indexed insured,
        uint256 amount
    );

    error NotOracle();
    error InvalidPolicy();
    error InvalidFlight();
    error AlreadyFinalized();

    constructor(
        IERC20Decimals _token,
        address admin,
        TicketProvider _ticketProvider,
        CompanyFunding _companyFunding,
        address oracle
    ) {
        token = _token;
        ticketProvider = _ticketProvider;
        companyFunding = _companyFunding;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ORACLE_ROLE, oracle);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /// @notice User buys a parametric delay policy for a flight + ticket + booking.
    /// @param flightId Flight identifier (e.g., AZ123).
    /// @param ticketId On-chain ticket identifier from TicketMarketplace.
    /// @param bookingId Off-chain booking ID (from Booking table).
    /// @param delayThresholdMinutes Threshold in minutes for payout.
    /// @param premiumAmount Premium user pays.
    /// @param payoutAmount Payout if delay >= threshold.
    function buyPolicy(
        string calldata flightId,
        uint256 ticketId,
        uint256 bookingId,
        uint64 delayThresholdMinutes,
        uint256 premiumAmount,
        uint256 payoutAmount
    ) external whenNotPaused {
        require(premiumAmount > 0, "premium=0");
        require(payoutAmount > 0, "payout=0");
        require(delayThresholdMinutes > 0, "threshold=0");

        TicketProvider.FlightInfo memory info = ticketProvider.getFlightInfo(flightId);
        if (!info.exists) revert InvalidFlight();

        uint256 policyId = nextPolicyId++;
        uint64 departureTime = info.departureTime;
        uint64 createdAt = uint64(block.timestamp);

        policies[policyId] = Policy({
            insured: msg.sender,
            flightId: flightId,
            ticketId: ticketId,
            bookingId: bookingId,
            departureTime: departureTime,
            createdAt: createdAt,
            delayThreshold: delayThresholdMinutes,
            premium: premiumAmount,
            payoutAmount: payoutAmount,
            status: PolicyStatus.Active
        });

        // transfer premium from user to platform (treasury could be another address)
        require(token.transferFrom(msg.sender, address(this), premiumAmount), "premium transfer failed");

        emit PolicyCreated(
            policyId,
            msg.sender,
            flightId,
            ticketId,
            bookingId,
            premiumAmount,
            payoutAmount,
            delayThresholdMinutes,
            departureTime
        );
    }

    /// @notice Oracle settles a policy based on observed delay in minutes.
    /// @param policyId Policy to settle.
    /// @param actualDelayMinutes Observed delay.
    function settlePolicy(uint256 policyId, uint64 actualDelayMinutes)
        external
        onlyRole(ORACLE_ROLE)
    {
        Policy storage p = policies[policyId];
        if (p.insured == address(0)) revert InvalidPolicy();
        if (p.status != PolicyStatus.Active) revert AlreadyFinalized();

        TicketProvider.FlightInfo memory info = ticketProvider.getFlightInfo(p.flightId);
        if (!info.exists) revert InvalidFlight();
        address company = info.company;

        uint256 payout;
        PolicyStatus newStatus;
        if (actualDelayMinutes >= p.delayThreshold) {
            payout = p.payoutAmount;
            newStatus = PolicyStatus.PaidOut;
            // request compensation from company's funding pool directly to user
            companyFunding.payCompensation(company, p.insured, policyId, payout);
        } else {
            payout = 0;
            newStatus = PolicyStatus.NotTriggered;
        }

        p.status = newStatus;

        emit PolicySettled(policyId, newStatus, actualDelayMinutes, payout);
    }

    /// @notice Admin can refund a policy premium off-chain (e.g., when booking is cancelled).
    function refundPolicy(uint256 policyId, uint256 amount)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        Policy storage p = policies[policyId];
        if (p.insured == address(0)) revert InvalidPolicy();
        if (p.status != PolicyStatus.Active) revert AlreadyFinalized();

        p.status = PolicyStatus.Refunded;
        require(token.transfer(p.insured, amount), "refund transfer failed");

        emit PolicyRefunded(policyId, p.insured, amount);
    }
}
