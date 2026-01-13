"""
Oracle Simulator for Flight Delay Insurance

This script simulates the oracle that monitors flights and settles insurance claims.
Run this to trigger automatic payouts when flights are delayed.

Usage:
    python oracle_simulator.py --flight-id 1 --delay 240  # 4 hours delay
    python oracle_simulator.py --auto  # Auto-monitor all flights
"""

import os
import sys
import django
from pathlib import Path

# Setup Django
sys.path.insert(0, str(Path(__file__).parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import Flight, InsurancePolicy, StatusLookup
from blockchain.contract_loader import get_insurance_contract, get_default_account, w3, load_deployed_addresses
from loguru import logger
import argparse
from datetime import datetime

def settle_policy_on_chain(policy, delay_minutes):
    """
    Settle an insurance policy on the blockchain.
    
    Args:
        policy: InsurancePolicy model instance
        delay_minutes: Actual delay in minutes
    """
    try:
        contract = get_insurance_contract()
        
        # Get oracle account (Account #1 from Hardhat)
        addresses = load_deployed_addresses()
        oracle_address = addresses.get('oracle')
        
        if not contract or not oracle_address or not w3:
            logger.error("❌ Blockchain not available")
            return False
        
        # Get blockchain policy ID from database (CRITICAL!)
        blockchain_policy_id = policy.blockchainPolicyId
        
        if not blockchain_policy_id:
            logger.error(f"❌ Policy {policy.policyId} has no blockchain policy ID - was not created on blockchain!")
            return False
        
        logger.info(f"🔍 Settling blockchain policy {blockchain_policy_id} (DB policy {policy.policyId}) with {delay_minutes} minutes delay...")
        
        # Call settlePolicy on smart contract
        tx_hash = contract.functions.settlePolicy(
            blockchain_policy_id,  # Use BLOCKCHAIN policy ID, not database ID!
            delay_minutes
        ).transact({'from': oracle_address})
        
        # Wait for transaction
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        # Check if successful
        if receipt['status'] == 1:
            logger.info(f"✅ Policy settled successfully!")
            logger.info(f"   Transaction: {tx_hash.hex()}")
            logger.info(f"   Gas used: {receipt['gasUsed']}")
            
            # Update database
            claimed_status = StatusLookup.objects.filter(
                code='Claimed', 
                statusType='policy'
            ).first()
            
            if not claimed_status:
                claimed_status = StatusLookup.objects.create(
                    code='Claimed',
                    statusType='policy'
                )
            
            policy.status = claimed_status
            policy.save()
            
            # Create payout payment record so user can see it in transactions
            from core.models import Payment
            from datetime import datetime
            
            completed_status = StatusLookup.objects.filter(
                code='Completed',
                statusType='payment'
            ).first()
            
            if not completed_status:
                completed_status = StatusLookup.objects.create(
                    code='Completed',
                    statusType='payment'
                )
            
            Payment.objects.create(
                booking=policy.booking,
                amount=policy.coverageAmount,
                paymentMethod='Blockchain Payout',
                paymentDate=datetime.now(),
                status=completed_status
            )
            
            logger.info(f"✅ Database updated: Policy {policy.policyId} marked as Claimed")
            logger.info(f"💰 Payout transaction recorded: ${policy.coverageAmount}")
            return True
        else:
            logger.error("❌ Transaction failed")
            return False
            
    except Exception as e:
        logger.error(f"❌ Failed to settle policy: {e}")
        return False


def simulate_flight_delay(flight_id, delay_minutes):
    """
    Simulate a flight delay and settle all associated insurance policies.
    
    Args:
        flight_id: Flight ID to delay
        delay_minutes: How delayed the flight is (in minutes)
    """
    try:
        flight = Flight.objects.get(flightId=flight_id)
        logger.info(f"✈️  Flight {flight_id}: {flight.origin} → {flight.destination}")
        
        # Update flight status to Delayed
        delayed_status = StatusLookup.objects.filter(
            code='Delayed',
            statusType='flight'
        ).first()
        
        if not delayed_status:
            delayed_status = StatusLookup.objects.create(
                code='Delayed',
                statusType='flight'
            )
        
        flight.status = delayed_status
        flight.save()
        logger.info(f"📍 Flight status updated to: Delayed ({delay_minutes} minutes)")
        
        # Find all active policies for this flight
        policies = InsurancePolicy.objects.filter(
            booking__flight=flight,
            status__code='Active'
        )
        
        logger.info(f"🔍 Found {policies.count()} active insurance policies")
        
        settled_count = 0
        for policy in policies:
            logger.info(f"\n{'='*60}")
            logger.info(f"Policy #{policy.policyId}")
            logger.info(f"  User: {policy.booking.user.name}")
            logger.info(f"  Coverage: ${policy.coverageAmount}")
            logger.info(f"  Premium: ${policy.premium}")
            
            # Check if delay exceeds threshold (we'll use 180 minutes as default)
            # In reality, this would come from the blockchain policy
            threshold = 180  # 3 hours
            
            if delay_minutes >= threshold:
                logger.info(f"  ✅ Delay ({delay_minutes}m) >= Threshold ({threshold}m)")
                logger.info(f"  💰 Triggering payout of ${policy.coverageAmount}...")
                
                if settle_policy_on_chain(policy, delay_minutes):
                    settled_count += 1
                    logger.info(f"  ✅ PAYOUT SUCCESSFUL!")
                else:
                    logger.warning(f"  ⚠️  Payout failed (check blockchain)")
            else:
                logger.info(f"  ℹ️  Delay ({delay_minutes}m) < Threshold ({threshold}m)")
                logger.info(f"  No payout triggered")
        
        logger.info(f"\n{'='*60}")
        logger.info(f"🎉 Settlement complete!")
        logger.info(f"   {settled_count}/{policies.count()} policies paid out")
        
    except Flight.DoesNotExist:
        logger.error(f"❌ Flight {flight_id} not found")
    except Exception as e:
        logger.error(f"❌ Error simulating delay: {e}")


def auto_monitor():
    """Monitor all flights and automatically settle delayed ones."""
    logger.info("🤖 Auto-monitoring mode - checking all flights...")
    
    # Get all flights with active policies
    active_policies = InsurancePolicy.objects.filter(
        status__code='Active'
    ).select_related('booking__flight')
    
    flights_checked = set()
    
    for policy in active_policies:
        flight = policy.booking.flight
        
        if flight.flightId in flights_checked:
            continue
        
        flights_checked.add(flight.flightId)
        
        # Check if flight is delayed
        if flight.status.code == 'Delayed':
            logger.info(f"\n⚠️  Delayed flight detected: {flight.flightId}")
            # Simulate 240 minutes (4 hours) delay
            simulate_flight_delay(flight.flightId, 240)


def main():
    parser = argparse.ArgumentParser(description='Oracle Simulator for Flight Insurance')
    parser.add_argument('--flight-id', type=int, help='Flight ID to delay')
    parser.add_argument('--delay', type=int, help='Delay in minutes')
    parser.add_argument('--auto', action='store_true', help='Auto-monitor all flights')
    
    args = parser.parse_args()
    
    logger.info("🚀 Oracle Simulator Starting...")
    logger.info("="*60)
    
    if args.auto:
        auto_monitor()
    elif args.flight_id and args.delay:
        simulate_flight_delay(args.flight_id, args.delay)
    else:
        logger.error("❌ Please specify --flight-id and --delay, or use --auto")
        logger.info("\nExamples:")
        logger.info("  python oracle_simulator.py --flight-id 1 --delay 240")
        logger.info("  python oracle_simulator.py --auto")


if __name__ == '__main__':
    main()
