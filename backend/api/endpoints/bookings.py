from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from core.models import Booking, Flight, AppUser, StatusLookup, Ticket, Payment, InsurancePolicy
from loguru import logger
import os

router = APIRouter()

# Check if blockchain is enabled
BLOCKCHAIN_ENABLED = os.environ.get('BLOCKCHAIN_ENABLED', 'False') == 'True'
print(f"⚙️ STARTUP: BLOCKCHAIN_ENABLED env={os.environ.get('BLOCKCHAIN_ENABLED')}, result={BLOCKCHAIN_ENABLED}")  # DEBUG

# Insurance plan configurations - percentage-based coverage
INSURANCE_PLANS = {
    "basic": {
        "price": 15, 
        "coverage_percentage": 0.30,  # 30% of ticket price
        "threshold": 180  # 3 hours
    },
    "standard": {
        "price": 25, 
        "coverage_percentage": 0.60,  # 60% of ticket price
        "threshold": 120  # 2 hours
    },
    "premium": {
        "price": 45, 
        "coverage_percentage": 1.00,  # 100% of ticket price
        "threshold": 60  # 1 hour
    },
}

class CreateBookingRequest(BaseModel):
    user_id: int
    flight_id: int
    with_insurance: bool
    insurance_plan_id: Optional[str] = None  # "basic", "standard", "premium"

