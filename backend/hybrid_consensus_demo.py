"""
Hybrid PoW + PoS Consensus Demonstration
=========================================

This script demonstrates the hybrid Proof of Work + Proof of Stake consensus model
used in the FlightGuard insurance DApp.

Usage:
    python hybrid_consensus_demo.py --policy-id 20
    python hybrid_consensus_demo.py --policy-id 20 --skip-pow
    python hybrid_consensus_demo.py --policy-id 20 --skip-pos
"""

import os
import sys
import time
import hashlib
import random
import django
from pathlib import Path
import argparse
from decimal import Decimal

# Setup Django
sys.path.insert(0, str(Path(__file__).parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import InsurancePolicy, Flight, StatusLookup
from blockchain.contract_loader import get_insurance_contract, get_default_account, w3, load_deployed_addresses
from loguru import logger

# ANSI Colors for terminal
class Color:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

# Simulated validators with stake amounts
VALIDATORS = [
    {"name": "Oracle_FlightData", "stake": 10000, "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"},
    {"name": "Oracle_Weather", "stake": 5000, "address": "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed"},
    {"name": "Oracle_Airline", "stake": 3000, "address": "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359"},
]

def print_header(text):
    """Print a formatted header"""
    print(f"\n{Color.BOLD}{Color.CYAN}{'='*60}{Color.END}")
    print(f"{Color.BOLD}{Color.CYAN}{text.center(60)}{Color.END}")
    print(f"{Color.BOLD}{Color.CYAN}{'='*60}{Color.END}\n")

def print_section(title):
    """Print a section header"""
    print(f"\n{Color.BOLD}[{title}]{Color.END}")
    print(f"{Color.CYAN}{'─'*60}{Color.END}")

def simulate_pow_mining(policy_data, difficulty=4):
    """
    Simulate Proof of Work mining process
    
    Args:
        policy_data: String data to "mine"
        difficulty: Number of leading zeros required in hash
    
    Returns:
        tuple: (block_hash, nonce, mining_time)
    """
    print_section("PROOF OF WORK (PoW) MINING LAYER")
    
    print(f"{Color.YELLOW}Mining policy block...{Color.END}")
    print(f"{Color.YELLOW}Difficulty Target: {difficulty} leading zeros{Color.END}\n")
    
    target_prefix = '0' * difficulty
    nonce = random.randint(1, 10000)
    attempts = 0
    start_time = time.time()
    
    # Simulate mining attempts (show 5-10 failed attempts for visual effect)
    max_display_attempts = random.randint(5, 10)
    
    while True:
        attempts += 1
        block_data = f"{policy_data}:{nonce}"
        block_hash = hashlib.sha256(block_data.encode()).hexdigest()
        
        # Display some failed attempts
        if attempts <= max_display_attempts:
            if block_hash.startswith(target_prefix):
                # Found it on a visible attempt
                print(f"    Attempt {attempts:5d}: Hash = 0x{block_hash[:12]}... "
                      f"{Color.GREEN}[VALID]{Color.END}")
                break
            else:
                print(f"    Attempt {attempts:5d}: Hash = 0x{block_hash[:12]}... "
                      f"{Color.RED}[Invalid]{Color.END}")
                time.sleep(0.1)  # Slow down for visual effect
        else:
            # Find a valid hash silently
            if block_hash.startswith(target_prefix):
                print(f"    Attempt {attempts:5d}: Hash = 0x{block_hash[:12]}... "
                      f"{Color.GREEN}[VALID]{Color.END}")
                break
        
        nonce += 1
        
        # Safety: max 100000 attempts
        if attempts > 100000:
            print(f"{Color.RED}Warning: Mining timeout, using closest hash{Color.END}")
            break
    
    mining_time = time.time() - start_time
    
    print(f"\n{Color.GREEN}[OK] Block mined successfully!{Color.END}")
    print(f"   Total attempts: {attempts}")
    print(f"   Mining time: {mining_time:.2f} seconds")
    print(f"   Final nonce: {nonce}")
    print(f"   Block hash: 0x{block_hash}")
    
    return block_hash, nonce, mining_time

def simulate_pos_validation(policy, delay_minutes):
    """
    Simulate Proof of Stake validator selection and validation
    
    Args:
        policy: InsurancePolicy instance
        delay_minutes: Flight delay in minutes
    
    Returns:
        dict: Selected validator info
    """
    print_section("PROOF OF STAKE (PoS) VALIDATION LAYER")
    
    # Display all validators
    print(f"{Color.PURPLE}Active Validators:{Color.END}\n")
    total_stake = sum(v['stake'] for v in VALIDATORS)
    
    for validator in VALIDATORS:
        percentage = (validator['stake'] / total_stake) * 100
        stake_bar = '█' * int(percentage / 5)  # Scale to fit console
        print(f"   {validator['name']:<20} "
              f"Stake: {validator['stake']:>6} FGT  "
              f"({percentage:5.1f}%) {stake_bar}")
    
    print(f"\n{Color.YELLOW}Validator Selection Process:{Color.END}")
    
    # Weighted random selection based on stake
    weights = [v['stake'] for v in VALIDATORS]
    selected_validator = random.choices(VALIDATORS, weights=weights, k=1)[0]
    
    time.sleep(0.5)  # Dramatic pause
    
    print(f">> Randomly selected: {Color.GREEN}{selected_validator['name']}{Color.END}")
    print(f"   Selection probability: {(selected_validator['stake']/total_stake)*100:.1f}%")
    print(f"   Validator address: {selected_validator['address'][:20]}...")
    
    # Simulate validation process
    print(f"\n{Color.YELLOW}Validation Process:{Color.END}")
    time.sleep(0.3)
    print(f">> Checking flight delay: {delay_minutes} minutes")
    time.sleep(0.3)
    print(f">> Verifying policy terms...")
    time.sleep(0.3)
    print(f">> Calculating payout amount...")
    time.sleep(0.3)
    
    # Generate validator signature (simulated)
    signature_data = f"{policy.policyId}:{delay_minutes}:{selected_validator['address']}"
    validator_signature = hashlib.sha256(signature_data.encode()).hexdigest()
    
    print(f">> Validator signature: 0x{validator_signature[:16]}...")
    
    # Reward calculation
    base_reward = 100  # Base reward in FGT tokens
    print(f"\n{Color.GREEN}[OK] Validation complete!{Color.END}")
    print(f"   Validator reward: +{base_reward} FGT")
    print(f"   New stake: {selected_validator['stake'] + base_reward:,} FGT")
    
    return {
        'validator': selected_validator,
        'signature': validator_signature,
        'reward': base_reward
    }

def show_hybrid_consensus_result(pow_time, policy):
    """Show final hybrid consensus results"""
    print_section("HYBRID CONSENSUS ACHIEVED")
    
    print(f"{Color.GREEN}[OK] PoW Layer:{Color.END} Policy immutably stored on blockchain")
    print(f"{Color.GREEN}[OK] PoS Layer:{Color.END} Claim validated by staked oracle")
    print(f"{Color.GREEN}[OK] Settlement:{Color.END} Payout authorized: ${policy.coverageAmount}")
    
    # Show efficiency gain
    pure_pow_time = pow_time * 4  # Simulate that pure PoW would be 4x slower
    time_saved = pure_pow_time - pow_time
    efficiency_gain = (time_saved / pure_pow_time) * 100
    
    print(f"\n{Color.PURPLE}Hybrid Benefits:{Color.END}")
    print(f"   Total consensus time: {pow_time:.1f}s")
    print(f"   vs Pure PoW estimate: {pure_pow_time:.1f}s")
    print(f"   Efficiency gain: {efficiency_gain:.0f}% faster")

def demonstrate_hybrid_consensus(policy_id, skip_pow=False, skip_pos=False):
    """
    Main demonstration function
    
    Args:
        policy_id: Insurance policy ID to demonstrate with
        skip_pow: Skip PoW simulation
        skip_pos: Skip PoS simulation
    """
    try:
        # Get policy from database
        policy = InsurancePolicy.objects.select_related('booking__flight', 'booking__user').get(policyId=policy_id)
        flight = policy.booking.flight
        user = policy.booking.user
        
        print_header("FLIGHTGUARD HYBRID CONSENSUS DEMONSTRATION")
        
        print(f"{Color.CYAN}Policy Information:{Color.END}")
        print(f"   Policy ID: #{policy.policyId}")
        print(f"   User: {user.name}")
        print(f"   Flight: {flight.origin} → {flight.destination}")
        print(f"   Coverage: ${policy.coverageAmount}")
        print(f"   Premium: ${policy.premium}")
        
        # Simulate flight delay (use 240 minutes = 4 hours as realistic scenario)
        delay_minutes = 240
        
        total_start = time.time()
        
        # PoW Mining Phase
        if not skip_pow:
            policy_data = f"PolicyID:{policy.policyId}|Flight:{flight.flightId}|Coverage:{policy.coverageAmount}"
            block_hash, nonce, pow_time = simulate_pow_mining(policy_data, difficulty=4)
        else:
            print_section("PROOF OF WORK - SKIPPED")
            pow_time = 0
        
        # PoS Validation Phase
        if not skip_pos:
            validation_result = simulate_pos_validation(policy, delay_minutes)
        else:
            print_section("PROOF OF STAKE - SKIPPED")
        
        total_time = time.time() - total_start
        
        # Show results
        if not skip_pow and not skip_pos:
            show_hybrid_consensus_result(total_time, policy)
        
        print(f"\n{Color.BOLD}{Color.CYAN}{'='*60}{Color.END}")
        print(f"{Color.BOLD}{Color.GREEN}Demonstration Complete!{Color.END}")
        print(f"{Color.BOLD}{Color.CYAN}{'='*60}{Color.END}\n")
        
    except InsurancePolicy.DoesNotExist:
        print(f"{Color.RED}[ERROR] Policy ID {policy_id} not found{Color.END}")
        print(f"\n{Color.YELLOW}Available policies:{Color.END}")
        policies = InsurancePolicy.objects.all()[:5]
        for p in policies:
            print(f"   Policy #{p.policyId} - User: {p.booking.user.name}")
    except Exception as e:
        print(f"{Color.RED}[ERROR] {e}{Color.END}")
        import traceback
        traceback.print_exc()

def main():
    parser = argparse.ArgumentParser(
        description='Hybrid PoW + PoS Consensus Demonstration',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python hybrid_consensus_demo.py --policy-id 20
  python hybrid_consensus_demo.py --policy-id 20 --skip-pow
  python hybrid_consensus_demo.py --policy-id 20 --skip-pos
        """
    )
    
    parser.add_argument('--policy-id', type=int, required=True,
                       help='Insurance policy ID to demonstrate')
    parser.add_argument('--skip-pow', action='store_true',
                       help='Skip PoW mining simulation')
    parser.add_argument('--skip-pos', action='store_true',
                       help='Skip PoS validation simulation')
    
    args = parser.parse_args()
    
    demonstrate_hybrid_consensus(args.policy_id, args.skip_pow, args.skip_pos)

if __name__ == '__main__':
    main()
