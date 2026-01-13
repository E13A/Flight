# Technical Report: FlightGuard Decentralized Insurance Platform

## 1. Frontend Architecture

### Overview
The frontend is a modern, responsive web application built with **Next.js 16** and **React 19**, designed to provide a seamless user experience for booking flights and purchasing decentralized delay insurance. It leverages **Tailwind CSS** for styling and **Framer Motion** (via `motion`) for smooth animations.

### Key Technologies
- **Framework**: Next.js 16 (on React 19)
- **Styling**: Tailwind CSS with custom refined color palettes (Slate, Blue, Dark Mode support).
- **State Management**: React Query (`@tanstack/react-query`) for efficient server state handling and caching.
- **Micro-interactions**: Lucide React for icons, custom 3D elements (`ThreeScene`) for visual engagement.
- **Language**: JavaScript/JSX (with some TypeScript definitions available in the environment).

### User Interface & Experience
The UI focuses on trust and ease of use. Key sections include:
- **Hero Section**: Features a dynamic 3D background and clear Call-to-Action (CTA) for "Search Flights" and "Learn About Insurance".
- **Flight Search Widget**: A central component allowing users to search by origin, destination, and date.
- **Bento Grid Features**: Visually appealing grid highlighting key value propositions: "Automatic Payouts", "Lightning Fast", "Global Coverage", and "Transparent & Trustless".
- **Booking Flow**: A step-by-step wizard (Search -> Booking -> Payment) that integrates insurance selection directly into the checkout process.

### Components
- **`ThreeScene`**: Renders a 3D globe/network visualization in the background to emphasize global connectivity and blockchain technology.
- **`FlightSearchWidget`**: Handles user input for flight queries.
- **`Header` / `Footer`**: Consistent navigation and branding.
- **`AuthProvider`**: Manages user authentication state ensuring secure access to booking history.

*(Refer to Images 0, 1, 2 for UI mockups)*
![Landing Page](uploaded_image_0_1765913369413.png)
![Booking Flow](uploaded_image_1_1765913369413.png)
![Insurance Options](uploaded_image_2_1765913369413.png)

---

## 2. Backend Architecture

### Overview
The backend is a hybrid robust system utilizing **FastAPI** for high-performance API endpoints and potential **Django** components for ORM/Admin capabilities. It exposes a RESTful API to manage flight data, bookings, and insurance policies.

### Key Technologies
- **API Framework**: FastAPI (high concurrency, auto-docs).
- **Database Interaction**: SQLAlchemy / Django ORM (implied by `manage.py` presence).
- **Database**: PostgreSQL (`psycopg2-binary`).
- **Blockchain Integration**: `Web3.py` for interacting with Ethereum-compatible networks.

### API Structure (`/api`)
The API is modularized into several routers:
- **`/flights`**: Handles searching and retrieving flight schedules and status.
- **`/bookings`**: Manages user flight reservations.
- **`/policies`**: Handles the creation and management of insurance policies.
- **`/auth`**: Manages user authentication and tokens (`pyjwt`).

### Logic
The backend serves as the bridge between the off-chain booking data and the on-chain insurance logic. It verifies flight statuses and can trigger or validate oracle updates.

---

## 3. Smart Contracts

### Overview
The core value proposition is powered by a set of Solidity smart contracts deployed on an Ethereum-compatible EVM chain. These contracts ensure trustless, automatic payouts based on parametric triggers (flight delay duration).

### Key Technologies
- **Language**: Solidity `^0.8.20`.
- **Framework**: Hardhat.
- **Standards**: OpenZeppelin (AccessControl, Pausable, ERC20).

### Core Contracts

#### `UserDelayInsurance.sol`
The central contract governing the insurance logic.
- **Policy Creation**: The `buyPolicy` function allows users to purchase protection for a specific flight `ticketId` and `bookingId`. It locks the premium in the contract.
- **Payout Logic**: The `settlePolicy` function is called by a designated Oracle (`ORACLE_ROLE`). If `actualDelayMinutes` exceeds the `delayThreshold`, the contract automatically payouts the user.
- **State Management**: Tracks policy status (`Active`, `PaidOut`, `NotTriggered`, `Refunded`).

#### `CompanyFunding.sol`
Manages the liquidity pools funded by airlines or insurance providers to pay out claims.

#### `TicketProvider.sol` & `TicketMarketplace.sol`
Manages the valid flight tickets and inventory on-chain, ensuring policies are only bought for valid tickets.

### Security Features
- **Role-Based Access Control**: `DEFAULT_ADMIN_ROLE` for administrative tasks, `ORACLE_ROLE` for data feeds.
- **Pausability**: Contracts can be paused in case of emergency.
- **Checks-Effects-Interactions**: Followed in `buyPolicy` to prevent reentrancy (though ReentrancyGuard is not explicitly seen, state changes happen before transfers).

---

## 4. ETL (Extract, Transform, Load) Pipeline

### Overview
The ETL system is responsible for indexing on-chain events and syncing them with the off-chain database to provide a seamless user experience (e.g., showing "Active Policy" in the dashboard without querying the chain constantly).

### Key Technologies
- **Language**: Python.
- **Library**: `Web3.py` for blockchain connection.
- **database**: SQLAlchemy for persistence.

### Components

#### `listener.py`
A robust background service that monitors the blockchain for events.
- **Block Polling**: Continuously polls for new blocks (`time.sleep(3)` loop).
- **Event Decoding**: Uses contract ABIs to decode logs from the `UserDelayInsurance` and other contracts.
- **Duplication Handling**: Checks for existing transaction hashes to prevent duplicate entries.

#### `mapper.py`
Transforms raw blockchain event data (hex logs) into structured database models (`OnchainEvent`) for easy querying and analysis.

#### Data Flow
1. **Listen**: `listener.py` detects a `PolicyCreated` or `PolicySettled` event.
2. **Decode**: The event data (premium, delay mins, payout) is decoded.
3. **Persist**: Data is stored in the Postgres database.
4. **Serve**: The Frontend can query the Backend to show the latest policy status instantly.

---

*(Security and Database sections to be completed by respective teams)*