@router.post("/")
def create_booking(request: CreateBookingRequest):
    print(f"🎫 BOOKING REQUEST: user={request.user_id}, flight={request.flight_id}, insurance={request.with_insurance}, plan={request.insurance_plan_id}")  # DEBUG
    
    # 1. Validate inputs
    try:
        user = AppUser.objects.get(user_id=request.user_id)
        flight = Flight.objects.get(flightId=request.flight_id)
    except AppUser.DoesNotExist:
        raise HTTPException(status_code=404, detail="User not found")
    except Flight.DoesNotExist:
        raise HTTPException(status_code=404, detail="Flight not found")

    # 2. Get Statuses (Case insensitive fallback)
    try:
        confirmed = StatusLookup.objects.filter(code__iexact='Confirmed', statusType='booking').first()
        if not confirmed:
             confirmed = StatusLookup.objects.create(code='Confirmed', statusType='booking')
             
        completed = StatusLookup.objects.filter(code__iexact='Completed', statusType='payment').first()
        if not completed:
             completed = StatusLookup.objects.create(code='Completed', statusType='payment')

        active_policy = StatusLookup.objects.filter(code__iexact='Active', statusType='policy').first()
        if not active_policy:
             active_policy = StatusLookup.objects.create(code='Active', statusType='policy')

    except Exception as e:
        # Fallback for dev if seed didn't run or different naming
        raise HTTPException(status_code=500, detail=f"System configuration error: {e}")

    # 3. Get insurance plan details if insurance is requested
    insurance_premium = 0
    insurance_coverage = 0
    delay_threshold = 180  # Default 3 hours
    
    if request.with_insurance and request.insurance_plan_id:
        plan = INSURANCE_PLANS.get(request.insurance_plan_id)
        if plan:
            insurance_premium = plan["price"]
            # Calculate coverage as percentage of ticket price
            # Flight model has no price field, use default base price
            ticket_price = 250.00  # Default ticket price
            insurance_coverage = ticket_price * plan["coverage_percentage"]
            delay_threshold = plan["threshold"]
        else:
            # Default to standard if plan not found
            insurance_premium = 25
            ticket_price = 250.00
            insurance_coverage = ticket_price * 0.60  # 60% of ticket
            delay_threshold = 120

    # 4. Create Booking
    booking = Booking.objects.create(
        user=user,
        flight=flight,
        bookingDate=datetime.now(),
        status=confirmed
    )

    # 5. Create Ticket
    ticket = Ticket.objects.create(
        booking=booking,
        seatNumber="12A", # Placeholder logic
        company="Global Air",
        price=250.00,
        issueDate=datetime.now(),
        isPremium=False
    )

    # 6. Create Payment
    total_amount = 250.00 # Base Fare
    if request.with_insurance:
        total_amount += insurance_premium
    
    Payment.objects.create(
        booking=booking,
        amount=total_amount,
        paymentMethod="Credit Card",
        paymentDate=datetime.now(),
        status=completed
    )

    # 7. Create Insurance (if requested)
    policy_id = None
    blockchain_tx_hash = None
    blockchain_policy_id = None
    
    if request.with_insurance:
        # Create database policy
        policy = InsurancePolicy.objects.create(
            booking=booking,
            coverageAmount=insurance_coverage,
            premium=insurance_premium,
            status=active_policy
        )
        policy_id = policy.policyId
        
        # 8. NEW: Call blockchain smart contract
        if BLOCKCHAIN_ENABLED:
            print(f"🔗 BLOCKCHAIN_ENABLED={BLOCKCHAIN_ENABLED}")  # DEBUG
            try:
                from blockchain.contract_loader import (
                    get_insurance_contract, 
                    get_default_account,
                    w3
                )
                
                print("📦 Blockchain modules imported successfully")  # DEBUG
                
                contract = get_insurance_contract()
                account = get_default_account()
                
                print(f"📍 Contract: {contract is not None}, Account: {account}")  # DEBUG
                
                if contract and account and w3:
                    # Convert amounts to Wei (blockchain format)
                    premium_wei = w3.to_wei(insurance_premium, 'ether')
                    payout_wei = w3.to_wei(insurance_coverage, 'ether')
                    
                    # For demo: use a fixed flight ID that we know exists
                    # In production, flights would be properly synced between DB and blockchain
                    demo_flight_id = "DEMO_FLIGHT"
                    
                    print(f"💰 Calling buyPolicy: flight={demo_flight_id} (DB: {flight.flightId}), premium={premium_wei}, payout={payout_wei}")  # DEBUG
                    
                    # Step 1: Approve insurance contract to spend tokens (ERC20 approval)
                    from blockchain.contract_loader import get_token_contract
                    token_contract = get_token_contract()
                    if token_contract:
                        print("🔓 Approving token spend...")
                        approve_tx = token_contract.functions.approve(
                            contract.address,  # spender (insurance contract)
                            premium_wei        # amount to approve
                        ).transact({'from': account})
                        w3.eth.wait_for_transaction_receipt(approve_tx)
                        print("✅ Token approval granted!")
                    
                    # Step 2: Call buyPolicy on smart contract
                    print("📝 Calling buyPolicy on smart contract...")
                    tx_hash = contract.functions.buyPolicy(
                        demo_flight_id,          # flightId - using demo flight for now
                        ticket.ticketId,         # ticketId
                        booking.bookingId,       # bookingId  
                        delay_threshold,         # delayThresholdMinutes
                        premium_wei,             # premiumAmount
                        payout_wei               # payoutAmount
                    ).transact({'from': account})
                    
                    # Wait for transaction receipt
                    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
                    
                    # Get blockchain policy ID from event logs
                    event = contract.events.PolicyCreated().process_receipt(receipt)
                    if event:
                        blockchain_policy_id = event[0]['args']['policyId']
                    
                    blockchain_tx_hash = tx_hash.hex()
                    
                    # Save blockchain data to database
                    policy.blockchainPolicyId = blockchain_policy_id
                    policy.blockchainTxHash = blockchain_tx_hash
                    policy.save()
                    print(f"💾 Saved blockchain IDs to database!")  # DEBUG
                    
                    print(f"✅ SUCCESS! TX={blockchain_tx_hash}, PolicyID={blockchain_policy_id}")  # DEBUG
                    logger.info(f"✅ Blockchain policy created: TX={blockchain_tx_hash}, PolicyID={blockchain_policy_id}")
                else:
                    print(f"⚠️ Missing: contract={contract is not None}, account={account}, w3={w3 is not None}")  # DEBUG
                    logger.warning("⚠️ Blockchain not available, policy saved to database only")
                    
            except Exception as e:
                # Blockchain integration failed - policy still in database
                print(f"❌ EXCEPTION: {type(e).__name__}: {e}")  # DEBUG
                logger.error(f"❌ Blockchain integration failed: {e}")
                logger.warning(f"   Policy {policy_id} saved to database only (graceful fallback)")

    return {
        "status": "success",
        "booking_id": booking.bookingId,
        "policy_id": policy_id,
        "blockchain_tx_hash": blockchain_tx_hash,
        "blockchain_policy_id": blockchain_policy_id,
        "message": "Booking confirmed successfully" + 
                   (" with blockchain insurance" if blockchain_tx_hash else "")
    }
