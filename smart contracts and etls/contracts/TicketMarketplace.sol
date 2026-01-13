// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IERC20Decimals.sol";
import "./TicketProvider.sol";

/// @title TicketMarketplace
/// @notice Simple on-chain marketplace example for selling flight tickets.
///         In the real system, your web backend would coordinate booking IDs,
///         but on-chain we mainly care about owner, flightId, and price.
contract TicketMarketplace is Pausable, AccessControl {
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");

    struct Ticket {
        address owner;
        string flightId;
        uint256 price; // paid amount in stable token
        bool refunded;
    }

    IERC20Decimals public immutable token;
    TicketProvider public immutable ticketProvider;
    address public treasury;

    uint256 public nextTicketId = 1;
    mapping(uint256 => Ticket) public tickets;

    event TicketPurchased(
        uint256 indexed ticketId,
        address indexed user,
        string flightId,
        uint256 price
    );

    event TicketRefundRequested(uint256 indexed ticketId, address indexed user);
    event TicketRefunded(
        uint256 indexed ticketId,
        address indexed user,
        uint256 amount
    );

    error NotOwner();
    error AlreadyRefunded();

    constructor(
        IERC20Decimals _token,
        address admin,
        address _treasury,
        TicketProvider _ticketProvider
    ) {
        token = _token;
        treasury = _treasury;
        ticketProvider = _ticketProvider;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(TREASURY_ROLE, _treasury);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /// @notice User buys a ticket for a specific flight.
    function buyTicket(string calldata flightId, uint256 price) external whenNotPaused {
        require(price > 0, "price=0");

        // very light validation that the flight exists
        TicketProvider.FlightInfo memory info = ticketProvider.getFlightInfo(flightId);
        require(info.exists, "unknown flight");

        uint256 ticketId = nextTicketId++;
        tickets[ticketId] = Ticket({
            owner: msg.sender,
            flightId: flightId,
            price: price,
            refunded: false
        });

        require(token.transferFrom(msg.sender, treasury, price), "payment failed");

        emit TicketPurchased(ticketId, msg.sender, flightId, price);
    }

    /// @notice Request a refund (in this example, admin decides amount and executes).
    function requestRefund(uint256 ticketId) external {
        Ticket storage t = tickets[ticketId];
        if (t.owner != msg.sender) revert NotOwner();
        if (t.refunded) revert AlreadyRefunded();

        emit TicketRefundRequested(ticketId, msg.sender);
    }

    /// @notice Admin (treasury) executes the refund.
    function approveRefund(uint256 ticketId, uint256 amount)
        external
        onlyRole(TREASURY_ROLE)
    {
        Ticket storage t = tickets[ticketId];
        require(!t.refunded, "already refunded");
        t.refunded = true;

        require(token.transfer(t.owner, amount), "refund transfer failed");
        emit TicketRefunded(ticketId, t.owner, amount);
    }
}
