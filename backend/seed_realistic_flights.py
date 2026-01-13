"""
Seed realistic flight data with various statuses for testing.

This creates flights that are:
- Scheduled for different times (past, present, future)
- Have different statuses (On-Time, Delayed, Cancelled)
- Realistic origins/destinations
- Proper departure/arrival times
"""

import os
import sys
import django
from pathlib import Path

# Setup Django
sys.path.insert(0, str(Path(__file__).parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import Flight, StatusLookup
from datetime import datetime, timedelta
from faker import Faker
import random

fake = Faker()

# Realistic flight routes
ROUTES = [
    ("New York JFK", "London Heathrow"),
    ("Los Angeles LAX", "Tokyo Narita"),
    ("Dubai DXB", "Singapore Changi"),
    ("Paris CDG", "New York JFK"),
    ("Istanbul IST", "Baku GYD"),
    ("London Heathrow", "Dubai DXB"),
    ("Frankfurt FRA", "Sydney SYD"),
    ("Amsterdam AMS", "Toronto YYZ"),
    ("Hong Kong HKG", "San Francisco SFO"),
    ("Moscow SVO", "Beijing PEK"),
]

def create_flight_statuses():
    """Create flight status lookups if they don't exist."""
    statuses = [
        ('Scheduled', 'flight'),
        ('On-Time', 'flight'),
        ('Delayed', 'flight'),
        ('Cancelled', 'flight'),
        ('Departed', 'flight'),
        ('Arrived', 'flight'),
    ]
    
    created = []
    for code, stype in statuses:
        status, created_now = StatusLookup.objects.get_or_create(
            code=code,
            statusType=stype
        )
        if created_now:
            created.append(code)
    
    if created:
        print(f"✅ Created statuses: {', '.join(created)}")
    
    return {code: StatusLookup.objects.get(code=code, statusType='flight') 
            for code, _ in statuses}


def seed_realistic_flights(count=20):
    """Create realistic flight data."""
    print(f"🌍 Creating {count} realistic flights...")
    
    statuses = create_flight_statuses()
    now = datetime.now()
    
    flights_created = 0
    
    for i in range(count):
        origin, destination = random.choice(ROUTES)
        
        # Random departure time (past, present, or future)
        hours_offset = random.randint(-24, 72)  # -1 day to +3 days
        departure = now + timedelta(hours=hours_offset)
        
        # Flight duration based on distance
        duration_hours = random.randint(2, 15)
        arrival = departure + timedelta(hours=duration_hours)
        
        # Assign status based on timing
        if hours_offset < -2:  # Past flights
            status_choice = random.choice([
                statuses['Arrived'],
                statuses['Delayed'],
            ])
        elif hours_offset < 0:  # Recently departed
            status_choice = random.choice([
                statuses['Departed'],
                statuses['Delayed'],
            ])
        else:  # Future flights
            status_choice = random.choice([
                statuses['Scheduled'],
                statuses['On-Time'],
                statuses['Delayed'],
                statuses['Cancelled'],
            ])
        
        # Create flight
        flight = Flight.objects.create(
            origin=origin,
            destination=destination,
            departureTime=departure,
            arrivalTime=arrival,
            status=status_choice
        )
        
        flights_created += 1
        
        status_emoji = {
            'Scheduled': '📅',
            'On-Time': '✅',
            'Delayed': '⏰',
            'Cancelled': '❌',
            'Departed': '🛫',
            'Arrived': '🛬',
        }.get(status_choice.code, '📍')
        
        print(f"  {status_emoji} Flight #{flight.flightId}: {origin} → {destination} "
              f"({status_choice.code}, {departure.strftime('%Y-%m-%d %H:%M')})")
    
    print(f"\n✅ Created {flights_created} flights!")
    
    # Show summary
    print("\n📊 Flight Status Summary:")
    for status in statuses.values():
        count = Flight.objects.filter(status=status).count()
        print(f"   {status.code}: {count} flights")


if __name__ == '__main__':
    print("🚀 Seeding Realistic Flight Data\n")
    seed_realistic_flights(20)
    print("\n🎉 Done! Flights are ready for testing.")
