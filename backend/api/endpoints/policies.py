from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from django.db.models import Q
from core.models import InsurancePolicy, Payment, InsuranceClaim, AppUser, StatusLookup, Ticket

router = APIRouter()

# Response Schemas relative to Frontend expectations

class PolicyResponse(BaseModel):
    id: int
    user_id: int
    flight_id: str
    premium_paid: str
    coverage_amount: str
    start_time: str
    end_time: str
    status: str
    contract_address: Optional[str] = None
    # Flight details
    route: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    departure_date: Optional[str] = None
    departure_time_formatted: Optional[str] = None
    arrival_date: Optional[str] = None
    arrival_time_formatted: Optional[str] = None
    flight_duration: Optional[str] = None
    # Ticket details
    ticket_price: Optional[str] = None
    seat_number: Optional[str] = None
    airline: Optional[str] = None
    is_premium_seat: Optional[bool] = None
    # Booking details
    booking_id: Optional[int] = None
    booking_date: Optional[str] = None
    total_paid: Optional[str] = None
    # Passenger details
    passenger: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class TransactionResponse(BaseModel):
    id: str # mixed types
    type: str # "premium" | "payout"
    amount: float
    flight: str
    date: str
    status: str
    txHash: str
    # Detail fields
    route: Optional[str] = None
    paymentMethod: Optional[str] = None
    blockchainNetwork: Optional[str] = None
    gasUsed: Optional[str] = None
    policyId: Optional[str] = None
    # Additional details
    ticket_price: Optional[str] = None
    insurance_price: Optional[str] = None
    total_amount: Optional[str] = None
    # Flight details
    flight_duration: Optional[str] = None
    departure_time: Optional[str] = None
    arrival_time: Optional[str] = None
    departure_date: Optional[str] = None
    # Claim details
    delayReason: Optional[str] = None
    actualDelay: Optional[str] = None
    payoutCalculation: Optional[str] = None
    coverage_amount: Optional[str] = None

@router.get("/plans")
def get_plans():
    return [
        {
            "id": "basic",
            "name": "Basic Protection",
            "price": 15,
            "coverage_percentage": 30,  # 30% of ticket price
            "features": [
                "Delays over 3 hours",
                "30% of ticket price payout",
                "Automatic processing",
            ],
            "delay": "3+ hours",
        },
        {
            "id": "standard",
            "name": "Standard Protection",
            "price": 25,
            "coverage_percentage": 60,  # 60% of ticket price
            "features": [
                "Delays over 2 hours",
                "60% of ticket price payout",
                "Automatic processing",
                "Cancellation coverage",
            ],
            "recommended": True,
            "delay": "2+ hours",
        },
        {
            "id": "premium",
            "name": "Premium Protection",
            "price": 45,
            "coverage_percentage": 100,  # 100% of ticket price
            "features": [
                "Delays over 1 hour",
                "100% of ticket price payout",
                "Automatic processing",
                "Cancellation coverage",
                "Baggage protection",
            ],
            "delay": "1+ hour",
        },
    ]

