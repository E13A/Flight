// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title TicketProvider
/// @notice Manages registration of ticket companies and flights. Acts as on-chain registry
///         to link flight identifiers to airline/company addresses.
contract TicketProvider is AccessControl {
    bytes32 public constant COMPANY_ROLE = keccak256("COMPANY_ROLE");

    struct Company {
        string name;
        string metadataURI;
        bool active;
    }

    struct FlightInfo {
        address company;
        uint64 departureTime;
        bool exists;
    }

    // flightKey = keccak256(bytes(flightId))
    mapping(bytes32 => FlightInfo) public flights;
    mapping(address => Company) public companies;

    event CompanyRegistered(address indexed company, string name, string metadataURI);
    event CompanyStatusUpdated(address indexed company, bool active);
    event FlightRegistered(bytes32 indexed flightKey, string flightId, address indexed company, uint64 departureTime);

    error InvalidInput();
    error NotCompany();

    constructor(address admin) {
        require(admin != address(0), "Invalid admin");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /// @notice Register a new ticket company (airline, OTA, etc.).
    function registerCompany(address company, string calldata name, string calldata metadataURI)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        if (company == address(0)) revert InvalidInput();
        companies[company] = Company({
            name: name,
            metadataURI: metadataURI,
            active: true
        });
        _grantRole(COMPANY_ROLE, company);
        emit CompanyRegistered(company, name, metadataURI);
    }

    /// @notice Enable/disable a company.
    function setCompanyStatus(address company, bool active)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        companies[company].active = active;
        emit CompanyStatusUpdated(company, active);
    }

    /// @notice Register a flight for a given company.
    function registerFlight(string calldata flightId, uint64 departureTime)
        external
        onlyRole(COMPANY_ROLE)
    {
        if (bytes(flightId).length == 0) revert InvalidInput();
        if (departureTime == 0) revert InvalidInput();

        bytes32 key = keccak256(bytes(flightId));
        flights[key] = FlightInfo({
            company: msg.sender,
            departureTime: departureTime,
            exists: true
        });

        emit FlightRegistered(key, flightId, msg.sender, departureTime);
    }

    /// @notice Get full FlightInfo for a given flightId.
    function getFlightInfo(string calldata flightId)
        external
        view
        returns (FlightInfo memory)
    {
        bytes32 key = keccak256(bytes(flightId));
        return flights[key];
    }

    /// @notice Get company address for a given flightId.
    function getFlightCompany(string calldata flightId)
        external
        view
        returns (address)
    {
        bytes32 key = keccak256(bytes(flightId));
        return flights[key].company;
    }

    /// @notice Get departure time for a given flightId.
    function getFlightDepartureTime(string calldata flightId)
        external
        view
        returns (uint64)
    {
        bytes32 key = keccak256(bytes(flightId));
        return flights[key].departureTime;
    }
}
