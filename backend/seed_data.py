import os
import django
import random
from datetime import datetime, timedelta
from faker import Faker

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import (
    StatusLookup, AppUser, Developer, Flight, Booking, Ticket, 
    InsurancePolicy, Payment, InsuranceClaim
)

fake = Faker()

def create_status_lookups():
    # These match 02_seed.sql, usually they are already there or we need to ensure they exist.
    # Since we treat DB as external and seeded, maybe we verify or fetch them.
    # The prompt says "populate the database with realistic dummy data".
    # We'll assume the basic lookups might exist from seed.sql, but if not we can't create them 
    # if the table is managed=False and we treat it strict? 
    # Actually, managed=False just means Django doesn't do schema changes. We CAN Insert.
    # We will check if they exist, if not create them.
    
    statuses = [
        (1,'flight','Scheduled'), (2,'flight','On-Time'), (3,'flight','Delayed'),
        (4,'flight','Cancelled'), (5,'flight','Departed'), (6,'flight','Arrived'),
        (7,'booking','Pending'), (8,'booking','Confirmed'), (9,'booking','Cancelled'),
        (10,'booking','Completed'), (11,'booking','Failed'),
        (12,'policy','Pending'), (13,'policy','Active'), (14,'policy','Expired'),
        (15,'policy','Claimed'), (16,'policy','Closed'),
        (17,'payment','Pending'), (18,'payment','Completed'), (19,'payment','Failed'),
        (20,'payment','Refunded'), (21,'payment','Processing'), (22,'payment','Disputed')
    ]
    
    for sid, stype, code in statuses:
        if not StatusLookup.objects.filter(statusId=sid).exists():
            print(f"Creating Status: {stype}-{code}")
            StatusLookup.objects.create(statusId=sid, statusType=stype, code=code)

def create_users(n=10):
    users = []
    for _ in range(n):
        user = AppUser.objects.create(
            name=fake.name(),
            email=fake.unique.email(),
            phone=fake.phone_number()[:20]
        )
        users.append(user)
    print(f"Created {n} users")
    return users

def create_flights(n=10):
    origins = ['New York', 'London', 'Paris', 'Tokyo', 'Dubai', 'Singapore', 'Baku', 'Istanbul']
    destinations = ['Los Angeles', 'Berlin', 'Rome', 'Sydney', 'Doha', 'Hong Kong', 'Moscow', 'Toronto']
    flights = []
    
    scheduled = StatusLookup.objects.get(code='Scheduled', statusType='flight')
    
    for _ in range(n):
        origin = random.choice(origins)
        dest = random.choice([d for d in destinations if d != origin])
        dep = fake.future_datetime(end_date='+30d', tzinfo=None) # naive for simplicity or use aware if settings match
        arr = dep + timedelta(hours=random.randint(2, 14))
        
        flight = Flight.objects.create(
            origin=origin,
            destination=dest,
            departureTime=dep,
            arrivalTime=arr,
            status=scheduled
        )
        flights.append(flight)
    print(f"Created {n} flights")
    return flights

def clean_db():
    print("Cleaning DB (optional)...")
    # Be careful with cleaning if we want to preserve seed.sql data.
    # Maybe just add to it.

def run_seed():
    print("Seeding data...")
    try:
        create_status_lookups()
    except Exception as e:
        print(f"Skipping status creation (might exist): {e}")

    users = create_users(20)
    flights = create_flights(20)

    confirmed_booking = StatusLookup.objects.get(code='Confirmed', statusType='booking')
    completed_payment = StatusLookup.objects.get(code='Completed', statusType='payment')
    active_policy = StatusLookup.objects.get(code='Active', statusType='policy')

    for i in range(15):
        user = random.choice(users)
        flight = random.choice(flights)
        
        # Booking
        booking = Booking.objects.create(
            user=user,
            flight=flight,
            bookingDate=datetime.now(),
            status=confirmed_booking
        )
        
        # Ticket
        Ticket.objects.create(
            booking=booking,
            seatNumber=f"{random.randint(1,30)}{random.choice('ABCDEF')}",
            company="Global Air",
            price=random.uniform(200, 1500),
            issueDate=datetime.now(),
            isPremium=random.choice([True, False])
        )
        
        # Payment
        Payment.objects.create(
            booking=booking,
            amount=random.uniform(250, 1600),
            paymentMethod=random.choice(['Credit Card', 'PayPal']),
            paymentDate=datetime.now(),
            status=completed_payment
        )
        
        # Policy (some bookings have it)
        if random.choice([True, True, False]):
            policy = InsurancePolicy.objects.create(
                booking=booking,
                coverageAmount=1000.00,
                premium=50.00,
                status=active_policy
            )
            
            # Claim (rare)
            if random.choice([False, False, False, True]):
                claim_status = random.choice(['Pending', 'Approved'])
                InsuranceClaim.objects.create(
                    policy=policy,
                    delayDuration=random.uniform(2.0, 8.0),
                    claimStatus=claim_status,
                    payoutAmount=1000.00 if claim_status == 'Approved' else 0
                )
    
    print("Seeding complete.")

if __name__ == '__main__':
    run_seed()