def calculate_duration(departure, arrival):
    """Calculate flight duration as a string"""
    if not departure or not arrival:
        return "N/A"
    delta = arrival - departure
    hours = int(delta.total_seconds() // 3600)
    minutes = int((delta.total_seconds() % 3600) // 60)
    return f"{hours}h {minutes}m"

@router.get("/mine", response_model=List[PolicyResponse])
def get_my_policies(user_id: int = Query(1, description="User ID for testing")):
    try:
        # User validation
        try:
            user = AppUser.objects.get(user_id=user_id)
        except AppUser.DoesNotExist:
             return [] # Or 404

        # Fetch policies through Booking with related data
        policies = InsurancePolicy.objects.filter(
            booking__user=user
        ).select_related(
            'booking', 
            'booking__flight', 
            'booking__flight__status',
            'status'
        ).prefetch_related('booking__ticket_set', 'booking__payment_set')
        
        response = []
        for p in policies:
            booking = p.booking
            flight = booking.flight
            
            # Get ticket details
            ticket = booking.ticket_set.first()
            ticket_price = str(ticket.price) if ticket else "0.00"
            seat_number = ticket.seatNumber if ticket else "N/A"
            airline = ticket.company if ticket else "Unknown Airline"
            is_premium_seat = ticket.isPremium if ticket else False
            
            # Get payment details
            payment = booking.payment_set.first()
            total_paid = str(payment.amount) if payment else "0.00"
            
            # Calculate duration
            duration = calculate_duration(flight.departureTime, flight.arrivalTime)
            
            response.append({
                "id": p.policyId,
                "user_id": user.user_id,
                "flight_id": f"FL{flight.flightId}",
                "premium_paid": str(p.premium),
                "coverage_amount": str(p.coverageAmount),
                "start_time": flight.departureTime.isoformat() if flight.departureTime else "",
                "end_time": flight.arrivalTime.isoformat() if flight.arrivalTime else "",
                "status": p.status.code.upper(),
                "contract_address": "0x7a3F...8b2C",
                # Flight details
                "route": f"{flight.origin} → {flight.destination}",
                "origin": flight.origin,
                "destination": flight.destination,
                "departure_date": flight.departureTime.strftime("%B %d, %Y") if flight.departureTime else "",
                "departure_time_formatted": flight.departureTime.strftime("%I:%M %p") if flight.departureTime else "",
                "arrival_date": flight.arrivalTime.strftime("%B %d, %Y") if flight.arrivalTime else "",
                "arrival_time_formatted": flight.arrivalTime.strftime("%I:%M %p") if flight.arrivalTime else "",
                "flight_duration": duration,
                # Ticket details
                "ticket_price": ticket_price,
                "seat_number": seat_number,
                "airline": airline,
                "is_premium_seat": is_premium_seat,
                # Booking details
                "booking_id": booking.bookingId,
                "booking_date": booking.bookingDate.strftime("%B %d, %Y at %I:%M %p") if booking.bookingDate else "",
                "total_paid": total_paid,
                # Passenger details
                "passenger": user.name,
                "email": user.email,
                "phone": user.phone
            })
        return response
    except Exception as e:
        print(f"Error fetching policies: {e}")
        import traceback
        traceback.print_exc()
        return []

@router.get("/transactions", response_model=List[TransactionResponse])
def get_my_transactions(user_id: int = Query(1, description="User ID for testing")):
    try:
        try:
            user = AppUser.objects.get(user_id=user_id)
        except AppUser.DoesNotExist:
             return []
             
        transactions = []
        
        # 1. Payments (Premiums)
        payments = Payment.objects.filter(
            booking__user=user
        ).select_related(
            'booking', 
            'booking__flight', 
            'status'
        ).prefetch_related('booking__ticket_set', 'booking__insurancepolicy_set')
        
        for pay in payments:
            booking = pay.booking
            flight = booking.flight
            
            # Get ticket price
            ticket = booking.ticket_set.first()
            ticket_price = str(ticket.price) if ticket else "0.00"
            
            # Get insurance policy and premium
            policy = booking.insurancepolicy_set.first()
            insurance_price = str(policy.premium) if policy else "0.00"
            
            # Calculate duration
            duration = calculate_duration(flight.departureTime, flight.arrivalTime)
            
            # Determine transaction type: if payment method is "Blockchain Payout", it's a payout
            is_payout = pay.paymentMethod == "Blockchain Payout"
            
            transactions.append({
                "id": f"TX-PAY-{pay.paymentId}",
                "type": "payout" if is_payout else "premium",
                "amount": float(pay.amount) if is_payout else -float(pay.amount),  # Positive for payouts, negative for premiums
                "flight": f"FL{flight.flightId}",
                "date": pay.paymentDate.strftime("%B %d, %Y at %I:%M %p") if pay.paymentDate else "",
                "status": pay.status.code,
                "txHash": f"0x{pay.paymentId:04x}...{booking.bookingId:04x}",
                "route": f"{flight.origin} → {flight.destination}",
                "paymentMethod": pay.paymentMethod or "Credit Card",
                "blockchainNetwork": "Ethereum Sepolia",
                "gasUsed": "0.0005 ETH",
                # Additional details
                "ticket_price": ticket_price,
                "insurance_price": insurance_price,
                "total_amount": str(pay.amount),
                # Flight details
                "departure_time": flight.departureTime.strftime("%I:%M %p") if flight.departureTime else "",
                "arrival_time": flight.arrivalTime.strftime("%I:%M %p") if flight.arrivalTime else "",
                "flight_duration": duration,
                "departure_date": flight.departureTime.strftime("%B %d, %Y") if flight.departureTime else "",
                "policyId": str(policy.policyId) if policy else None,
                # Payout specific
                "coverage_amount": str(policy.coverageAmount) if policy and is_payout else None,
                "delayReason": "Flight Delay" if is_payout else None,
            })
            
        # 2. Claims (Payouts)
        claims = InsuranceClaim.objects.filter(
            policy__booking__user=user
        ).select_related(
            'policy', 
            'policy__booking', 
            'policy__booking__flight'
        )
        
        for claim in claims:
            policy = claim.policy
            booking = policy.booking
            flight = booking.flight
            duration = calculate_duration(flight.departureTime, flight.arrivalTime)
            
            transactions.append({
                "id": f"TX-CLM-{claim.claimId}",
                "type": "payout",
                "amount": float(claim.payoutAmount),
                "flight": f"FL{flight.flightId}",
                "date": datetime.now().strftime("%B %d, %Y at %I:%M %p"),
                "status": claim.claimStatus,
                "txHash": f"0x{claim.claimId:04x}...{policy.policyId:04x}",
                "route": f"{flight.origin} → {flight.destination}",
                "policyId": str(policy.policyId),
                "blockchainNetwork": "Ethereum Sepolia",
                "gasUsed": "0.0010 ETH",
                # Additional details
                "insurance_price": str(policy.premium),
                "coverage_amount": str(policy.coverageAmount),
                "delayReason": "Flight Delay",
                "actualDelay": f"{claim.delayDuration} hours" if claim.delayDuration else "Unknown",
                "payoutCalculation": "Automated Smart Contract Payout",
                # Flight details
                "departure_time": flight.departureTime.strftime("%I:%M %p") if flight.departureTime else "",
                "arrival_time": flight.arrivalTime.strftime("%I:%M %p") if flight.arrivalTime else "",
                "flight_duration": duration,
                "departure_date": flight.departureTime.strftime("%B %d, %Y") if flight.departureTime else "",
            })
            
        return transactions
    except Exception as e:
        print(f"Error fetching transactions: {e}")
        import traceback
        traceback.print_exc()
        return []

