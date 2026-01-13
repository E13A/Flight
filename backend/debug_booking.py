"""
Debug script to test booking creation without HTTP layer
Run this on the cloned laptop to see the actual error
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import Flight, StatusLookup, Booking, Ticket, Payment, InsurancePolicy
from django.contrib.auth.models import User
from datetime import datetime

print("=" * 60)
print("BOOKING DEBUG SCRIPT")
print("=" * 60)

# Test 1: Check User
print("\n[1/5] Checking User...")
try:
    user = User.objects.get(id=1)
    print(f"✅ User found: {user.username} (ID: {user.id})")
except Exception as e:
    print(f"❌ User error: {e}")
    exit(1)

# Test 2: Check Flight
print("\n[2/5] Checking Flight...")
try:
    flight = Flight.objects.get(flightId=1)
    print(f"✅ Flight found: {flight.origin} → {flight.destination}")
except Exception as e:
    print(f"❌ Flight error: {e}")
    exit(1)

# Test 3: Check Statuses
print("\n[3/5] Checking Statuses...")
try:
    confirmed = StatusLookup.objects.filter(code__iexact='Confirmed', statusType='booking').first()
    completed = StatusLookup.objects.filter(code__iexact='Completed', statusType='payment').first()
    active_policy = StatusLookup.objects.filter(code__iexact='Active', statusType='policy').first()
    
    print(f"  Confirmed status: {confirmed}")
    print(f"  Completed status: {completed}")
    print(f"  Active status: {active_policy}")
    
    if not confirmed or not completed or not active_policy:
        print("⚠️ Some statuses missing - creating them...")
        if not confirmed:
            confirmed = StatusLookup.objects.create(code='Confirmed', statusType='booking')
        if not completed:
            completed = StatusLookup.objects.create(code='Completed', statusType='payment')
        if not active_policy:
            active_policy = StatusLookup.objects.create(code='Active', statusType='policy')
        print("✅ Statuses created")
    else:
        print("✅ All statuses exist")
except Exception as e:
    print(f"❌ Status error: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

# Test 4: Try Creating Booking
print("\n[4/5] Creating Test Booking...")
try:
    booking = Booking.objects.create(
        user=user,
        flight=flight,
        bookingDate=datetime.now(),
        status=confirmed
    )
    print(f"✅ Booking created: ID {booking.bookingId}")
except Exception as e:
    print(f"❌ Booking creation error: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

# Test 5: Try Creating Ticket
print("\n[5/5] Creating Test Ticket...")
try:
    ticket = Ticket.objects.create(
        booking=booking,
        seatNumber="12A",
        company="Global Air",
        price=250.00,
        issueDate=datetime.now(),
        isPremium=False
    )
    print(f"✅ Ticket created: ID {ticket.ticketId}")
except Exception as e:
    print(f"❌ Ticket creation error: {e}")
    import traceback
    traceback.print_exc()
    # Clean up
    booking.delete()
    exit(1)

# Cleanup
print("\n[Cleanup] Deleting test data...")
booking.delete()  # Cascade should delete ticket too
print("✅ Test data deleted")

print("\n" + "=" * 60)
print("✅ ALL TESTS PASSED!")
print("Database is working correctly.")
print("The error must be in blockchain integration.")
print("=" * 60)
